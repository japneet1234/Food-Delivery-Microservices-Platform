# 🍔 Food Delivery Microservices Platform

A production-grade, event-driven food delivery platform built with **Spring Boot**, **Apache Kafka**, **PostgreSQL**, and **Redis**. This system demonstrates a modern microservices architecture with asynchronous communication, geospatial features, and distributed transactions.

---

## 🏗️ Architecture Overview

```
┌─────────────────┐      ┌──────────────────┐      ┌────────────────────────┐
│  Restaurant     │      │  Order           │      │  Payment               │
│  Service        │      │  Service         │      │  Service               │
│  (Port 8080)    │◄────►│  (Port 8090)     │      │  (Kafka Consumer)      │
└─────────────────┘      └──────────────────┘      └────────────────────────┘
                                 │                            │
                                 │  order-events              │  payment-events
                                 ▼                            ▼
                         ┌──────────────────────────────────────────┐
                         │         Apache Kafka Message Bus         │
                         └──────────────────────────────────────────┘
                                 │                            │
                                 │  delivery-events           │  delivery-completed-events
                                 ▼                            ▼
┌──────────────────────┐   ┌─────────────────┐      ┌────────────────────────┐
│  Delivery            │   │  Delivery       │      │  Delivery Partner      │
│  Assignment Service  │──►│  Partner        │      │  Service               │
│  (Port 8082)         │   │  Service        │      │  (Port 8084)           │
└──────────────────────┘   │  (Port 8084)    │      └────────────────────────┘
                           └─────────────────┘
```

---

## 📦 Services

### 1. **Restaurant Service** (Port 8080)
Manages restaurant information and menu items with Redis caching.

**Tech Stack:**
- Spring Boot 3.2.0 + Java 21
- PostgreSQL (JPA/Hibernate)
- Redis (Caching)
- Spring Actuator

**Key Features:**
- CRUD operations for restaurants
- Menu item management
- Redis caching for improved performance
- Location-based restaurant data

**API Endpoints:**
```
GET    /restaurants/health
POST   /restaurants
GET    /restaurants
GET    /restaurants/{id}
POST   /restaurants/{id}/menu
GET    /restaurants/{id}/menu
```

---

### 2. **Order Service** (Port 8090)
Core orchestration service that manages the complete order lifecycle.

**Tech Stack:**
- Spring Boot 3.2.0 + Java 21
- PostgreSQL (JPA/Hibernate)
- Apache Kafka (Producer & Consumer)
- REST Client for Restaurant Service

**Key Features:**
- Order placement with real-time validation
- Menu item validation via Restaurant Service
- Price verification and total calculation
- Multi-consumer event handling (Payment, Delivery)
- Order status tracking through entire lifecycle

**Order Status Flow:**
```
PLACED → CONFIRMED → OUT_FOR_DELIVERY → DELIVERED
           ↓
        CANCELLED (if payment fails)
```

**API Endpoints:**
```
POST   /orders
GET    /orders/health
```

**Kafka Topics:**
- **Produces:** `order-events` (OrderPlacedEvent)
- **Consumes:** `payment-events`, `delivery-events`, `delivery-completed-events`

---

### 3. **Payment Service** (Kafka Consumer)
Simulates payment processing with success/failure scenarios.

**Tech Stack:**
- Spring Boot 3.2.0 + Java 21
- Apache Kafka (Consumer & Producer)

**Key Features:**
- Listens to order placement events
- Simulates payment gateway integration
- Random success/failure (for demonstration)
- Publishes payment results

**Kafka Topics:**
- **Consumes:** `order-events` (OrderPlacedEvent)
- **Produces:** `payment-events` (PaymentSuccessEvent, PaymentFailedEvent)

---

### 4. **Delivery Assignment Service** (Port 8082)
Intelligent delivery partner assignment using geospatial algorithms.

**Tech Stack:**
- Spring Boot 3.2.0 + Java 21
- Redis Geospatial (GEORADIUS)
- Apache Kafka (Consumer & Producer)
- REST Client for Partner Service

**Key Features:**
- Geographic search for nearby delivery partners (5km radius)
- Real-time partner availability tracking
- Automatic assignment after successful payment
- Location-based intelligent matching

**Algorithm:**
1. Listen for PaymentSuccessEvent
2. Query Redis for available partners within 5km of restaurant
3. Select nearest available partner
4. Mark partner as BUSY via REST API
5. Publish DeliveryAssignedEvent

**Kafka Topics:**
- **Consumes:** `payment-events` (PaymentSuccessEvent)
- **Produces:** `delivery-events` (DeliveryAssignedEvent)

---

