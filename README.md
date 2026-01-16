# THIẾT KẾ KIẾN TRÚC HỆ THỐNG OTT - ZALO CLONE

**Tài liệu Kiến trúc Hệ thống**  
*Dự án: Hệ thống Over-The-Top (OTT) Messaging Platform*  
*Phiên bản: 1.0*  
*Ngày: 16/01/2026*

---

# THÀNH VIÊN NHÓM
- Nguyễn Xuân Thi (Leader)
- Hà Xuân Phú (Backend)
- Nguyễn Thị Kiều Trang (Backend)
- Huỳnh Lệ Hoan (Frontend/App)
- Nguyễn Hoa (Frontend/Mobile)

---

## MỤC LỤC

1. [TỔNG QUAN HỆ THỐNG](#1-tổng-quan-hệ-thống)
2. [KIẾN TRÚC TỔNG THỂ (HIGH-LEVEL ARCHITECTURE)](#2-kiến-trúc-tổng-thể-high-level-architecture)
3. [KIẾN TRÚC MICROSERVICES CHI TIẾT](#3-kiến-trúc-microservices-chi-tiết)
4. [MÔ TẢ CHI TIẾT CÁC SERVICE](#4-mô-tả-chi-tiết-các-service)
5. [CƠ SỞ DỮ LIỆU VÀ LƯU TRỮ](#5-cơ-sở-dữ-liệu-và-lưu-trữ)
6. [REALTIME COMMUNICATION](#6-realtime-communication)
7. [CÔNG NGHỆ SỬ DỤNG](#7-công-nghệ-sử-dụng)
8. [CHIẾN LƯỢC TRIỂN KHAI VÀ MỞ RỘNG](#8-chiến-lược-triển-khai-và-mở-rộng)
9. [BẢO MẬT VÀ HIỆU NĂNG](#9-bảo-mật-và-hiệu-năng)
10. [KẾT LUẬN](#10-kết-luận)

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1. Giới thiệu

Hệ thống OTT Messaging Platform là một ứng dụng nhắn tin thời gian thực được thiết kế theo mô hình tương tự Zalo, phục vụ mục đích học tập và nghiên cứu. Hệ thống cho phép người dùng giao tiếp qua text, hình ảnh, video, tài liệu, đồng thời tích hợp chatbot AI hỗ trợ thông minh.

### 1.2. Mục tiêu Hệ thống

- **Khả năng mở rộng**: Hỗ trợ hàng triệu người dùng đồng thời
- **Hiệu năng cao**: Độ trễ thấp cho tin nhắn realtime (< 100ms)
- **Tính sẵn sàng**: Uptime 99.9%
- **Bảo mật**: Mã hóa end-to-end cho tin nhắn
- **Tính linh hoạt**: Dễ dàng thêm tính năng mới

### 1.3. Phạm vi Chức năng

#### Chức năng chính:
- Quản lý tài khoản người dùng (đăng ký, đăng nhập, profile)
- Quản lý danh sách bạn bè và yêu cầu kết bạn
- Quản lý nhóm chat (tạo, thêm/xóa thành viên, phân quyền)
- Chat 1-1 và chat nhóm realtime
- Gửi/nhận đa phương tiện: text, emoji, image, video, document
- Chatbot AI tích hợp (hỗ trợ tự động, FAQ)
- Thống kê và báo cáo hoạt động người dùng
- Tìm kiếm tin nhắn, lịch sử chat

---

## 2. KIẾN TRÚC TỔNG THỂ (HIGH-LEVEL ARCHITECTURE)

### 2.1. Sơ đồ Kiến trúc 3 tầng

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER (PRESENTATION)                     │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Web App   │  │ Android App │  │   iOS App   │  │  Mobile App │   │
│  │  (ReactJS)  │  │   (React    │  │   (React    │  │   (React    │   │
│  │             │  │   Native)   │  │   Native)   │  │   Native)   │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘   │
│         │                │                │                │           │
│         └────────────────┴────────────────┴────────────────┘           │
│                                  │                                      │
└──────────────────────────────────┼──────────────────────────────────────┘
                                   │
                          HTTPS / WebSocket
                                   │
┌──────────────────────────────────┼──────────────────────────────────────┐
│                          EDGE LAYER (CDN & GATEWAY)                      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────┐        ┌──────────────────────────────┐        │
│  │   CDN (CloudFlare/ │        │   API Gateway (Kong/Nginx)   │        │
│  │   CloudFront)      │        │   - Authentication           │        │
│  │   - Static Assets  │        │   - Rate Limiting            │        │
│  │   - Media Files    │        │   - Load Balancing           │        │
│  └────────────────────┘        └──────────────┬───────────────┘        │
│                                               │                         │
└───────────────────────────────────────────────┼─────────────────────────┘
                                                │
┌───────────────────────────────────────────────┼─────────────────────────┐
│                          BACKEND LAYER (MICROSERVICES)                   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Service Discovery (Consul/Eureka)            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  User    │  │  Friend  │  │  Group   │  │ Message  │  │  Media  │ │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │  │ Service │ │
│  │ (Java)   │  │ (Java)   │  │ (Java)   │  │ (NodeJS) │  │(NodeJS) │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       │             │             │             │             │       │
│  ┌────┴─────┐  ┌───┴──────┐  ┌───┴──────┐  ┌──┴──────┐  ┌───┴──────┐ │
│  │Notifica- │  │   AI     │  │Analytics │  │Presence │  │  Search  │ │
│  │   tion   │  │Chatbot   │  │ Service  │  │ Service │  │ Service  │ │
│  │ Service  │  │ Service  │  │  (Java)  │  │(NodeJS) │  │  (Java)  │ │
│  │ (NodeJS) │  │(Python/  │  └──────────┘  └─────────┘  └──────────┘ │
│  └──────────┘  │  Java)   │                                           │
│                └──────────┘                                           │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │           Message Broker (Apache Kafka / RabbitMQ)               │  │
│  │   - Event Streaming                                              │  │
│  │   - Inter-service Communication                                  │  │
│  │   - Message Queue                                                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │           WebSocket Server (Socket.IO / SockJS)                  │  │
│  │   - Real-time bidirectional communication                        │  │
│  │   - Presence management                                          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┼──────────────────────────────────────┐
│                          DATA LAYER (PERSISTENCE)                        │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │  MySQL Cluster  │  │ MongoDB Cluster │  │ Redis Cluster   │         │
│  │  (Master-Slave) │  │  (Replica Set)  │  │  - Cache        │         │
│  │                 │  │                 │  │  - Session      │         │
│  │  - User Data    │  │  - Messages     │  │  - Presence     │         │
│  │  - Friend List  │  │  - Chat History │  │                 │         │
│  │  - Group Info   │  │  - Media Meta   │  └─────────────────┘         │
│  └─────────────────┘  └─────────────────┘                              │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │ Elasticsearch   │  │  Object Storage │  │   PostgreSQL    │         │
│  │  - Full-text    │  │  (S3/MinIO)     │  │  - Analytics    │         │
│  │    Search       │  │  - Images       │  │  - Reports      │         │
│  │  - Logs         │  │  - Videos       │  │                 │         │
│  └─────────────────┘  │  - Documents    │  └─────────────────┘         │
│                       └─────────────────┘                              │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 2.2. Luồng Dữ liệu Chính

#### 2.2.1. Luồng Đăng nhập
```
Client → API Gateway → User Service → MySQL/Redis → Response
```

#### 2.2.2. Luồng Gửi tin nhắn 1-1
```
Client → WebSocket Server → Message Service → Kafka → 
         → MongoDB (lưu tin nhắn)
         → WebSocket Server → Client (người nhận)
         → Notification Service → Push notification
```

#### 2.2.3. Luồng Gửi Media
```
Client → API Gateway → Media Service → Object Storage (S3)
       → Message Service → Kafka → Recipients
```

---

## 3. KIẾN TRÚC MICROSERVICES CHI TIẾT

### 3.1. Sơ đồ Microservices

```
                    ┌─────────────────────────────────────┐
                    │      API Gateway (Kong/Nginx)       │
                    │  - Authentication & Authorization   │
                    │  - Rate Limiting                    │
                    │  - Request Routing                  │
                    └───────────────┬─────────────────────┘
                                    │
                    ┌───────────────┴──────────────────┐
                    │                                  │
        ┌───────────▼──────────┐          ┌───────────▼──────────┐
        │  Service Discovery   │          │   Config Server      │
        │  (Eureka/Consul)     │          │  (Spring Cloud)      │
        └──────────────────────┘          └──────────────────────┘
                    │
    ┌───────────────┼───────────────┬───────────────┬───────────────┐
    │               │               │               │               │
┌───▼────┐    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
│ User   │    │ Friend  │    │  Group  │    │Message  │    │ Media   │
│Service │◄──►│ Service │◄──►│ Service │◄──►│Service  │◄──►│Service  │
│        │    │         │    │         │    │         │    │         │
│Java/   │    │Java/    │    │Java/    │    │NodeJS/  │    │NodeJS/  │
│Spring  │    │Spring   │    │Spring   │    │Express  │    │Express  │
└───┬────┘    └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘
    │              │              │              │              │
    ├──────────────┴──────────────┴──────────────┴──────────────┤
    │                    Message Broker (Kafka)                 │
    └──────────────┬──────────────┬──────────────┬──────────────┘
                   │              │              │
         ┌─────────▼────┐  ┌─────▼──────┐  ┌───▼──────────┐
         │Notification  │  │  AI Bot    │  │  Analytics   │
         │   Service    │  │  Service   │  │   Service    │
         │   (NodeJS)   │  │ (Python/   │  │   (Java)     │
         └──────────────┘  │  FastAPI)  │  └──────────────┘
                           └────────────┘
    
    ┌──────────────────────────────────────────────────────────┐
    │          Infrastructure Services                         │
    ├──────────────────────────────────────────────────────────┤
    │  • Monitoring (Prometheus/Grafana)                       │
    │  • Logging (ELK Stack)                                   │
    │  • Tracing (Jaeger/Zipkin)                               │
    │  • Circuit Breaker (Hystrix/Resilience4j)                │
    └──────────────────────────────────────────────────────────┘
```

### 3.2. Service Mesh Architecture

Để tăng cường khả năng quản lý và bảo mật giữa các microservices, hệ thống có thể tích hợp **Service Mesh** (Istio hoặc Linkerd):

- **Traffic Management**: Load balancing, routing, retry logic
- **Security**: mTLS giữa các services
- **Observability**: Metrics, logs, tracing tự động
- **Resilience**: Circuit breaking, fault injection

---

## 4. MÔ TẢ CHI TIẾT CÁC SERVICE

### 4.1. User Service (Java Spring Boot)

**Chức năng:**
- Quản lý tài khoản người dùng (đăng ký, đăng nhập, đăng xuất)
- Quản lý profile (avatar, tên, số điện thoại, email)
- Xác thực và phân quyền (JWT tokens)
- Quản lý session người dùng

**Database:**
- MySQL: User table (id, username, password_hash, email, phone, created_at)
- Redis: Session cache, JWT tokens

**APIs:**
- POST /api/users/register
- POST /api/users/login
- GET /api/users/{id}
- PUT /api/users/{id}
- DELETE /api/users/{id}
- POST /api/users/logout

**Event Publishing:**
- UserRegistered
- UserProfileUpdated
- UserDeleted

---

### 4.2. Friend Service (Java Spring Boot)

**Chức năng:**
- Quản lý danh sách bạn bè
- Gửi/chấp nhận/từ chối lời mời kết bạn
- Hủy kết bạn
- Tìm kiếm người dùng để kết bạn
- Đề xuất bạn bè (friends suggestion algorithm)

**Database:**
- MySQL: 
  - Friendship table (user_id_1, user_id_2, status, created_at)
  - FriendRequest table (from_user_id, to_user_id, status, timestamp)

**APIs:**
- POST /api/friends/request
- PUT /api/friends/request/{id}/accept
- PUT /api/friends/request/{id}/reject
- DELETE /api/friends/{friendId}
- GET /api/friends/list/{userId}
- GET /api/friends/suggestions/{userId}

**Event Publishing:**
- FriendRequestSent
- FriendRequestAccepted
- FriendshipDeleted

---

### 4.3. Group Service (Java Spring Boot)

**Chức năng:**
- Tạo/xóa nhóm chat
- Thêm/xóa thành viên nhóm
- Cập nhật thông tin nhóm (tên, avatar, mô tả)
- Phân quyền nhóm (admin, member)
- Rời nhóm

**Database:**
- MySQL:
  - Group table (id, name, avatar_url, description, created_by, created_at)
  - GroupMember table (group_id, user_id, role, joined_at)

**APIs:**
- POST /api/groups
- GET /api/groups/{id}
- PUT /api/groups/{id}
- DELETE /api/groups/{id}
- POST /api/groups/{id}/members
- DELETE /api/groups/{id}/members/{userId}
- PUT /api/groups/{id}/members/{userId}/role

**Event Publishing:**
- GroupCreated
- GroupUpdated
- MemberAdded
- MemberRemoved
- MemberRoleChanged

---

### 4.4. Message Service (NodeJS/Express)

**Chức năng:**
- Xử lý tin nhắn 1-1
- Xử lý tin nhắn nhóm
- Lưu trữ lịch sử chat
- Đánh dấu tin nhắn đã đọc/chưa đọc
- Xóa tin nhắn
- Chuyển tiếp tin nhắn
- Phản hồi tin nhắn (reply/quote)

**Database:**
- MongoDB:
  - Messages collection: {
      _id, 
      conversation_id, 
      sender_id, 
      content, 
      type (text/image/video/file/emoji),
      media_url,
      timestamp,
      status (sent/delivered/read),
      reply_to
    }
  - Conversations collection: {
      _id,
      type (direct/group),
      participants [],
      last_message,
      updated_at
    }

**Redis:**
- Unread message counter
- Typing indicators
- Online presence

**Message Broker:**
- Publish to Kafka topics: message.sent, message.delivered, message.read

**APIs:**
- POST /api/messages/send
- GET /api/messages/conversation/{conversationId}
- PUT /api/messages/{id}/read
- DELETE /api/messages/{id}
- GET /api/messages/search

---

### 4.5. Media Service (NodeJS/Express)

**Chức năng:**
- Upload hình ảnh, video, tài liệu
- Resize/compress hình ảnh tự động
- Tạo thumbnail cho video
- Quét virus cho file upload
- Quản lý quota storage per user

**Storage:**
- Object Storage (AWS S3 / MinIO): Lưu trữ file thực tế
- MongoDB: Metadata của media (filename, size, type, url, uploaded_by)

**APIs:**
- POST /api/media/upload
- GET /api/media/{id}
- DELETE /api/media/{id}
- GET /api/media/user/{userId}

**Processing Pipeline:**
1. Client upload → API Gateway
2. Virus scan (ClamAV)
3. Compress/resize (Sharp library cho image, FFmpeg cho video)
4. Upload to S3
5. Save metadata to MongoDB
6. Return URL to client

---

### 4.6. Notification Service (NodeJS/Express)

**Chức năng:**
- Gửi push notification (Firebase Cloud Messaging)
- Gửi email notification
- Gửi SMS (Twilio API)
- In-app notifications
- Quản lý notification preferences

**Database:**
- MongoDB: Notifications collection
- Redis: Notification queue

**Event Consumption:**
- Subscribe to Kafka topics: message.sent, friend.request, group.invited

**APIs:**
- GET /api/notifications/{userId}
- PUT /api/notifications/{id}/read
- DELETE /api/notifications/{id}
- PUT /api/notifications/settings

---

### 4.7. AI Chatbot Service (Python/FastAPI hoặc Java Spring Boot)

**Chức năng:**
- Chatbot tự động trả lời
- FAQ automation
- Natural Language Processing (NLP)
- Intent recognition
- Tích hợp AI models (OpenAI GPT / Custom ML models)

**Technology Stack:**
- Python: FastAPI, LangChain, Transformers, spaCy
- Hoặc Java: Spring Boot + DL4J
- Vector Database: Pinecone/Weaviate cho semantic search

**Database:**
- MongoDB: Chat history với bot
- PostgreSQL: FAQ database, Intents

**APIs:**
- POST /api/chatbot/message
- GET /api/chatbot/suggestions
- POST /api/chatbot/feedback

**AI Pipeline:**
1. Nhận tin nhắn từ user
2. Preprocessing (tokenization, cleaning)
3. Intent classification
4. Entity extraction
5. Generate response (template-based hoặc AI-generated)
6. Send response

---

### 4.8. Analytics Service (Java Spring Boot)

**Chức năng:**
- Thống kê số lượng người dùng (daily/monthly active users)
- Thống kê số tin nhắn gửi/nhận
- Thống kê top users, top groups
- Báo cáo hoạt động hệ thống
- Dashboard admin

**Database:**
- PostgreSQL: Analytics tables (time-series data)
- Elasticsearch: Log aggregation and analysis

**Event Consumption:**
- Subscribe to tất cả events từ Kafka
- Aggregate và tính toán metrics

**APIs:**
- GET /api/analytics/users/stats
- GET /api/analytics/messages/stats
- GET /api/analytics/groups/stats
- GET /api/analytics/system/health

**Reporting:**
- Daily/weekly/monthly reports
- Export to CSV/Excel
- Visualization với Chart libraries

---

### 4.9. Presence Service (NodeJS)

**Chức năng:**
- Quản lý trạng thái online/offline
- Typing indicators
- Last seen timestamp
- Active now badge

**Database:**
- Redis: 
  - User presence: user:{id}:online
  - Typing status: conversation:{id}:typing

**WebSocket Integration:**
- Lắng nghe WebSocket connections
- Broadcast presence updates

---

### 4.10. Search Service (Java Spring Boot)

**Chức năng:**
- Tìm kiếm tin nhắn (full-text search)
- Tìm kiếm người dùng
- Tìm kiếm nhóm
- Search autocomplete

**Database:**
- Elasticsearch:
  - Messages index
  - Users index
  - Groups index

**APIs:**
- GET /api/search/messages?q={query}
- GET /api/search/users?q={query}
- GET /api/search/groups?q={query}

---

## 5. CƠ SỞ DỮ LIỆU VÀ LƯU TRỮ

### 5.1. MySQL (Relational Database)

**Mục đích:** Lưu trữ dữ liệu có cấu trúc, quan hệ rõ ràng

**Tables chính:**
- **users**: id, username, email, phone, password_hash, avatar_url, created_at
- **friendships**: id, user_id_1, user_id_2, status, created_at
- **friend_requests**: id, from_user_id, to_user_id, status, timestamp
- **groups**: id, name, description, avatar_url, created_by, created_at
- **group_members**: id, group_id, user_id, role, joined_at

**Replication:**
- Master-Slave replication
- Read replicas cho query performance

---

### 5.2. MongoDB (NoSQL Document Database)

**Mục đích:** Lưu trữ dữ liệu phi cấu trúc, linh hoạt, scale tốt

**Collections chính:**
- **messages**: Tin nhắn chat (lưu trữ lượng lớn, query nhanh)
- **conversations**: Metadata cuộc hội thoại
- **media_metadata**: Thông tin file media
- **notifications**: Thông báo
- **chatbot_sessions**: Lịch sử chat với bot

**Sharding Strategy:**
- Shard key: conversation_id hoặc user_id
- Replica set: 3 nodes (1 primary, 2 secondary)

---

### 5.3. Redis (In-Memory Cache)

**Mục đích:** Cache, session, real-time data

**Use cases:**
- Session storage (JWT tokens)
- User online presence (TTL-based)
- Unread message counters
- Rate limiting
- Typing indicators
- Cache API responses

**High Availability:**
- Redis Sentinel hoặc Redis Cluster
- Master-slave replication

---

### 5.4. PostgreSQL (Analytics Database)

**Mục đích:** Lưu trữ dữ liệu phân tích, báo cáo

**Tables:**
- **daily_user_stats**: date, total_users, active_users, new_users
- **message_stats**: date, total_messages, image_messages, video_messages
- **group_stats**: date, total_groups, active_groups

**Optimization:**
- Partitioning theo time (monthly partitions)
- Indexes on timestamp columns

---

### 5.5. AWS DynamoDB Tables

**Mục đích:** NoSQL database với low latency, auto-scaling

**Tables chính:**

#### 5.5.1. Users Table
```
Table: zalo-users
Partition Key: userId (String)
Sort Key: None

Attributes:
- userId (String) - UUID
- username (String)
- email (String)
- phone (String)
- password_hash (String)
- avatar_url (String)
- status (String) - online/offline/away
- last_seen (Number) - timestamp
- created_at (Number) - timestamp
- updated_at (Number) - timestamp

GSI (Global Secondary Index):
- email-index: email (PK)
- phone-index: phone (PK)
- username-index: username (PK)
```

#### 5.5.2. UserSessions Table
```
Table: zalo-user-sessions
Partition Key: userId (String)
Sort Key: sessionId (String)

Attributes:
- userId (String)
- sessionId (String)
- token (String)
- device_info (Map)
- ip_address (String)
- created_at (Number)
- expires_at (Number)
- is_active (Boolean)

TTL: expires_at (auto-delete expired sessions)
```

#### 5.5.3. UserPresence Table
```
Table: zalo-user-presence
Partition Key: userId (String)

Attributes:
- userId (String)
- status (String) - online/offline/away
- last_activity (Number) - timestamp
- device_type (String)
- socket_id (String)

TTL: last_activity + 5 minutes (auto-cleanup)
```

**DynamoDB Features:**
- **Auto-scaling**: Tự động scale read/write capacity
- **Point-in-time Recovery**: Backup continuous
- **DynamoDB Streams**: Event-driven architecture
- **Global Tables**: Multi-region replication
- **DAX (DynamoDB Accelerator)**: In-memory caching

---

### 5.6. Object Storage (S3/MinIO)

**Mục đích:** Lưu trữ file media (images, videos, documents)

**Bucket Structure:**
- `/images/` - Hình ảnh
- `/videos/` - Video files
- `/documents/` - Tài liệu
- `/avatars/` - Avatar người dùng/nhóm

**Features:**
- CDN integration (CloudFront/CloudFlare)
- Lifecycle policies (auto-delete old files)
- Versioning
- Access control (pre-signed URLs)

---

### 5.7. Elasticsearch

**Mục đích:** Full-text search và log aggregation

**Indices:**
- **messages_index**: Tìm kiếm tin nhắn
- **users_index**: Tìm kiếm người dùng
- **logs_index**: Application logs

---

## 6. REALTIME COMMUNICATION

### 6.1. WebSocket Architecture

**Technology:** Socket.IO (NodeJS) hoặc SockJS

**Flow:**
```
Client ◄──WebSocket──► WebSocket Server ◄──Kafka──► Message Service
                            │
                       Redis (pub/sub)
                            │
                     Other WS Servers
```

**WebSocket Server Responsibilities:**
- Maintain persistent connections với clients
- Authentication khi kết nối (JWT)
- Routing tin nhắn realtime
- Broadcasting events (typing, presence)
- Load balancing across multiple WS servers

**Horizontal Scaling:**
- Multiple WebSocket server instances
- Redis Pub/Sub để sync giữa các instances
- Sticky session (session affinity) từ load balancer

---

### 6.2. Message Broker (Apache Kafka)

**Mục đích:** Event streaming, inter-service communication, message queue

**Topics:**
- **user.events**: UserRegistered, UserUpdated, UserDeleted
- **message.events**: MessageSent, MessageDelivered, MessageRead
- **friend.events**: FriendRequestSent, FriendRequestAccepted
- **group.events**: GroupCreated, MemberAdded, MemberRemoved
- **notification.events**: NotificationTriggered

**Architecture:**
- Kafka Cluster: 3-5 brokers
- Zookeeper ensemble: 3 nodes
- Replication factor: 3
- Partitioning strategy: By user_id hoặc conversation_id

**Event-Driven Pattern:**
1. Service A tạo event → Publish to Kafka
2. Service B, C, D subscribe → Consume event
3. Asynchronous processing
4. Eventual consistency

---

### 6.3. Notification Flow

```
Message Service → Kafka (message.sent) → Notification Service
                                              │
                    ┌─────────────────────────┼─────────────────────┐
                    │                         │                     │
            Firebase Cloud              Email Service          SMS Service
             Messaging (FCM)            (SendGrid)             (Twilio)
                    │                         │                     │
              Mobile Devices              User Email           User Phone
```

---

## 7. CÔNG NGHỆ SỬ DỤNG

### 7.1. Backend Technologies

| Service | Technology | Lý do chọn |
|---------|-----------|-----------|
| User Service | Java Spring Boot | Robust, enterprise-grade, security features |
| Friend Service | Java Spring Boot | Consistency với User Service |
| Group Service | Java Spring Boot | Transaction support cho group operations |
| Message Service | NodeJS/Express | High concurrency, non-blocking I/O |
| Media Service | NodeJS/Express | Stream processing tốt cho media |
| Notification Service | NodeJS/Express | Event-driven, async processing |
| AI Chatbot | Python/FastAPI | Rich AI/ML libraries ecosystem |
| Analytics Service | Java Spring Boot | Data processing capabilities, scheduler |
| Presence Service | NodeJS | Real-time, lightweight |

### 7.2. Database Technologies

- **MySQL 8.0**: Relational data, ACID transactions
- **MongoDB 6.0**: Document store, flexible schema
- **Redis 7.0**: Caching, session, pub/sub
- **PostgreSQL 15**: Analytics, complex queries
- **Elasticsearch 8.x**: Full-text search, logging
- **AWS DynamoDB**: NoSQL database, serverless, high scalability

### 7.2.1. AWS Services Integration

- **Amazon DynamoDB**: 
  - User profile storage với low latency
  - Session management và caching
  - Real-time presence data
  - Auto-scaling capacity
  
- **Amazon S3**: 
  - Media file storage (images, videos, documents)
  - Static asset hosting
  - Backup và archival
  
- **Amazon ElastiCache** (Redis compatible):
  - Distributed caching
  - Session management
  - Real-time analytics
  
- **Amazon RDS**:
  - Managed MySQL/PostgreSQL
  - Automated backups
  - Multi-AZ deployment
  
- **Amazon MSK** (Managed Streaming for Kafka):
  - Event streaming
  - Inter-service communication
  
- **Amazon CloudFront**:
  - CDN cho static assets
  - Low latency content delivery

### 7.3. Message Queue & Streaming

- **Apache Kafka**: Event streaming, high throughput
- **Alternative**: RabbitMQ (nếu cần message routing phức tạp)

### 7.4. Frontend Technologies

**Web:**
- **ReactJS 18+**: 
  - Single Page Application (SPA)
  - Component-based architecture
  - Virtual DOM for performance
  - Rich ecosystem (Redux, React Router, etc.)
  - TypeScript support
  - Modern hooks and functional components

**Mobile:**
- **React Native**: 
  - Cross-platform (iOS + Android) với single codebase
  - Native performance với JavaScript
  - Hot reload for faster development
  - Shared code với web app (React)
  - Large community và third-party libraries
  - Expo support cho rapid development

**Benefits of React Ecosystem:**
- Code sharing giữa web và mobile
- Single language (JavaScript/TypeScript)
- Unified development experience
- Large developer community

---

### 7.5. Infrastructure & DevOps

**Containerization:**
- **Docker**: Container runtime
- **Docker Compose**: Local development

**Orchestration:**
- **Kubernetes (K8s)**: Container orchestration, auto-scaling
- **Helm**: Package manager cho K8s

**CI/CD:**
- **Jenkins** / **GitLab CI** / **GitHub Actions**
- Automated testing, build, deployment

**Monitoring & Logging:**
- **Prometheus**: Metrics collection
- **Grafana**: Visualization, dashboards
- **ELK Stack** (Elasticsearch, Logstash, Kibana): Centralized logging
- **Jaeger / Zipkin**: Distributed tracing

**Service Mesh:**
- **Istio**: Traffic management, security, observability

**Cloud Provider:**
- **AWS**: EC2, EKS, RDS, S3, ElastiCache
- **GCP**: GKE, Cloud SQL, Cloud Storage
- **Azure**: AKS, Azure Database, Blob Storage

---

## 8. CHIẾN LƯỢC TRIỂN KHAI VÀ MỞ RỘNG

### 8.1. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Cloud Provider (AWS/GCP/Azure)             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │         Kubernetes Cluster (EKS/GKE/AKS)                  │ │
│  │                                                           │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │ │
│  │  │   Node 1   │  │   Node 2   │  │   Node 3   │   ...   │ │
│  │  │            │  │            │  │            │         │ │
│  │  │ ┌────────┐ │  │ ┌────────┐ │  │ ┌────────┐ │         │ │
│  │  │ │ Pods   │ │  │ │ Pods   │ │  │ │ Pods   │ │         │ │
│  │  │ └────────┘ │  │ └────────┘ │  │ └────────┘ │         │ │
│  │  └────────────┘  └────────────┘  └────────────┘         │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  Ingress Controller (Nginx/Traefik)                 │ │ │
│  │  │  - SSL/TLS termination                              │ │ │
│  │  │  - Routing rules                                    │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   RDS        │  │ DocumentDB   │  │ ElastiCache  │         │
│  │  (MySQL)     │  │  (MongoDB)   │  │   (Redis)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │      S3      │  │     MSK      │  │ CloudWatch   │         │
│  │ (Object      │  │  (Kafka)     │  │ (Monitoring) │         │
│  │  Storage)    │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2. Kubernetes Deployment Strategy

**Namespaces:**
- `production`: Production services
- `staging`: Staging environment
- `monitoring`: Prometheus, Grafana
- `logging`: ELK Stack

**Resource Management:**
```yaml
# Example: Message Service Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: message-service
spec:
  replicas: 3  # Horizontal scaling
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      containers:
      - name: message-service
        image: message-service:v1.0
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
```

**Auto-scaling:**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: message-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: message-service
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

### 8.3. Scaling Strategies

#### 8.3.1. Horizontal Scaling (Scale Out)

**Stateless Services:**
- Dễ dàng scale bằng cách thêm replicas
- Load balancer phân tán traffic
- Services: User, Friend, Group, Message, Media

**Stateful Services:**
- WebSocket servers: Sticky sessions + Redis pub/sub
- Databases: Read replicas, sharding

#### 8.3.2. Vertical Scaling (Scale Up)

- Tăng CPU, RAM cho pods khi cần thiết
- Phù hợp cho database servers, cache servers

#### 8.3.3. Database Scaling

**MySQL:**
- **Vertical**: Tăng instance size
- **Horizontal**: Master-slave replication, read replicas
- **Sharding**: Partition theo user_id range

**MongoDB:**
- **Replica Set**: 3-node cho HA
- **Sharding**: Shard key = conversation_id hoặc user_id
- **Horizontal scaling**: Thêm shards khi data tăng

**Redis:**
- **Redis Cluster**: Automatic sharding
- **Sentinel**: High availability

#### 8.3.4. Kafka Scaling

- Thêm brokers vào cluster
- Tăng số partitions cho topics
- Consumer groups để parallel processing

---

### 8.4. High Availability (HA)

**Strategies:**
1. **Multi-AZ Deployment**: Services deploy trên nhiều Availability Zones
2. **Database Replication**: Master-slave, auto-failover
3. **Load Balancing**: Health checks, automatic routing
4. **Circuit Breaker**: Resilience4j/Hystrix cho fault tolerance
5. **Retry Mechanism**: Exponential backoff
6. **Graceful Degradation**: Fallback mechanisms

---

### 8.5. Disaster Recovery

**Backup Strategy:**
- **Databases**: Daily automated backups, point-in-time recovery
- **Object Storage**: Cross-region replication
- **Configuration**: GitOps (Infrastructure as Code)

**RTO/RPO:**
- Recovery Time Objective (RTO): < 1 hour
- Recovery Point Objective (RPO): < 15 minutes

---

## 9. BẢO MẬT VÀ HIỆU NĂNG

### 9.1. Security Architecture

**Authentication & Authorization:**
- **JWT (JSON Web Tokens)**: Stateless authentication
- **OAuth 2.0**: Third-party login (Google, Facebook)
- **RBAC (Role-Based Access Control)**: User roles (admin, user)

**Encryption:**
- **TLS/SSL**: Mã hóa data in transit (HTTPS, WSS)
- **End-to-End Encryption**: Mã hóa tin nhắn (Signal Protocol)
- **At-rest Encryption**: Database encryption, S3 server-side encryption

**Security Best Practices:**
- API rate limiting (Kong/Nginx)
- Input validation & sanitization
- SQL injection prevention (Prepared statements)
- XSS protection
- CSRF tokens
- Security headers (HSTS, CSP, X-Frame-Options)
- Secrets management (HashiCorp Vault, AWS Secrets Manager)

**Network Security:**
- VPC (Virtual Private Cloud)
- Security groups, firewall rules
- Private subnets cho databases
- Public subnets cho API Gateway, Load Balancer

---

### 9.2. Performance Optimization

**Caching Strategies:**
- **Redis Cache**: 
  - User profiles
  - Friend lists
  - Group metadata
  - API responses (TTL: 5-60 minutes)
  
**CDN:**
- Static assets (CSS, JS, images)
- Media files (images, videos)
- Edge locations giảm latency

**Database Optimization:**
- **Indexing**: Indexes trên các trường thường query
- **Query Optimization**: Explain plans, avoid N+1 queries
- **Connection Pooling**: HikariCP, Mongoose pooling
- **Read Replicas**: Offload read traffic từ master

**API Optimization:**
- **Pagination**: Limit response size
- **Compression**: GZIP compression
- **GraphQL** (optional): Fetch chỉ data cần thiết

**Asynchronous Processing:**
- Background jobs (message processing, notifications)
- Message queue (Kafka) cho decoupling

---

### 9.3. Monitoring & Observability

**Metrics (Prometheus):**
- Request rate, error rate, duration (RED method)
- CPU, memory, disk usage
- Database connections, query latency
- Message queue lag

**Dashboards (Grafana):**
- System overview
- Service-specific dashboards
- Database performance
- Business metrics (DAU, MAU, messages/day)

**Logging (ELK Stack):**
- Centralized logging
- Log aggregation từ tất cả services
- Search, filter, analyze logs

**Tracing (Jaeger):**
- Distributed tracing
- Track request flow across microservices
- Performance bottleneck identification

**Alerting:**
- PagerDuty / Opsgenie integration
- Alert rules: High error rate, service down, database lag

---

## 10. KẾT LUẬN

### 10.1. Tổng kết Kiến trúc

Hệ thống OTT Messaging Platform được thiết kế theo kiến trúc **Microservices** hiện đại với các đặc điểm chính:

✅ **Tách biệt rõ ràng các tầng**: Client, Backend, Data  
✅ **Microservices độc lập**: 10 services chính, mỗi service có trách nhiệm riêng  
✅ **Realtime Communication**: WebSocket + Kafka cho messaging realtime  
✅ **Scalability**: Horizontal scaling, database sharding, auto-scaling  
✅ **High Availability**: Multi-AZ deployment, replication, failover  
✅ **Security**: JWT, TLS, E2E encryption, rate limiting  
✅ **Observability**: Monitoring, logging, tracing đầy đủ  

### 10.2. Ưu điểm Kiến trúc

1. **Khả năng mở rộng cao**: Dễ dàng scale từng service độc lập
2. **Fault Isolation**: Lỗi ở 1 service không ảnh hưởng toàn hệ thống
3. **Technology Diversity**: Mỗi service dùng tech stack phù hợp nhất
4. **Continuous Deployment**: Deploy từng service độc lập
5. **Team Autonomy**: Các team có thể phát triển song song

### 10.3. Thách thức và Giải pháp

| Thách thức | Giải pháp |
|-----------|-----------|
| Distributed Transaction | Saga pattern, eventual consistency |
| Service Discovery | Eureka/Consul |
| Inter-service Communication | Kafka event-driven, REST API |
| Data Consistency | Event sourcing, CQRS |
| Network Latency | Caching, CDN, load balancing |
| Debugging Complexity | Distributed tracing (Jaeger) |
| Configuration Management | Config Server, environment variables |

### 10.4. Lộ trình Phát triển Đề xuất

**Phase 1 (MVP - 3 tháng):**
- User Service, Friend Service
- Message Service (text only)
- Basic Web/Mobile client
- MySQL + Redis + MongoDB foundation

**Phase 2 (4-6 tháng):**
- Group Service
- Media Service (image, video)
- WebSocket realtime
- Notification Service

**Phase 3 (7-9 tháng):**
- AI Chatbot Service
- Analytics Service
- Search Service (Elasticsearch)
- Advanced features (E2E encryption)

**Phase 4 (10-12 tháng):**
- Kubernetes deployment
- Monitoring & alerting
- Performance optimization
- Load testing và scaling

### 10.5. Metrics Đánh giá Thành công

**Technical Metrics:**
- Response time < 100ms (p95)
- Availability > 99.9%
- Message delivery rate > 99.99%
- Support 100K concurrent users

**Business Metrics:**
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Message volume per day
- User retention rate

---

## PHỤ LỤC

### A. Technology Stack Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    FULL TECHNOLOGY STACK                    │
├─────────────────────────────────────────────────────────────┤
│ FRONTEND                                                    │
│   • Web: ReactJS 18+ (SPA, TypeScript)                      │
│   • Mobile: React Native (iOS + Android)                    │
├─────────────────────────────────────────────────────────────┤
│ BACKEND                                                     │
│   • Java Spring Boot 3.x (User, Friend, Group, Analytics)  │
│   • NodeJS/Express (Message, Media, Notification, Presence) │
│   • Python/FastAPI (AI Chatbot)                             │
├─────────────────────────────────────────────────────────────┤
│ DATABASES                                                   │
│   • MySQL 8.0 (User, Friend, Group data)                    │
│   • MongoDB 6.0 (Messages, Notifications)                   │
│   • Redis 7.0 (Cache, Session, Presence)                    │
│   • PostgreSQL 15 (Analytics)                               │
│   • Elasticsearch 8.x (Search, Logs)                        │
├─────────────────────────────────────────────────────────────┤
│ MESSAGE QUEUE                                               │
│   • Apache Kafka 3.x                                        │
│   • Alternative: RabbitMQ                                   │
├─────────────────────────────────────────────────────────────┤
│ REALTIME                                                    │
│   • Socket.IO / SockJS (WebSocket)                          │
│   • Redis Pub/Sub                                           │
├─────────────────────────────────────────────────────────────┤
│ STORAGE                                                     │
│   • AWS S3 / MinIO (Object Storage)                         │
│   • CloudFront / CloudFlare (CDN)                           │
├─────────────────────────────────────────────────────────────┤
│ INFRASTRUCTURE                                              │
│   • Docker (Containerization)                               │
│   • Kubernetes (Orchestration)                              │
│   • Helm (Package Manager)                                  │
│   • Istio (Service Mesh)                                    │
├─────────────────────────────────────────────────────────────┤
│ CI/CD                                                       │
│   • Jenkins / GitLab CI / GitHub Actions                    │
│   • ArgoCD (GitOps)                                         │
├─────────────────────────────────────────────────────────────┤
│ MONITORING                                                  │
│   • Prometheus (Metrics)                                    │
│   • Grafana (Visualization)                                 │
│   • ELK Stack (Logging)                                     │
│   • Jaeger (Tracing)                                        │
├─────────────────────────────────────────────────────────────┤
│ CLOUD PLATFORM                                              │
│   • AWS (EKS, RDS, S3, ElastiCache, MSK)                    │
│   • GCP (GKE, Cloud SQL, Cloud Storage)                     │
│   • Azure (AKS, Azure Database, Blob Storage)               │
└─────────────────────────────────────────────────────────────┘
```

### B. API Endpoint Summary

**User Service (Port 8080):**
- POST /api/users/register
- POST /api/users/login
- GET /api/users/{id}
- PUT /api/users/{id}

**Friend Service (Port 8081):**
- POST /api/friends/request
- GET /api/friends/list/{userId}
- PUT /api/friends/request/{id}/accept

**Group Service (Port 8082):**
- POST /api/groups
- GET /api/groups/{id}
- POST /api/groups/{id}/members

**Message Service (Port 8083):**
- POST /api/messages/send
- GET /api/messages/conversation/{id}
- PUT /api/messages/{id}/read

**Media Service (Port 8084):**
- POST /api/media/upload
- GET /api/media/{id}

**Notification Service (Port 8085):**
- GET /api/notifications/{userId}
- PUT /api/notifications/{id}/read

**AI Chatbot Service (Port 8086):**
- POST /api/chatbot/message
- GET /api/chatbot/suggestions

**Analytics Service (Port 8087):**
- GET /api/analytics/users/stats
- GET /api/analytics/messages/stats

**Search Service (Port 8088):**
- GET /api/search/messages?q={query}
- GET /api/search/users?q={query}

---

### C. Database Schema Examples

**MySQL - Users Table:**
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    display_name VARCHAR(100),
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_phone (phone)
);
```

**MySQL - Friendships Table:**
```sql
CREATE TABLE friendships (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id_1 BIGINT NOT NULL,
    user_id_2 BIGINT NOT NULL,
    status ENUM('pending', 'accepted', 'blocked') DEFAULT 'accepted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id_1) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id_2) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_friendship (user_id_1, user_id_2),
    INDEX idx_user1 (user_id_1),
    INDEX idx_user2 (user_id_2)
);
```

**MongoDB - Messages Collection:**
```javascript
{
  _id: ObjectId("..."),
  conversation_id: "conv_123456",
  sender_id: 12345,
  recipient_id: 67890,  // null nếu là group
  group_id: null,       // null nếu là 1-1
  content: "Hello, how are you?",
  type: "text",         // text, image, video, file, emoji
  media_url: null,
  media_metadata: {
    filename: null,
    size: null,
    mime_type: null
  },
  reply_to: null,       // message_id nếu là reply
  timestamp: ISODate("2026-01-16T06:10:00Z"),
  status: "delivered",  // sent, delivered, read
  read_at: null,
  created_at: ISODate("2026-01-16T06:10:00Z")
}

// Indexes
db.messages.createIndex({ conversation_id: 1, timestamp: -1 });
db.messages.createIndex({ sender_id: 1, timestamp: -1 });
db.messages.createIndex({ recipient_id: 1, status: 1 });
```

---

### D. Event Schema Examples

**Kafka Event - MessageSent:**
```json
{
  "event_type": "message.sent",
  "event_id": "evt_abc123",
  "timestamp": "2026-01-16T06:10:00Z",
  "version": "1.0",
  "payload": {
    "message_id": "msg_xyz789",
    "conversation_id": "conv_123456",
    "sender_id": 12345,
    "recipient_id": 67890,
    "content": "Hello!",
    "type": "text",
    "timestamp": "2026-01-16T06:10:00Z"
  }
}
```

**Kafka Event - FriendRequestSent:**
```json
{
  "event_type": "friend.request_sent",
  "event_id": "evt_def456",
  "timestamp": "2026-01-16T06:15:00Z",
  "version": "1.0",
  "payload": {
    "request_id": 9876,
    "from_user_id": 12345,
    "to_user_id": 54321,
    "timestamp": "2026-01-16T06:15:00Z"
  }
}
```

---

## TÀI LIỆU THAM KHẢO

1. **Microservices Architecture:**
   - "Building Microservices" - Sam Newman
   - "Microservices Patterns" - Chris Richardson

2. **Distributed Systems:**
   - "Designing Data-Intensive Applications" - Martin Kleppmann
   - "System Design Interview" - Alex Xu

3. **Kafka & Event-Driven:**
   - "Kafka: The Definitive Guide" - Neha Narkhede
   - Event-Driven Microservices patterns

4. **Kubernetes:**
   - "Kubernetes in Action" - Marko Lukša
   - Official Kubernetes Documentation

5. **Spring Boot:**
   - Spring Boot Official Documentation
   - "Spring Microservices in Action" - John Carnell

6. **Real-time Systems:**
   - Socket.IO Documentation
   - WebSocket Protocol RFC 6455

---

**HẾT**

*Tài liệu này được thiết kế phục vụ mục đích học tập và nghiên cứu. Các công nghệ và kiến trúc được đề xuất dựa trên best practices hiện đại trong ngành phát triển phần mềm.*
