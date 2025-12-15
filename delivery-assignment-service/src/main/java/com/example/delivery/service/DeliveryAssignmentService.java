package com.example.delivery.service;

import com.example.shared.events.DeliveryAssignedEvent;
import org.springframework.data.geo.Circle;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Set;
import org.springframework.data.redis.connection.RedisGeoCommands.GeoLocation;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.geo.GeoResult;

@Service
public class DeliveryAssignmentService {

    private static final String GEO_KEY = "delivery-partners";

    private final StringRedisTemplate redisTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final RestTemplate restTemplate = new RestTemplate();


    public DeliveryAssignmentService(StringRedisTemplate redisTemplate,
                                     KafkaTemplate<String, Object> kafkaTemplate) {
        this.redisTemplate = redisTemplate;
        this.kafkaTemplate = kafkaTemplate;
        
    }

    public void assignDelivery(Long orderId) {

        // Mock restaurant location
        Point restaurantLocation = new Point(77.59, 12.97); // Bangalore

        // Find nearest partner within 5 km
        GeoResults<GeoLocation<String>> results = redisTemplate.opsForGeo()
            .search(
                GEO_KEY,
                new Circle(restaurantLocation, new Distance(5, Metrics.KILOMETERS))
            );

        Set<String> partners = results.getContent()
            .stream()
            .map((GeoResult<GeoLocation<String>> r) -> r.getContent().getName())
            .collect(java.util.stream.Collectors.toSet());

        if (partners.isEmpty()) {
            System.out.println("❌ No delivery partner found for order " + orderId);
            return;
        }

        String partnerId = partners.iterator().next();

        redisTemplate.opsForGeo()
                .remove("delivery-partners", partnerId.toString());

        DeliveryAssignedEvent event = new DeliveryAssignedEvent();
        event.orderId = orderId;
        event.partnerId = Long.valueOf(partnerId);
        event.timestamp = Instant.now().toString();

        kafkaTemplate.send("delivery-events",
                orderId.toString(), event);

        System.out.println("🚴 Assigned partner " + partnerId + " to order " + orderId);


        // Mark partner as BUSY via API call
        // Later, use Kafka instead of direct REST call

        restTemplate.put(
            "http://localhost:8084/partners/" + partnerId + "/busy",
            null
                );
    }
}
