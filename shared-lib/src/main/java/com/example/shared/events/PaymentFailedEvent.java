package com.example.shared.events;

public class PaymentFailedEvent {
    public Long orderId;
    public String reason;
    public String timestamp;
    public PaymentFailedEvent() {}
}
