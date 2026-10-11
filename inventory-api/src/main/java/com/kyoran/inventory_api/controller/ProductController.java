package com.kyoran.inventory_api.controller;

import com.kyoran.inventory_api.entity.Categories;
import com.kyoran.inventory_api.entity.Product;
import com.kyoran.inventory_api.repository.CategoriesRepository;
import com.kyoran.inventory_api.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoriesRepository categoriesRepository;

    // Listar todos los productos
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Obtener producto por ID
    @GetMapping("/{id}")
    public Optional<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id);
    }

    // Crear un nuevo producto
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        // Asignar la relación category si viene el category_id
        if (product.getCategory_id() > 0) {
            Categories category = categoriesRepository.findById(product.getCategory_id())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            product.setCategory(category);
        }
        return productRepository.save(product);
    }

    // Actualizar un producto existente
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setCategory_id(productDetails.getCategory_id());

        // Actualizar también la relación
        if (productDetails.getCategory_id() > 0) {
            Categories category = categoriesRepository.findById(productDetails.getCategory_id())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            product.setCategory(category);
        }

        return productRepository.save(product);
    }

    // Eliminar un producto por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        productRepository.delete(product);
        return ResponseEntity.ok("Producto con ID " + id + " eliminado correctamente");
    }
}