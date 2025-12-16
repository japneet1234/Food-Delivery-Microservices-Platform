package com.example.order.service;

import com.example.order.dto.CreateOrderRequest;
import com.example.order.dto.MenuItemDto;
import com.example.order.dto.OrderItemRequest;
import com.example.order.dto.RestaurantDto;
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
    private final RestaurantClient restaurantClient;

    public OrderService(OrderRepository orderRepository,
                        OrderEventProducer eventProducer,
                        RestaurantClient restaurantClient) {
        this.orderRepository = orderRepository;
        this.eventProducer = eventProducer;
        this.restaurantClient = restaurantClient;
    }

    /**
     * Places an order by:
     * 1. Validating restaurant exists
     * 2. Validating menu items & prices from Restaurant Service
     * 3. Saving order + items in DB
     * 4. Publishing OrderPlacedEvent to Kafka
     */
    @Transactional
    public Order placeOrder(CreateOrderRequest request) {

        /* -------------------------------
           1. Validate restaurant
           ------------------------------- */
        RestaurantDto restaurant =
                restaurantClient.getRestaurant(request.getRestaurantId());

        if (restaurant == null) {
            throw new RuntimeException("Restaurant not found");
        }

        /* -------------------------------
           2. Fetch menu from Restaurant Service
           ------------------------------- */
        List<MenuItemDto> menuItems =
                restaurantClient.getMenuItems(request.getRestaurantId());

        if (menuItems == null || menuItems.isEmpty()) {
            throw new RuntimeException("Menu not available");
        }

        /* -------------------------------
           3. Build Order aggregate
           ------------------------------- */
        Order order = new Order();
        order.setRestaurantId(request.getRestaurantId());
        order.setStatus(OrderStatus.PLACED);
        order.setCreatedAt(Instant.now());

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (OrderItemRequest itemReq : request.getItems()) {

            // Validate menu item
            MenuItemDto menuItem = menuItems.stream()
                    .filter(m -> m.getId().equals(itemReq.getMenuItemId()))
                    .findFirst()
                    .orElseThrow(() ->
                            new RuntimeException("Invalid menu item: " + itemReq.getMenuItemId())
                    );

            if (!menuItem.getAvailable()) {
                throw new RuntimeException("Menu item not available: " + menuItem.getId());
            }

            // Create OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setMenuItemId(menuItem.getId());
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setPrice(menuItem.getPrice());
            orderItem.setOrder(order);

            totalAmount += menuItem.getPrice() * itemReq.getQuantity();
            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        /* -------------------------------
           4. Persist Order
           ------------------------------- */
        Order savedOrder = orderRepository.save(order);

        /* -------------------------------
           5. Publish Kafka Event
           ------------------------------- */
        OrderPlacedEvent event = new OrderPlacedEvent();
        event.orderId = savedOrder.getId();
        event.restaurantId = savedOrder.getRestaurantId();
        event.totalAmount = savedOrder.getTotalAmount();
        event.timestamp = Instant.now().toString();

        eventProducer.publish(event);

        return savedOrder;
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }
}
