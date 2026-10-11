package com.kyoran.inventory_api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kyoran.inventory_api.entity.Product;
import com.kyoran.inventory_api.repository.ProductRepository;
import com.kyoran.inventory_api.repository.StockRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Product testProduct;

    @BeforeEach
    void setUp() {
        // 1. Limpiar stock primero (por la FK constraint)
        stockRepository.deleteAll();

        // 2. Ahora sí, limpiar productos
        productRepository.deleteAll();

        // 3. Crear un producto de prueba
        testProduct = new Product();
        testProduct.setName("Test Product");
        testProduct.setDescription("Test Description");
        testProduct.setPrice(99.99);
        testProduct.setCategory_id(1);
        testProduct = productRepository.save(testProduct);
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void getAllProducts_shouldReturnListOfProducts() throws Exception {
        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].name").value("Test Product"))
                .andExpect(jsonPath("$[0].price").value(99.99));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void getProductById_shouldReturnProduct() throws Exception {
        mockMvc.perform(get("/products/" + testProduct.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Product"))
                .andExpect(jsonPath("$.id").value(testProduct.getId()));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void createProduct_shouldReturnCreatedProduct() throws Exception {
        Product newProduct = new Product();
        newProduct.setName("New Product");
        newProduct.setDescription("New Description");
        newProduct.setPrice(49.99);
        newProduct.setCategory_id(1);

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newProduct)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Product"))
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void updateProduct_shouldReturnUpdatedProduct() throws Exception {
        testProduct.setName("Updated Name");

        mockMvc.perform(put("/products/" + testProduct.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testProduct)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Name"));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void deleteProduct_shouldReturnSuccessMessage() throws Exception {
        mockMvc.perform(delete("/products/" + testProduct.getId()))
                .andExpect(status().isOk());
    }

    @Test
    void getAllProducts_withoutAuth_shouldReturn403() throws Exception {
        mockMvc.perform(get("/products"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    void deleteProduct_asUser_shouldReturn403() throws Exception {
        mockMvc.perform(delete("/products/" + testProduct.getId()))
                .andExpect(status().isForbidden());
    }
}