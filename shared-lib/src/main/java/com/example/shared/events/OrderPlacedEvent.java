package com.example.shared.events;

import java.util.List;
import java.util.Map;

public class OrderPlacedEvent {
    public Long orderId;
    public Long restaurantId;
    public Double totalAmount;
    public List<Map<String, Object>> items; // minimal: itemId, qty, price
    public String timestamp;

    public OrderPlacedEvent() {}
}
