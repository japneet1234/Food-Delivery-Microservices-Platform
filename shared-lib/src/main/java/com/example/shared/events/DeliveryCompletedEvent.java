package com.example.shared.events;

import java.time.Instant;

public class DeliveryCompletedEvent {

    public Long orderId;
    public Long partnerId;
    public Instant timestamp;

    public DeliveryCompletedEvent() {}

    public DeliveryCompletedEvent(Long orderId, Long partnerId) {
        this.orderId = orderId;
        this.partnerId = partnerId;
        this.timestamp = Instant.now();
    }
}
