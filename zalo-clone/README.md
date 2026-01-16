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
│   ├── web-app/              # Angular/React
│   └── mobile-app/           # Flutter
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

## 📚 Documentation

Xem [KIEN_TRUC_HE_THONG_OTT.md](../KIEN_TRUC_HE_THONG_OTT.md) để biết chi tiết về kiến trúc.

## 🛠️ Tech Stack

- **Backend**: Java Spring Boot, NodeJS, Python FastAPI
- **Frontend**: Angular, Flutter
- **Database**: MySQL, MongoDB, Redis, PostgreSQL, Elasticsearch
- **Message Queue**: Apache Kafka
- **Deployment**: Docker, Kubernetes
