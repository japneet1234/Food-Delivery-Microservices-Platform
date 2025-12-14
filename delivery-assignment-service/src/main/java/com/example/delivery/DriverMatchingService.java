package com.example.delivery.service;

import org.springframework.data.geo.Circle;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DriverMatchingService {

    private static final String GEO_KEY = "delivery-partners";

    private final StringRedisTemplate redisTemplate;

    public DriverMatchingService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public Optional<Long> findNearestDriver(double lat, double lon) {

        org.springframework.data.geo.Point point = new org.springframework.data.geo.Point(lon, lat);
        Distance distance = new Distance(5, Metrics.KILOMETERS);
        var results = redisTemplate.opsForGeo()
                .search(GEO_KEY,
                        org.springframework.data.redis.domain.geo.GeoReference.fromCoordinate(point),
                        distance
                );

        if (results == null || results.getContent().isEmpty()) {
            return Optional.empty();
        }

        String driverId = results.getContent()
                .get(0)
                .getContent()
                .getName();

        return Optional.of(Long.parseLong(driverId));
    }
}
