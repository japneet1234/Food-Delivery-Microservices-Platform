package com.example.order.consumer;
import com.example.order.entity.Order;
import com.example.shared.enums.OrderStatus;
import com.example.order.repository.OrderRepository;
import com.example.shared.events.DeliveryCompletedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;


@Component
public class DeliveryCompletedConsumer {

    private final OrderRepository orderRepository;

    public DeliveryCompletedConsumer(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @KafkaListener(
        topics = "delivery-completed-events",
        groupId = "order-service"
    )
    public void handle(DeliveryCompletedEvent event) {

        Order order = orderRepository
                .findById(event.orderId)
                .orElseThrow();

        order.setStatus(OrderStatus.DELIVERED);
        orderRepository.save(order);

        System.out.println(
            "📦 Order " + event.orderId + " marked DELIVERED"
        );
    }
}

