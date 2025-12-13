package com.example.payment.service;

import com.example.shared.events.OrderPlacedEvent;
import com.example.shared.events.PaymentFailedEvent;
import com.example.shared.events.PaymentSuccessEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Random;

@Service
public class PaymentService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final Random random = new Random();

    public PaymentService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void processPayment(OrderPlacedEvent event) {

        boolean success = random.nextBoolean(); // simulate gateway

        if (success) {
            PaymentSuccessEvent successEvent = new PaymentSuccessEvent();
            successEvent.orderId = event.orderId;
            successEvent.amount = event.totalAmount;
            successEvent.timestamp = Instant.now().toString();

            kafkaTemplate.send("payment-events",
                    event.orderId.toString(), successEvent);

            System.out.println("✅ Payment SUCCESS for order " + event.orderId);

        } else {
            PaymentFailedEvent failedEvent = new PaymentFailedEvent();
            failedEvent.orderId = event.orderId;
            failedEvent.reason = "Insufficient funds";
            failedEvent.timestamp = Instant.now().toString();

            kafkaTemplate.send("payment-events",
                    event.orderId.toString(), failedEvent);

            System.out.println("❌ Payment FAILED for order " + event.orderId);
        }
    }
}
