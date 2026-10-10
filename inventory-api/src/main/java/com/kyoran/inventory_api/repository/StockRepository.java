package com.kyoran.inventory_api.repository;

import com.kyoran.inventory_api.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository<Stock, Long> {
    Stock findByProductId(Long productId); // <-- coincide con la propiedad
}
