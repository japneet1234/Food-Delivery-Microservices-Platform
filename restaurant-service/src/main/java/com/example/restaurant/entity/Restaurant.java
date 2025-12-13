package com.example.restaurant.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Set;

@Entity
@Table(name = "restaurants")
public class Restaurant {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double locationLat;
    private Double locationLong;
    private Double rating;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<MenuItem> menuItems;

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName(){ return name; }
    public void setName(String name){ this.name = name; }
    public Double getLocationLat(){ return locationLat; }
    public void setLocationLat(Double l){ this.locationLat = l; }
    public Double getLocationLong(){ return locationLong; }
    public void setLocationLong(Double l){ this.locationLong = l; }
    public Double getRating(){ return rating; }
    public void setRating(Double r){ this.rating = r; }
    public Set<MenuItem> getMenuItems(){ return menuItems; }
    public void setMenuItems(Set<MenuItem> m){ this.menuItems = m; }
}
