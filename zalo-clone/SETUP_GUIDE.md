# Zalo Clone - Project Structure Guide

## 📁 Cấu trúc Project đã tạo

```
zalo-clone/
├── README.md
├── docker-compose.yml
│
├── backend/
│   ├── user-service/                 # ✅ Java Spring Boot
│   │   ├── pom.xml
│   │   ├── Dockerfile
│   │   └── src/main/
│   │       ├── java/com/zaloclone/user/
│   │       │   ├── UserServiceApplication.java
│   │       │   ├── entity/User.java
│   │       │   ├── repository/UserRepository.java
│   │       │   ├── service/UserService.java
│   │       │   ├── controller/UserController.java
│   │       │   └── dto/
│   │       │       ├── UserDTO.java
│   │       │       └── RegisterRequest.java
│   │       └── resources/
│   │           └── application.yml
│   │
│   └── message-service/              # ✅ NodeJS/Express
│       ├── package.json
│       ├── Dockerfile
│       ├── .env.example
│       └── src/
│           ├── server.js
│           ├── models/Message.js
│           ├── routes/messageRoutes.js
│           ├── controllers/messageController.js
│           ├── websocket/socketHandler.js
│           └── kafka/
│               ├── kafkaClient.js
│               └── kafkaProducer.js
│
├── frontend/
│   ├── web-app/                      # ✅ ReactJS
|   ├── shared/                       # ✅ Typescript
│   └── mobile-app/                   # ✅ React Native
│   
│       
│       
│
└── infrastructure/
    └── kubernetes/
        ├── user-service-deployment.yaml
        └── message-service-deployment.yaml
```

## 🚀 Hướng dẫn Chạy Project

### 1️⃣ Chạy với Docker Compose (Đơn giản nhất)

```bash
# Di chuyển vào thư mục project
cd .../zalo-clone

# Khởi động tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down
```

**Services sẽ chạy trên:**
- Web App: http://localhost:8000
- User Service: http://localhost:8080
- Message Service: http://localhost:8083
- MariaDB: localhost:3306
- MongoDB: localhost:27017
- Redis: localhost:6379
- Kafka: localhost:9092

### 2️⃣ Chạy Manual (Development)

#### A. Cài đặt Dependencies

**User Service (Java):**
```bash
cd backend/user-service
mvn clean install
```

**Message Service (NodeJS):**
```bash
cd backend/message-service
npm install
cp .env.example .env
# Chỉnh sửa .env với cấu hình của bạn
```

#### B. Khởi động Databases

**MariaDB:**
```sql
CREATE DATABASE zalo_users;
```

**MongoDB:**
```bash
mongosh
use zalo_messages
```

**Redis:**
```bash
redis-server
```

**Kafka:**
```bash
# Khởi động Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# Khởi động Kafka
bin/kafka-server-start.sh config/server.properties
```

#### C. Chạy Services

**User Service:**
```bash
cd backend/user-service
mvn spring-boot:run
```

**Message Service:**
```bash
cd backend/message-service
npm run dev
```

**Web App:**
```bash
cd frontend/web-app
# Sử dụng Live Server hoặc bất kỳ web server nào
python -m http.server 8000
# Hoặc
npx serve .
```

### 3️⃣ Chạy với Kubernetes

```bash
# Tạo namespace
kubectl create namespace zalo-clone

# Deploy services
kubectl apply -f infrastructure/kubernetes/

# Kiểm tra pods
kubectl get pods -n zalo-clone

# Xem logs
kubectl logs -f <pod-name> -n zalo-clone
```

## 📝 API Testing

### User Service APIs

**Đăng ký user:**
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "displayName": "Test User"
  }'
```

**Lấy thông tin user:**
```bash
curl http://localhost:8080/api/users/1
```

### Message Service APIs

**Gửi tin nhắn:**
```bash
curl -X POST http://localhost:8083/api/messages/send \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "conv_123",
    "senderId": 1,
    "recipientId": 2,
    "content": "Hello!",
    "type": "text"
  }'
```

**Lấy tin nhắn trong conversation:**
```bash
curl http://localhost:8083/api/messages/conversation/conv_123
```

## 🎯 Các Tính Năng Đã Implement

✅ **User Service:**
- Đăng ký/Đăng nhập user
- Quản lý profile
- JWT authentication (chuẩn bị)
- Integration với MariaDB + Redis

✅ **Message Service:**
- Gửi/nhận tin nhắn realtime
- WebSocket support
- Kafka event publishing
- MongoDB storage
- Typing indicators

✅ **Web App:**
- Giao diện chat đẹp với dark theme
- WebSocket real-time messaging
- Typing indicators
- Responsive design
- Modern UI/UX

## 📚 Các Service Còn Lại (Cần Implement)

Để hoàn thiện hệ thống như kiến trúc đã thiết kế, cần thêm:

- [ ] Friend Service (Java Spring Boot)
- [ ] Group Service (Java Spring Boot)
- [ ] Media Service (NodeJS)
- [ ] Notification Service (NodeJS)
- [ ] AI Chatbot Service (Python FastAPI)
- [ ] Analytics Service (Java Spring Boot)
- [ ] Search Service (Java + Elasticsearch)
- [ ] API Gateway (Kong/Nginx)
- [ ] Service Discovery (Eureka)

## 🔧 Configuration Notes

### Database Connections
- **MariaDB:** `jdbc:mariadb://localhost:3306/zalo_users`
- **MongoDB:** `mongodb://localhost:27017/zalo_messages`
- **Redis:** `localhost:6379`

### Environment Variables

Tạo file `.env` cho Message Service:
```env
PORT=8083
MONGODB_URI=mongodb://localhost:27017/zalo_messages
REDIS_HOST=localhost
REDIS_PORT=6379
KAFKA_BROKER=localhost:9092
```

## 🐛 Troubleshooting

**Lỗi kết nối Database:**
- Kiểm tra MariaDB/MongoDB đã chạy chưa
- Kiểm tra username/password trong config
- Kiểm tra firewall/port

**WebSocket không kết nối:**
- Kiểm tra CORS settings
- Kiểm tra Message Service đang chạy
- Mở console browser để xem errors

**Kafka errors:**
- Đảm bảo Zookeeper chạy trước Kafka
- Kiểm tra port 9092 không bị chiếm

## 📖 Tài Liệu Tham Khảo

- [Kiến trúc hệ thống chi tiết](../KIEN_TRUC_HE_THONG_OTT.md)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Kafka Documentation](https://kafka.apache.org/documentation/)
