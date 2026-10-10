// src/main/java/com/kyoran/inventory_api/dto/AuthResponse.java
package com.kyoran.inventory_api.dto;

public class AuthResponse {
    private String token;
    private String username;
    private String role;

    // Constructor
    public AuthResponse(String token, String username, String role) {
        this.token = token;
        this.username = username;
        this.role = role;
    }

    // Getters
    public String getToken() {
        return token;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }
}