package com.example.partner.entity;

import com.example.partner.enums.PartnerStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "delivery_partners")
public class DeliveryPartner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private PartnerStatus status;

    private Double currentLat;
    private Double currentLon;

    public Long getId() { return id; }
    public String getName() { return name; }
    public PartnerStatus getStatus() { return status; }
    public Double getCurrentLat() { return currentLat; }
    public Double getCurrentLon() { return currentLon; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setStatus(PartnerStatus status) { this.status = status; }
    public void setCurrentLat(Double currentLat) { this.currentLat = currentLat; }
    public void setCurrentLon(Double currentLon) { this.currentLon = currentLon; }
}
