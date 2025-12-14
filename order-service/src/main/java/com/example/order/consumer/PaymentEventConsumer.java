package com.example.order.consumer;

import com.example.order.entity.Order;
import com.example.order.repository.OrderRepository;
import com.example.shared.enums.OrderStatus;
import com.example.shared.events.PaymentFailedEvent;
import com.example.shared.events.PaymentSuccessEvent;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@KafkaListener(topics = "payment-events", groupId = "order-service")
public class PaymentEventConsumer {

    private final OrderRepository orderRepository;

    public PaymentEventConsumer(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @KafkaHandler
    public void onPaymentSuccess(PaymentSuccessEvent successEvent) {
        updateOrderStatus(successEvent.orderId, OrderStatus.CONFIRMED);
        System.out.println("✅ Order CONFIRMED: " + successEvent.orderId);
    }

    @KafkaHandler
    public void onPaymentFailed(PaymentFailedEvent failedEvent) {
        updateOrderStatus(failedEvent.orderId, OrderStatus.CANCELLED);
        System.out.println("❌ Order CANCELLED: " + failedEvent.orderId);
    }

    private void updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setStatus(status);
        orderRepository.save(order);
    }
}