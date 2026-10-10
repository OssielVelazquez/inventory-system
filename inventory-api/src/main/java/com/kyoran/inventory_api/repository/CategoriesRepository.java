package com.kyoran.inventory_api.repository;

import com.kyoran.inventory_api.entity.Categories;
import org.springframework.data.jpa.repository.JpaRepository;

public interface  CategoriesRepository extends JpaRepository<Categories, Long>{
    Categories findByName(String name);
}
