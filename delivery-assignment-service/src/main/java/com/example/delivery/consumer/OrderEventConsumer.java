package com.example.delivery.consumer;

import com.example.delivery.service.DriverMatchingService;
import com.example.shared.events.OrderPlacedEvent;
import com.example.shared.events.DeliveryAssignedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class OrderEventConsumer {


        private final DriverMatchingService matchingService;
        private final KafkaTemplate<String, Object> kafkaTemplate;
        private final RestTemplate restTemplate = new RestTemplate();

    public OrderEventConsumer(
            DriverMatchingService matchingService,
            KafkaTemplate<String, Object> kafkaTemplate) {
        this.matchingService = matchingService;
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(
            topics = "payment-success",
            groupId = "delivery-assignment"
    )
    public void handlePaymentSuccess(OrderPlacedEvent event) {

        // TEMP restaurant coordinates (later from restaurant service)
        double restaurantLat = 12.9716;
        double restaurantLon = 77.5946;

        matchingService.findNearestDriver(restaurantLat, restaurantLon)
                .ifPresent(driverId -> {

                    DeliveryAssignedEvent assignedEvent =
                            new DeliveryAssignedEvent(
                                    event.orderId,
                                    driverId
                            );

                    kafkaTemplate.send(
                            "delivery-events",
                            assignedEvent
                    );

                    System.out.println(
                            "🚚 Assigned driver " + driverId +
                            " to order " + event.orderId
                    );

                    // Mark driver as BUSY via API call
                    // Later, use Kafka instead of direct REST call
                    restTemplate.put(
                    "http://localhost:8084/partners/" + driverId + "/busy",
                    null
                    );

                });
    }
}
