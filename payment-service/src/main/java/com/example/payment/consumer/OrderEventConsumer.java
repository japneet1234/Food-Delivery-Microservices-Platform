package com.example.payment.consumer;

import com.example.shared.events.OrderPlacedEvent;
import com.example.payment.service.PaymentService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderEventConsumer {

    private final PaymentService paymentService;

    public OrderEventConsumer(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @KafkaListener(topics = "order-events", groupId = "payment-service")
    public void handleOrderPlaced(OrderPlacedEvent event) {
        paymentService.processPayment(event);
    }
}
