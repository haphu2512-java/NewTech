# Zalo Clone - OTT Messaging Platform

Hệ thống OTT giả lập tương tự Zalo, sử dụng kiến trúc Microservices.

## 📁 Cấu trúc Project

```
zalo-clone/
├── backend/                    # Backend Microservices
│   ├── user-service/          # Java Spring Boot
│   ├── friend-service/        # Java Spring Boot
│   ├── group-service/         # Java Spring Boot
│   ├── message-service/       # NodeJS/Express
│   ├── media-service/         # NodeJS/Express
│   ├── notification-service/  # NodeJS/Express
│   ├── chatbot-service/       # Python/FastAPI
│   ├── analytics-service/     # Java Spring Boot
│   ├── presence-service/      # NodeJS/Express
│   └── search-service/        # Java Spring Boot
├── frontend/                  # Frontend Applications
│   ├── web-app/              # ReactJS
│   └── mobile-app/           # React Native
├── infrastructure/            # Infrastructure configs
│   ├── docker/               # Docker configs
│   ├── kubernetes/           # K8s manifests
│   └── monitoring/           # Prometheus, Grafana
├── database/                 # Database schemas & migrations
│   ├── mysql/
│   ├── mongodb/
│   └── redis/
├── gateway/                  # API Gateway
└── docs/                     # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Python 3.10+
- Docker & Docker Compose
- MySQL 8.0
- MongoDB 6.0
- Redis 7.0

### Installation

```bash
# Clone repository
git clone <repo-url>
cd zalo-clone

# Build all services
./scripts/build-all.sh

# Run with Docker Compose
docker-compose up -d
```

## ☁️ AWS Integration (New!)

Dự án đã được tích hợp với các dịch vụ AWS để tăng khả năng mở rộng và hiệu năng:

### AWS Services Integrated

- **Amazon DynamoDB**: NoSQL database cho user profiles và sessions
  - Auto-scaling capacity
  - Global Secondary Indexes (GSI)
  - Time-to-Live (TTL) support
  
- **Amazon S3**: Object storage cho media files
  - Hình ảnh, video, documents
  - CDN integration với CloudFront
  
- **Local Development Support**:
  - DynamoDB Local (port 8000)
  - MinIO S3-compatible storage (ports 9000, 9001)

### Quick Start với AWS

#### 1. Local Development
```bash
# Start all services bao gồm DynamoDB Local
docker-compose up -d

# Tạo DynamoDB tables (Windows)
.\scripts\create-dynamodb-tables.ps1 -EndpointUrl "http://localhost:8000"

# Hoặc Linux/Mac
./scripts/create-dynamodb-tables.sh http://localhost:8000
```

#### 2. AWS Cloud Deployment
```bash
# Configure AWS credentials
aws configure

# Tạo DynamoDB tables trên AWS
.\scripts\create-dynamodb-tables.ps1  # Windows
./scripts/create-dynamodb-tables.sh   # Linux/Mac

# Tạo S3 bucket
aws s3 mb s3://zalo-media-bucket
```

## 📚 Documentation

Xem [KIEN_TRUC_HE_THONG_OTT.md](../README.md) để biết chi tiết về kiến trúc.

**Frontend Development:**
- [📖 Frontend Guide - ReactJS & React Native](docs/FRONTEND_GUIDE.md)

**AWS Integration:**
- [📖 Quick Start Guide](docs/QUICKSTART_AWS.md)
- [📖 DynamoDB Integration Guide](docs/AWS_DYNAMODB_GUIDE.md)
- [📖 AWS Integration Summary](docs/AWS_INTEGRATION_SUMMARY.md)

## 🛠️ Tech Stack

- **Backend**: Java Spring Boot, NodeJS, Python FastAPI
- **Frontend**: ReactJS (Web), React Native (Mobile)
- **Database**: MySQL, MongoDB, Redis, PostgreSQL, Elasticsearch, **AWS DynamoDB**
- **Message Queue**: Apache Kafka
- **Cloud Services**: **AWS (DynamoDB, S3, ElastiCache, RDS, MSK, CloudFront)**
- **Deployment**: Docker, Kubernetes
