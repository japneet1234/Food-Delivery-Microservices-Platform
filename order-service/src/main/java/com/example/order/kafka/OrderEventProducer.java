package com.example.order.kafka;

import com.example.shared.events.OrderPlacedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class OrderEventProducer {

    private static final String TOPIC = "order-events";
    private static final Logger log = LoggerFactory.getLogger(OrderEventProducer.class);

    private final KafkaTemplate<String, OrderPlacedEvent> kafkaTemplate;

    public OrderEventProducer(KafkaTemplate<String, OrderPlacedEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publish(OrderPlacedEvent event) {
        try {
            kafkaTemplate.send(TOPIC, event.orderId.toString(), event);
        } catch (Exception e) {
            // Do not fail order creation if Kafka is unavailable
            log.warn("Failed to publish OrderPlacedEvent to Kafka: {}", e.getMessage());
        }
    }
}
