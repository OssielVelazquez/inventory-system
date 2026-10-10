package com.kyoran.inventory_api.repository;

import com.kyoran.inventory_api.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long>{
    Product findByName(String name);
}
