package com.kyoran.inventory_api.controller;

import com.kyoran.inventory_api.entity.Categories;
import com.kyoran.inventory_api.repository.CategoriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/categories")
public class CategoriesController {

    @Autowired
    private CategoriesRepository categoriesRepository;

    // Listar todas las categorías
    @GetMapping
    public List<Categories> getAllCategories() {
        return categoriesRepository.findAll();
    }

    // Obtener categoría por ID
    @GetMapping("/{id}")
    public Optional<Categories> getCategoryById(@PathVariable Long id) {
        return categoriesRepository.findById(id);
    }

    // Crear una nueva categoría
    @PostMapping
    public Categories createCategory(@RequestBody Categories category) {
        return categoriesRepository.save(category);
    }

    // Actualizar una categoría existente
    @PutMapping("/{id}")
    public Categories updateCategory(@PathVariable Long id, @RequestBody Categories categoryDetails) {
        Categories category = categoriesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));

        category.setName(categoryDetails.getName());
        return categoriesRepository.save(category);
    }

    // Eliminar una categoría por ID
    @DeleteMapping("/{id}")
    public String deleteCategory(@PathVariable Long id) {
        Categories category = categoriesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));

        categoriesRepository.delete(category);
        return "Categoría con ID " + id + " eliminada correctamente";
    }
}
