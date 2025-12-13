package com.example.restaurant.controller;

import com.example.restaurant.entity.MenuItem;
import com.example.restaurant.entity.Restaurant;
import com.example.restaurant.service.RestaurantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/restaurants")
public class RestaurantController {
    private final RestaurantService service;

    public RestaurantController(RestaurantService service) { this.service = service; }

    @GetMapping("/health")
    public ResponseEntity<String> health() { return ResponseEntity.ok("OK"); }

    @PostMapping
    public ResponseEntity<Restaurant> create(@RequestBody Restaurant r) {
        Restaurant saved = service.createRestaurant(r);
        return ResponseEntity.created(URI.create("/restaurants/" + saved.getId())).body(saved);
    }

    @GetMapping
    public List<Restaurant> all() { return service.getAllRestaurants(); }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> get(@PathVariable Long id) {
        return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/menu")
    public ResponseEntity<MenuItem> addMenu(@PathVariable Long id, @RequestBody MenuItem item) {
        MenuItem saved = service.addMenuItem(id, item);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}/menu")
    public List<MenuItem> menu(@PathVariable Long id) {
        return service.getMenuItems(id);
    }
}
