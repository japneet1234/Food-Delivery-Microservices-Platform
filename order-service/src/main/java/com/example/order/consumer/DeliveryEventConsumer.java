package com.example.order.consumer;

import com.example.order.entity.Order;
import com.example.order.repository.OrderRepository;
import com.example.shared.enums.OrderStatus;
import com.example.shared.events.DeliveryAssignedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DeliveryEventConsumer {

    private final OrderRepository orderRepository;

    public DeliveryEventConsumer(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @KafkaListener(
        topics = "delivery-events",
        groupId = "order-service",
        containerFactory = "deliveryAssignedKafkaListenerContainerFactory"
    )
    @Transactional
    public void handleDeliveryAssigned(DeliveryAssignedEvent event) {
        System.out.println("[DeliveryEventConsumer] Received event: " + event);
        if (event == null) {
            System.err.println("[DeliveryEventConsumer] Received null event!");
            return;
        }
        System.out.println("[DeliveryEventConsumer] Received: order=" + event.orderId + ", partner=" + event.partnerId);
        Order order = orderRepository.findById((Long) event.orderId)
            .orElseThrow(() ->
                new RuntimeException("Order not found: " + event.orderId));

        order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
        order.setDeliveryPartnerId(event.partnerId);

        orderRepository.save(order);

        System.out.println(
            "🚚 Order " + event.orderId +
            " is OUT_FOR_DELIVERY with partner " + event.partnerId
        );
    }
}
