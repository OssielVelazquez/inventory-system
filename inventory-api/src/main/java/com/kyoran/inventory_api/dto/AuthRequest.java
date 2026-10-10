package com.kyoran.inventory_api.dto;

public class AuthRequest {
    private String username;
    private String email;  // ← NUEVO CAMPO
    private String password;

    // Constructor vacío
    public AuthRequest() {}

    // Constructor con parámetros
    public AuthRequest(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Getters y Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {  // ← NUEVO
        return email;
    }

    public void setEmail(String email) {  // ← NUEVO
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}