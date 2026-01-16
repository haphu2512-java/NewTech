# Quick Start Guide - AWS DynamoDB Integration

## Prerequisites

- Docker Desktop installed
- Java 17+ installed
- Maven installed
- AWS CLI installed (optional, for cloud deployment)

## Local Development Setup (5 minutes)

### Step 1: Start All Services

```bash
# Navigate to project root
cd zalo-clone

# Start all services including DynamoDB Local and MinIO
docker-compose up -d

# Verify all services are running
docker-compose ps
```

You should see:
- ✅ zalo-mysql (port 3306)
- ✅ zalo-mongodb (port 27017)
- ✅ zalo-redis (port 6379)
- ✅ zalo-kafka (port 9092)
- ✅ zalo-dynamodb-local (port 8000) **← NEW**
- ✅ zalo-minio (ports 9000, 9001) **← NEW**

### Step 2: Create DynamoDB Tables

**Windows (PowerShell):**
```powershell
.\scripts\create-dynamodb-tables.ps1 -EndpointUrl "http://localhost:8000"
```

**Linux/Mac:**
```bash
chmod +x ./scripts/create-dynamodb-tables.sh
./scripts/create-dynamodb-tables.sh http://localhost:8000
```

Expected output:
```
Creating DynamoDB tables...
Region: us-east-1
Endpoint: http://localhost:8000 (Local DynamoDB)

Creating zalo-users table...
✓ zalo-users table created successfully

Creating zalo-user-sessions table...
✓ zalo-user-sessions table created successfully
✓ TTL enabled on zalo-user-sessions

Creating zalo-user-presence table...
✓ zalo-user-presence table created successfully
✓ TTL enabled on zalo-user-presence
```

### Step 3: Verify Tables Created

```bash
# List all tables
aws dynamodb list-tables --endpoint-url http://localhost:8000 --region us-east-1

# Expected output:
# {
#     "TableNames": [
#         "zalo-users",
#         "zalo-user-sessions",
#         "zalo-user-presence"
#     ]
# }
```

### Step 4: Run User Service

```bash
cd backend/user-service
mvn spring-boot:run
```

The service will start on port 8080 and automatically connect to:
- MySQL (for backward compatibility)
- Redis (for caching)
- Kafka (for events)
- **DynamoDB Local** (for user data) **← NEW**
- **MinIO** (for S3-compatible storage) **← NEW**

### Step 5: Test DynamoDB Integration

Open another terminal and test the endpoints:

```bash
# 1. Register a new user (data will be saved to DynamoDB)
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "phone": "0123456789",
    "password": "password123"
  }'

# 2. Login
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'

# 3. Get user profile
curl -X GET http://localhost:8080/api/users/{userId} \
  -H "Authorization: Bearer {token}"
```

### Step 6: Verify Data in DynamoDB

```bash
# Scan users table to see all users
aws dynamodb scan \
  --table-name zalo-users \
  --endpoint-url http://localhost:8000 \
  --region us-east-1
```

### Step 7: Access MinIO Console

Open browser: http://localhost:9001

- Username: `minioadmin`
- Password: `minioadmin`

Create a bucket named `zalo-media-bucket` for media storage.

---

## AWS Cloud Deployment

### Step 1: Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: us-east-1
# Default output format: json
```

### Step 2: Create DynamoDB Tables in AWS

**Windows:**
```powershell
.\scripts\create-dynamodb-tables.ps1
```

**Linux/Mac:**
```bash
./scripts/create-dynamodb-tables.sh
```

### Step 3: Create S3 Bucket

```bash
aws s3 mb s3://zalo-media-bucket --region us-east-1
```

### Step 4: Update Configuration for Production

Edit `application.yml`:

```yaml
aws:
  region: us-east-1
  # Remove access keys, use IAM roles instead
  accessKeyId: 
  secretAccessKey: 
  
  dynamodb:
    endpoint:  # Empty for AWS cloud
  
  s3:
    bucket: zalo-media-bucket
    endpoint:  # Empty for AWS cloud
