package com.kyoran.inventory_api.controller;

import com.kyoran.inventory_api.dto.AuthRequest;
import com.kyoran.inventory_api.entity.User;
import com.kyoran.inventory_api.repository.UserRepository;
import com.kyoran.inventory_api.security.JwtTokenProvider;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        log.debug("Intento de login para usuario: {}", request.getUsername());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            String userRole = user.getRole();
            if (userRole != null) {
                userRole = userRole.trim().toUpperCase();
            }

            String token = jwtTokenProvider.generateToken(authentication);
            log.info("Login exitoso para usuario: {}", user.getUsername());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", user.getUsername());
            response.put("role", userRole);
            response.put("email", user.getEmail());
            response.put("userId", user.getId());
            response.put("enabled", user.getEnabled());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error en login para usuario {}: {}", request.getUsername(), e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Credenciales inválidas"
            ));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        }

        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            String userRole = user.getRole();
            if (userRole != null) {
                userRole = userRole.trim().toUpperCase();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("role", userRole);
            response.put("enabled", user.getEnabled());
            response.put("authenticated", true);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error obteniendo usuario actual: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Error interno"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "Logout exitoso"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        log.debug("Intento de registro para usuario: {}", request.getUsername());

        try {
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El usuario ya existe"));
            }

            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("error", "El correo electrónico ya está registrado"));
            }

            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole("USER");
            user.setEnabled(true);

            User savedUser = userRepository.save(user);
            log.info("Usuario registrado: {} (id: {})", savedUser.getUsername(), savedUser.getId());

            return ResponseEntity.ok(Map.of(
                    "message", "Usuario creado exitosamente",
                    "username", user.getUsername(),
                    "email", user.getEmail()
            ));

        } catch (Exception e) {
            log.error("Error registrando usuario: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear usuario"));
        }
    }
}