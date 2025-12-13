package com.example.restaurant.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "menu_items")
public class MenuItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double price;
    private Boolean available = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id")
    @JsonIgnore
    private Restaurant restaurant;

    // getters & setters
    public Long getId(){return id;}
    public void setId(Long id){this.id = id;}
    public String getName(){return name;}
    public void setName(String name){this.name = name;}
    public Double getPrice(){return price;}
    public void setPrice(Double price){this.price = price;}
    public Boolean getAvailable(){return available;}
    public void setAvailable(Boolean a){this.available=a;}
    public Restaurant getRestaurant(){return restaurant;}
    public void setRestaurant(Restaurant r){this.restaurant = r;}
}
