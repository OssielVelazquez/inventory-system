package com.kyoran.inventory_api;

import com.kyoran.inventory_api.entity.User;
import com.kyoran.inventory_api.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        log.info("Inicializando usuarios demo...");

        createDemoUser("admin", "admin@inventory.com", "admin123", "ADMIN");
        createDemoUser("manager", "manager@inventory.com", "manager123", "MANAGER");
        createDemoUser("user", "user@inventory.com", "user123", "USER");

        log.info("Inicializacion de usuarios completada");
    }

    private void createDemoUser(String username, String email, String password, String role) {
        if (userRepository.findByUsername(username).isEmpty()) {
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
            user.setEnabled(true);

            userRepository.save(user);
            log.info("Usuario demo creado: {} ({})", username, role);
        } else {
            log.debug("Usuario ya existe: {}", username);
        }
    }
}