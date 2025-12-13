package com.example.order.service;

import com.example.order.dto.CreateOrderRequest;
import com.example.order.dto.OrderItemRequest;
import com.example.order.entity.Order;
import com.example.order.entity.OrderItem;
import com.example.order.kafka.OrderEventProducer;
import com.example.order.repository.OrderRepository;
import com.example.shared.enums.OrderStatus;
import com.example.shared.events.OrderPlacedEvent;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderEventProducer eventProducer;

    public OrderService(OrderRepository orderRepository,
                        OrderEventProducer eventProducer) {
        this.orderRepository = orderRepository;
        this.eventProducer = eventProducer;
    }

    @Transactional
    public Order placeOrder(CreateOrderRequest request) {

        // NOTE: restaurant/menu validation will be added next step

        Order order = new Order();
        order.setRestaurantId(request.getRestaurantId());
        order.setStatus(OrderStatus.PLACED);
        order.setCreatedAt(Instant.now());

        List<OrderItem> items = new ArrayList<>();
        double total = 0;

        for (OrderItemRequest itemReq : request.getItems()) {
            OrderItem item = new OrderItem();
            item.setMenuItemId(itemReq.getMenuItemId());
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(100.0); // TEMP (will fetch real price)
            item.setOrder(order);

            total += item.getPrice() * item.getQuantity();
            items.add(item);
        }

        order.setItems(items);
        order.setTotalAmount(total);

        Order savedOrder = orderRepository.save(order);

        // Publish Kafka event
        OrderPlacedEvent event = new OrderPlacedEvent();
        event.orderId = savedOrder.getId();
        event.restaurantId = savedOrder.getRestaurantId();
        event.totalAmount = savedOrder.getTotalAmount();
        event.timestamp = Instant.now().toString();

        eventProducer.publish(event);

        return savedOrder;
    }
}
