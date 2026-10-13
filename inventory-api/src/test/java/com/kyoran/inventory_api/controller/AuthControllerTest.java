package com.kyoran.inventory_api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kyoran.inventory_api.dto.AuthRequest;
import com.kyoran.inventory_api.entity.User;
import com.kyoran.inventory_api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // Limpiar usuarios de test (excepto los demo)
        userRepository.findByUsername("testuser").ifPresent(userRepository::delete);

        // Crear un usuario de prueba
        User testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("test@inventory.com");
        testUser.setPassword(passwordEncoder.encode("test123"));
        testUser.setRole("USER");
        testUser.setEnabled(true);
        userRepository.save(testUser);
    }

    @Test
    void login_withValidCredentials_shouldReturnToken() throws Exception {
        AuthRequest loginRequest = new AuthRequest("testuser", null, "test123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void login_withInvalidPassword_shouldReturnBadRequest() throws Exception {
        AuthRequest loginRequest = new AuthRequest("testuser", null, "wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_withNonExistentUser_shouldReturnBadRequest() throws Exception {
        AuthRequest loginRequest = new AuthRequest("nonexistent", null, "whatever");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_withNewUser_shouldCreateUser() throws Exception {
        AuthRequest registerRequest = new AuthRequest();
        registerRequest.setUsername("newuser");
        registerRequest.setEmail("newuser@inventory.com");
        registerRequest.setPassword("newpass123");

        // Limpiar si existe
        userRepository.findByUsername("newuser").ifPresent(userRepository::delete);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("newuser"))
                .andExpect(jsonPath("$.email").value("newuser@inventory.com"));

        // Verificar que se creó con rol USER
        User createdUser = userRepository.findByUsername("newuser").orElseThrow();
        assert createdUser.getRole().equals("USER");
        assert createdUser.getEnabled();

        // Limpiar
        userRepository.delete(createdUser);
    }

    @Test
    void register_withExistingUsername_shouldReturnBadRequest() throws Exception {
        AuthRequest registerRequest = new AuthRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setEmail("another@inventory.com");
        registerRequest.setPassword("whatever");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("El usuario ya existe"));
    }

    @Test
    void register_withExistingEmail_shouldReturnBadRequest() throws Exception {
        AuthRequest registerRequest = new AuthRequest();
        registerRequest.setUsername("anotheruser");
        registerRequest.setEmail("test@inventory.com");
        registerRequest.setPassword("whatever");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("El correo electrónico ya está registrado"));
    }

    @Test
    void getCurrentUser_withoutAuth_shouldReturn401() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }
}