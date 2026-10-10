package com.kyoran.inventory_api.controller;

import com.kyoran.inventory_api.entity.Stock;
import com.kyoran.inventory_api.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/stock")
public class StockController {

    @Autowired
    private StockRepository stockRepository;

    // Listar todo el stock
    @GetMapping
    public List<Stock> getAllStock() {
        return stockRepository.findAll();
    }

    // Obtener stock por ID
    @GetMapping("/{id}")
    public Optional<Stock> getStockById(@PathVariable Long id) {
        return stockRepository.findById(id);
    }

    // Crear nuevo registro de stock
    @PostMapping
    public Stock createStock(@RequestBody Stock stock) {
        return stockRepository.save(stock);
    }

    // Actualizar stock existente
    @PutMapping("/{id}")
    public Stock updateStock(@PathVariable Long id, @RequestBody Stock stockDetails) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock no encontrado con ID: " + id));

        stock.setProductId(stockDetails.getProductId()); // <-- cambiado
        stock.setQuantity(stockDetails.getQuantity());

        return stockRepository.save(stock);
    }

    // Eliminar registro de stock
    @DeleteMapping("/{id}")
    public String deleteStock(@PathVariable Long id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock no encontrado con ID: " + id));

        stockRepository.delete(stock);
        return "Stock con ID " + id + " eliminado correctamente";
    }
}
