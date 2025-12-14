package com.example.order.config;

import com.example.shared.events.DeliveryAssignedEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConsumerConfig {

    /* ---------------------------------
       Common Kafka consumer properties
       --------------------------------- */
    private Map<String, Object> baseConsumerProps() {
        Map<String, Object> props = new HashMap<>();

        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "order-service");
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        return props;
    }

    /* ---------------------------------
       DeliveryAssignedEvent consumer
       --------------------------------- */
    @Bean
    public ConsumerFactory<String, DeliveryAssignedEvent>
    deliveryAssignedConsumerFactory() {

        JsonDeserializer<DeliveryAssignedEvent> deserializer =
            new JsonDeserializer<>(DeliveryAssignedEvent.class, false);
        deserializer.addTrustedPackages("*");
        deserializer.ignoreTypeHeaders();
        deserializer.setRemoveTypeHeaders(false);
        deserializer.setUseTypeMapperForKey(false);

        return new DefaultKafkaConsumerFactory<>(
            baseConsumerProps(),
            new StringDeserializer(),
            deserializer
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, DeliveryAssignedEvent>
    deliveryAssignedKafkaListenerContainerFactory() {

        ConcurrentKafkaListenerContainerFactory<String, DeliveryAssignedEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(deliveryAssignedConsumerFactory());
        // Add error handler to log deserialization and processing errors
        factory.setCommonErrorHandler(new org.springframework.kafka.listener.DefaultErrorHandler(
            (record, exception) -> {
                System.err.println("[KafkaErrorHandler] Error in delivery-events: " + exception.getMessage());
                exception.printStackTrace();
            }
        ));
        return factory;
    }
}
