package com.kyoran.inventory_api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = true)
    private String description;

    @Column(nullable = false)
    private double price;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", insertable = false, updatable = false)
    private Categories category;

    @Column(name = "category_id", nullable = true)
    private long category_id;

    public Product() {}

    public Product(String name, String description, double price, long category_id) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category_id = category_id;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public Categories getCategory() { return category; }
    public void setCategory(Categories category) { this.category = category; }

    public long getCategory_id() { return category_id; }
    public void setCategory_id(long category_id) { this.category_id = category_id; }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", category_id=" + category_id +
                '}';
    }
}