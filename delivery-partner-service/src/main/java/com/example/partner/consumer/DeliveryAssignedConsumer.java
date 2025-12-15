package com.example.partner.consumer;
import com.example.partner.service.DeliverySimulationService;
import com.example.shared.events.DeliveryAssignedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;


@Component
public class DeliveryAssignedConsumer {

    private final DeliverySimulationService simulationService;

    public DeliveryAssignedConsumer(
            DeliverySimulationService simulationService) {
        this.simulationService = simulationService;
    }

    @KafkaListener(
        topics = "delivery-events",
        groupId = "partner-service",
        containerFactory = "deliveryAssignedKafkaListenerContainerFactory"
    )
    public void handleAssignment(DeliveryAssignedEvent event) {
        simulationService.completeDelivery(
                event.orderId,
                event.partnerId
        );
    }
}
