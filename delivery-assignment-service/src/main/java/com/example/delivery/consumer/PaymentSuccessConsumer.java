package com.example.delivery.consumer;

import com.example.delivery.service.DeliveryAssignmentService;
import com.example.shared.events.PaymentSuccessEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class PaymentSuccessConsumer {

    private final DeliveryAssignmentService assignmentService;

    public PaymentSuccessConsumer(DeliveryAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @KafkaListener(topics = "payment-events", groupId = "delivery-assignment-service")
    public void handlePaymentSuccess(PaymentSuccessEvent event) {
        assignmentService.assignDelivery(event.orderId);
    }
}