### 5. **Delivery Partner Service** (Port 8084)
Manages delivery partner lifecycle and simulates delivery completion.

**Tech Stack:**
- Spring Boot 3.2.0 + Java 21
- PostgreSQL (JPA/Hibernate)
- Redis Geospatial
- Apache Kafka (Consumer & Producer)

**Key Features:**
- Partner registration and management
- Real-time location updates
- Availability status management (AVAILABLE/BUSY)
- Redis Geo index for location-based queries
- Delivery simulation (auto-complete after 10s)

**Partner Status:**
- `AVAILABLE` - Ready for assignment
- `BUSY` - Currently on delivery

**API Endpoints:**
```
POST   /partners
PUT    /partners/{id}/location
PUT    /partners/{id}/available
PUT    /partners/{id}/busy
```

**Kafka Topics:**
- **Consumes:** `delivery-events` (DeliveryAssignedEvent)
- **Produces:** `delivery-completed-events` (DeliveryCompletedEvent)

---

### 6. **Shared Library**
Common events and enums shared across all services.

**Components:**
- **Events:** OrderPlacedEvent, PaymentSuccessEvent, PaymentFailedEvent, DeliveryAssignedEvent, DeliveryCompletedEvent
- **Enums:** OrderStatus, PartnerStatus

---

## 🔄 Event Flow

### Happy Path: Successful Order Delivery

```
1. User places order
   └─► POST /orders → Order Service

2. Order Service validates & saves order
   └─► Publishes: OrderPlacedEvent → order-events

3. Payment Service processes payment
   └─► Publishes: PaymentSuccessEvent → payment-events

4. Order Service updates order status to CONFIRMED
   └─► Consumes: PaymentSuccessEvent

5. Delivery Assignment Service finds nearby partner
   └─► Queries Redis Geo for available partners
   └─► Publishes: DeliveryAssignedEvent → delivery-events

6. Order Service updates status to OUT_FOR_DELIVERY
   └─► Consumes: DeliveryAssignedEvent

7. Partner Service marks partner as BUSY
   └─► Updates partner status
   └─► Simulates delivery (10s delay)
   └─► Publishes: DeliveryCompletedEvent → delivery-completed-events

8. Order Service marks order as DELIVERED
   └─► Consumes: DeliveryCompletedEvent
   └─► Final status: DELIVERED ✅
```

### Failure Path: Payment Failed

```
1. Order placed → PLACED
2. Payment fails → PaymentFailedEvent
3. Order Service → CANCELLED ❌
```

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Language** | Java 21 |
| **Framework** | Spring Boot 3.2.0 |
| **Database** | PostgreSQL 15 |
| **Cache/Geo** | Redis 6 |
| **Message Bus** | Apache Kafka 7.5.0 |
| **Build Tool** | Maven |
| **Containerization** | Docker Compose |

---

## 🚀 Getting Started

### Prerequisites
- **Java 21** (JDK)
- **Maven 3.8+**
- **Docker & Docker Compose**

### 1. Start Infrastructure

```bash
# Start PostgreSQL, Redis, Kafka, Zookeeper
docker-compose up -d

# Verify services are running
docker ps
```

### 2. Build All Services

```bash
# Build shared library first
cd shared-lib
mvn clean install

# Build all services
cd ../order-service && mvn clean package
cd ../payment-service && mvn clean package
cd ../restaurant-service && mvn clean package
cd ../delivery-assignment-service && mvn clean package
cd ../delivery-partner-service && mvn clean package
```

### 3. Run Services

**Terminal 1 - Restaurant Service:**
```bash
cd restaurant-service
mvn spring-boot:run
```

**Terminal 2 - Order Service:**
```bash
cd order-service
mvn spring-boot:run
```

**Terminal 3 - Payment Service:**
```bash
cd payment-service
mvn spring-boot:run
```

**Terminal 4 - Delivery Assignment Service:**
```bash
cd delivery-assignment-service
mvn spring-boot:run
```

**Terminal 5 - Delivery Partner Service:**
```bash
cd delivery-partner-service
mvn spring-boot:run
```

---

## 📝 Testing the System

### 1. Create a Restaurant

```bash
curl -X POST http://localhost:8080/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bangalore Bites",
    "locationLat": 12.9716,
    "locationLong": 77.5946,
    "rating": 4.5
  }'
```

### 2. Add Menu Items

```bash
curl -X POST http://localhost:8080/restaurants/1/menu \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Masala Dosa",
    "price": 120.0,
    "available": true
  }'

curl -X POST http://localhost:8080/restaurants/1/menu \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Filter Coffee",
    "price": 40.0,
    "available": true
  }'
```

### 3. Register Delivery Partner

