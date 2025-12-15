package com.example.partner.service;
import com.example.partner.entity.DeliveryPartner;
import com.example.partner.enums.PartnerStatus;
import com.example.partner.repository.DeliveryPartnerRepository;
import com.example.shared.events.DeliveryCompletedEvent;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;



@Service
public class DeliverySimulationService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final DeliveryPartnerRepository repository;
    private final StringRedisTemplate redisTemplate;
    private static final String AVAILABLE_SET = "available-partners";

    public DeliverySimulationService(
            KafkaTemplate<String, Object> kafkaTemplate,
            DeliveryPartnerRepository repository,
            StringRedisTemplate redisTemplate) {
        this.kafkaTemplate = kafkaTemplate;
        this.repository = repository;
        this.redisTemplate = redisTemplate;
    }

    @Async
    public void completeDelivery(Long orderId, Long partnerId) {
        try {
            Thread.sleep(10000); // simulate delivery time
        } catch (InterruptedException ignored) {}

        // Mark partner AVAILABLE again
        DeliveryPartner partner = repository.findById(partnerId).orElseThrow();
        partner.setStatus(PartnerStatus.AVAILABLE);
        repository.save(partner);

        // Add back to available set for future assignment
        redisTemplate.opsForSet().add(AVAILABLE_SET, String.valueOf(partnerId));

        DeliveryCompletedEvent event =
                new DeliveryCompletedEvent(orderId, partnerId);

        kafkaTemplate.send("delivery-completed-events", event);

        System.out.println(
            "✅ Delivery completed for order " + orderId +
            " by partner " + partnerId
        );
    }
}
