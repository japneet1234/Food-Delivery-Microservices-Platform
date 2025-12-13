package com.example.order.service;

import com.example.order.dto.MenuItemDto;
import com.example.order.dto.RestaurantDto;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Component
public class RestaurantClient {

    private final RestTemplate restTemplate;
    private static final String BASE_URL = "http://localhost:8080";

    public RestaurantClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public RestaurantDto getRestaurant(Long restaurantId) {
        return restTemplate.getForObject(
                BASE_URL + "/restaurants/" + restaurantId,
                RestaurantDto.class
        );
    }

    public List<MenuItemDto> getMenuItems(Long restaurantId) {
        MenuItemDto[] items = restTemplate.getForObject(
                BASE_URL + "/restaurants/" + restaurantId + "/menu",
                MenuItemDto[].class
        );
        return Arrays.asList(items);
    }
}
