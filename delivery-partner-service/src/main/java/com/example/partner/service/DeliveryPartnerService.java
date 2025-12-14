package com.example.partner.service;

import com.example.partner.dto.CreatePartnerRequest;
import com.example.partner.dto.UpdateLocationRequest;
import com.example.partner.entity.DeliveryPartner;
import com.example.partner.enums.PartnerStatus;
import com.example.partner.repository.DeliveryPartnerRepository;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class DeliveryPartnerService {

    private final DeliveryPartnerRepository repository;
    private final StringRedisTemplate redisTemplate;

    private static final String GEO_KEY = "delivery-partners";

    public DeliveryPartnerService(
            DeliveryPartnerRepository repository,
            StringRedisTemplate redisTemplate) {
        this.repository = repository;
        this.redisTemplate = redisTemplate;
    }

    public DeliveryPartner create(CreatePartnerRequest req) {
        DeliveryPartner p = new DeliveryPartner();
        p.setName(req.name);
        p.setStatus(PartnerStatus.OFFLINE);
        return repository.save(p);
    }

    public DeliveryPartner updateLocation(Long id, UpdateLocationRequest req) {
        DeliveryPartner p = repository.findById(id).orElseThrow();
        p.setCurrentLat(req.lat);
        p.setCurrentLon(req.lon);

        redisTemplate.opsForGeo()
                .add(GEO_KEY, new org.springframework.data.geo.Point(req.lon, req.lat), id.toString());

        return repository.save(p);
    }

    public DeliveryPartner markAvailable(Long id) {
        DeliveryPartner p = repository.findById(id).orElseThrow();
        p.setStatus(PartnerStatus.AVAILABLE);
        return repository.save(p);
    }

    public DeliveryPartner markBusy(Long id) {
        DeliveryPartner p = repository.findById(id).orElseThrow();
        p.setStatus(PartnerStatus.BUSY);
        return repository.save(p);
    }
}
