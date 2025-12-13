package com.example.shared.events;

public class PaymentSuccessEvent {
    public Long orderId;
    public Double amount;
    public String transactionId;
    public String timestamp;
    public PaymentSuccessEvent() {}
}
