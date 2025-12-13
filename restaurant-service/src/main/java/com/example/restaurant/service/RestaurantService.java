package com.example.restaurant.service;

import com.example.restaurant.entity.MenuItem;
import com.example.restaurant.entity.Restaurant;
import com.example.restaurant.repository.MenuItemRepository;
import com.example.restaurant.repository.RestaurantRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public RestaurantService(RestaurantRepository restaurantRepository, MenuItemRepository menuItemRepository) {
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @Cacheable("restaurants")
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    @Cacheable(value = "menuItems", key = "#restaurantId")
    public List<MenuItem> getMenuItems(Long restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    @Transactional
    @CacheEvict(value = {"restaurants","menuItems"}, allEntries = true)
    public Restaurant createRestaurant(Restaurant r) {
        return restaurantRepository.save(r);
    }

    @Transactional
    @CacheEvict(value = {"restaurants","menuItems"}, allEntries = true)
    public MenuItem addMenuItem(Long restaurantId, MenuItem item) {
        Restaurant r = restaurantRepository.findById(restaurantId).orElseThrow(() -> new RuntimeException("restaurant not found"));
        item.setRestaurant(r);
        return menuItemRepository.save(item);
    }

    public Optional<Restaurant> findById(Long id) {
        return restaurantRepository.findById(id);
    }
}