```

### Step 5: Deploy to AWS

```bash
# Build the application
mvn clean package -DskipTests

# Deploy using your preferred method (EC2, ECS, EKS, etc.)
```

---

## Switching Between MySQL and DynamoDB

The current implementation uses both databases. To switch primary database:

### Option 1: Keep Both (Recommended for Migration)
- MySQL for relational data (friends, groups)
- DynamoDB for user profiles and sessions

### Option 2: Use Only DynamoDB
Update your service to use only `UserDynamoDBRepository`

### Option 3: Configuration-Based Switch
Add to `application.yml`:
```yaml
database:
  primary: dynamodb  # or 'mysql'
```

Then in your service:
```java
@Value("${database.primary:mysql}")
private String primaryDatabase;

public User saveUser(User user) {
    if ("dynamodb".equals(primaryDatabase)) {
        // Use DynamoDB
    } else {
        // Use MySQL
    }
}
```

---

## Troubleshooting

### Issue: DynamoDB Local not starting
**Solution:**
```bash
docker-compose down
docker-compose up -d dynamodb-local
docker logs zalo-dynamodb-local
```

### Issue: Tables already exist error
**Solution:**
```bash
# Delete existing tables
aws dynamodb delete-table --table-name zalo-users --endpoint-url http://localhost:8000
aws dynamodb delete-table --table-name zalo-user-sessions --endpoint-url http://localhost:8000
aws dynamodb delete-table --table-name zalo-user-presence --endpoint-url http://localhost:8000

# Recreate
.\scripts\create-dynamodb-tables.ps1 -EndpointUrl "http://localhost:8000"
```

### Issue: AWS credentials not found
**Solution:**
```bash
# For local development
$env:AWS_ACCESS_KEY_ID="fakeAccessKey"
$env:AWS_SECRET_ACCESS_KEY="fakeSecretKey"

# For AWS cloud
aws configure
```

### Issue: Connection refused to DynamoDB
**Solution:**
1. Check if DynamoDB Local is running: `docker ps | findstr dynamodb`
2. Verify endpoint in application.yml: `http://dynamodb-local:8000` (in Docker) or `http://localhost:8000` (outside Docker)

---

## What's Next?

1. ✅ Install dependencies
2. ✅ Start Docker services
3. ✅ Create DynamoDB tables
4. ✅ Test basic CRUD operations
5. 🔜 Implement Global Secondary Index queries
6. 🔜 Add S3 upload functionality
7. 🔜 Implement DynamoDB Streams for real-time updates
8. 🔜 Add CloudWatch monitoring
9. 🔜 Deploy to AWS

---

## Useful Commands

### DynamoDB Local

```bash
# List all tables
aws dynamodb list-tables --endpoint-url http://localhost:8000

# Describe table
aws dynamodb describe-table --table-name zalo-users --endpoint-url http://localhost:8000

# Scan table (see all items)
aws dynamodb scan --table-name zalo-users --endpoint-url http://localhost:8000

# Get specific item
aws dynamodb get-item \
  --table-name zalo-users \
  --key '{"userId": {"S": "user-123"}}' \
  --endpoint-url http://localhost:8000
```

### Docker

```bash
# View logs
docker logs zalo-dynamodb-local
docker logs zalo-user-service

# Restart service
docker-compose restart user-service

# Stop all
docker-compose down

# Remove volumes and start fresh
docker-compose down -v
docker-compose up -d
```

---

## Resources

- 📖 [AWS DynamoDB Guide](./AWS_DYNAMODB_GUIDE.md)
- 📖 [AWS Integration Summary](./AWS_INTEGRATION_SUMMARY.md)
- 📖 [Main Architecture Documentation](../README.md)
- 🌐 [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- 🌐 [MinIO Documentation](https://min.io/docs/minio/linux/index.html)
