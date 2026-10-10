package com.kyoran.inventory_api.repository;

import com.kyoran.inventory_api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // CORRECTO: Devuelve Optional<User>
    Optional<User> findByUsername(String username);

    // Métodos útiles que podrías necesitar
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    // Método para contar usuarios por rol
    long countByRole(String role);
}