```bash
curl -X POST http://localhost:8084/partners \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Kumar",
    "currentLat": 12.9700,
    "currentLon": 77.5900
  }'
```

### 4. Mark Partner as Available

```bash
curl -X PUT http://localhost:8084/partners/1/available
```

### 5. Place an Order

```bash
curl -X POST http://localhost:8090/orders \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": 1,
    "items": [
      {"menuItemId": 1, "quantity": 2},
      {"menuItemId": 2, "quantity": 1}
    ]
  }'
```

### 6. Monitor Logs

Watch the console logs across all services to see the event flow:
- ✅ Order CONFIRMED
- 🚴 Partner assigned
- 🚚 Order OUT_FOR_DELIVERY
- 📦 Order DELIVERED

---

## 🔍 Key Design Patterns

### 1. **Event-Driven Architecture**
- Asynchronous communication via Kafka
- Loose coupling between services
- Scalable event processing

### 2. **Saga Pattern**
- Distributed transaction management
- Order lifecycle orchestration
- Compensating transactions (cancellation)

### 3. **CQRS (Command Query Responsibility Segregation)**
- Separate read/write models
- Optimized query performance with Redis caching

### 4. **Geospatial Indexing**
- Redis GEO commands for location-based queries
- Efficient partner discovery within radius

### 5. **Service Registry Pattern**
- Shared library for common contracts
- Event schema consistency

---

## 🌟 Advanced Features

### Geospatial Partner Matching
Uses Redis GEORADIUS to find delivery partners within 5km of restaurant location:
```java
GeoResults<GeoLocation<String>> results = redisTemplate.opsForGeo()
    .search(GEO_KEY, new Circle(restaurantLocation, new Distance(5, KILOMETERS)));
```

### Multi-Handler Kafka Consumers
Order Service handles multiple event types on same topic:
```java
@KafkaHandler
public void onPaymentSuccess(PaymentSuccessEvent event) { ... }

@KafkaHandler  
public void onPaymentFailed(PaymentFailedEvent event) { ... }
```

### Delivery Simulation
Partner service auto-completes delivery after 10 seconds:
```java
new Thread(() -> {
    Thread.sleep(10000);
    completeDelivery(orderId, partnerId);
}).start();
```

---

## 📊 Database Schema

### Orders Table
```sql
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2),
    status VARCHAR(50),
    created_at TIMESTAMP,
    delivery_partner_id BIGINT
);
```

### Restaurants Table
```sql
CREATE TABLE restaurants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    location_lat DOUBLE PRECISION,
    location_long DOUBLE PRECISION,
    rating DOUBLE PRECISION
);
```

### Delivery Partners Table
```sql
CREATE TABLE delivery_partners (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    status VARCHAR(50),
    current_lat DOUBLE PRECISION,
    current_lon DOUBLE PRECISION
);
```

---

## 🔐 Configuration

Each service can be configured via environment variables:

```yaml
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=food_delivery
DB_USER=postgres
DB_PASSWORD=password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Kafka
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
```

---

## 🐛 Troubleshooting

### Kafka Connection Issues
```bash
# Check if Kafka is running
docker logs fd-kafka

# Verify topics exist
docker exec -it fd-kafka kafka-topics --list --bootstrap-server localhost:9092
```

### PostgreSQL Connection Issues
```bash
# Check PostgreSQL logs
docker logs fd-postgres

# Verify database exists
docker exec -it fd-postgres psql -U postgres -d food_delivery
```

### Redis Connection Issues
```bash
# Test Redis connection
docker exec -it fd-redis redis-cli PING
# Expected: PONG
```

---

## 📈 Future Enhancements

- [ ] **API Gateway** - Add Spring Cloud Gateway for unified entry point
- [ ] **Service Discovery** - Implement Eureka/Consul
- [ ] **Circuit Breaker** - Add Resilience4j for fault tolerance
- [ ] **Distributed Tracing** - Integrate Zipkin/Jaeger
- [ ] **Authentication** - Implement OAuth2/JWT
- [ ] **Rate Limiting** - Add request throttling
- [ ] **Monitoring** - Prometheus + Grafana dashboards
- [ ] **Real-time Tracking** - WebSocket for live order updates
- [ ] **ML-based ETA** - Predict delivery times
- [ ] **Multi-tenancy** - Support multiple restaurant chains

---

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- Inspired by real-world food delivery platforms (Swiggy, Uber Eats, DoorDash)
- Built with Spring Boot and Apache Kafka best practices
- Demonstrates production-ready microservices patterns

---

## 📞 Contact

For questions or feedback, please open an issue on GitHub.

---

**⭐ If you find this project helpful, please consider giving it a star!**
