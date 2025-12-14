package com.example.shared.events;

public class DeliveryAssignedEvent {
    public Long orderId;
    public Long partnerId;
    public String timestamp;

    public DeliveryAssignedEvent() {}

    public DeliveryAssignedEvent(Long orderId, Long partnerId) {
        this.orderId = orderId;
        this.partnerId = partnerId;
    }
}
