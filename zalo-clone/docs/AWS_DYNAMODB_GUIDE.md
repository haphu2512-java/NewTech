# AWS DynamoDB Integration Guide

## Overview

This guide explains how to integrate AWS DynamoDB with the Zalo Clone User Service.

## Table of Contents

1. [AWS Setup](#aws-setup)
2. [Local Development with DynamoDB Local](#local-development)
3. [Creating DynamoDB Tables](#creating-tables)
4. [Configuration](#configuration)
5. [Usage Examples](#usage-examples)

---

## AWS Setup

### 1. Create AWS Account
If you don't have an AWS account, create one at https://aws.amazon.com/

### 2. Configure AWS Credentials

#### Option A: Using AWS CLI
```bash
# Install AWS CLI
# Windows: https://aws.amazon.com/cli/
# Linux/Mac: pip install awscli

# Configure credentials
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region name: us-east-1
# Default output format: json
```

#### Option B: Using Environment Variables
```bash
# Windows (PowerShell)
$env:AWS_ACCESS_KEY_ID="your-access-key"
$env:AWS_SECRET_ACCESS_KEY="your-secret-key"
$env:AWS_REGION="us-east-1"

# Linux/Mac
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_REGION="us-east-1"
```

---

## Local Development

### Using DynamoDB Local

For local development, you can use DynamoDB Local Docker container:

```bash
# Run DynamoDB Local
docker run -p 8000:8000 amazon/dynamodb-local

# Or using docker-compose (add to docker-compose.yml)
```

### Configure application.yml for Local Development

```yaml
aws:
  region: us-east-1
  accessKeyId: fakeAccessKey
  secretAccessKey: fakeSecretKey
  dynamodb:
    endpoint: http://localhost:8000
```

---

## Creating DynamoDB Tables

### 1. Users Table

```bash
aws dynamodb create-table \
    --table-name zalo-users \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
        AttributeName=email,AttributeType=S \
        AttributeName=phone,AttributeType=S \
        AttributeName=username,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --global-secondary-indexes \
        "[{
            \"IndexName\": \"email-index\",
            \"KeySchema\": [{\"AttributeName\":\"email\",\"KeyType\":\"HASH\"}],
            \"Projection\": {\"ProjectionType\":\"ALL\"}
        },
        {
            \"IndexName\": \"phone-index\",
            \"KeySchema\": [{\"AttributeName\":\"phone\",\"KeyType\":\"HASH\"}],
            \"Projection\": {\"ProjectionType\":\"ALL\"}
        },
        {
            \"IndexName\": \"username-index\",
            \"KeySchema\": [{\"AttributeName\":\"username\",\"KeyType\":\"HASH\"}],
            \"Projection\": {\"ProjectionType\":\"ALL\"}
        }]"
```

### 2. User Sessions Table

```bash
aws dynamodb create-table \
    --table-name zalo-user-sessions \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
        AttributeName=sessionId,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
        AttributeName=sessionId,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    --time-to-live-specification \
        "Enabled=true,AttributeName=expires_at"
```

### 3. User Presence Table

```bash
aws dynamodb create-table \
    --table-name zalo-user-presence \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --time-to-live-specification \
        "Enabled=true,AttributeName=last_activity"
```

### For Local DynamoDB

Add `--endpoint-url http://localhost:8000` to each command:

```bash
aws dynamodb create-table --endpoint-url http://localhost:8000 \
    --table-name zalo-users \
    # ... rest of the parameters
```

---

## Configuration

### application.yml Configuration

```yaml
aws:
  region: us-east-1
  accessKeyId: ${AWS_ACCESS_KEY_ID:}
  secretAccessKey: ${AWS_SECRET_ACCESS_KEY:}
  
  dynamodb:
    endpoint: ${DYNAMODB_ENDPOINT:}  # Empty for AWS cloud, http://localhost:8000 for local
    tables:
      users: zalo-users
      sessions: zalo-user-sessions
      presence: zalo-user-presence
  
  s3:
    bucket: zalo-media-bucket
    endpoint: ${S3_ENDPOINT:}
```

---

## Usage Examples

### 1. Save User to DynamoDB

```java
@Service
@RequiredArgsConstructor
public class UserServiceImpl {
    
    private final UserDynamoDBRepository dynamoDBRepository;
    
    public UserDynamoDB createUser(RegisterRequest request) {
        UserDynamoDB user = UserDynamoDB.builder()
                .userId(UUID.randomUUID().toString())
                .username(request.getUsername())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();
        
        return dynamoDBRepository.save(user);
    }
}
```

### 2. Find User by ID

```java
Optional<UserDynamoDB> user = dynamoDBRepository.findById("user-id-123");
user.ifPresent(u -> {
    System.out.println("User found: " + u.getUsername());
});
```

### 3. Update User Status

```java
dynamoDBRepository.updateUserStatus("user-id-123", "online");
```

### 4. Session Management

```java
@Service
@RequiredArgsConstructor
public class SessionService {
    
    private final UserSessionRepository sessionRepository;
    
    public UserSession createSession(String userId, String deviceInfo) {
        UserSession session = UserSession.builder()
                .userId(userId)
                .sessionId(UUID.randomUUID().toString())
                .token(generateToken())
                .deviceInfo(deviceInfo)
                .createdAt(System.currentTimeMillis())
                .expiresAt(System.currentTimeMillis() + 86400000) // 24 hours
                .isActive(true)
                .build();
        
        return sessionRepository.save(session);
    }
    
    public List<UserSession> getActiveSessions(String userId) {
        return sessionRepository.findActiveSessionsByUserId(userId);
    }
}
```

---

## DynamoDB Best Practices

### 1. Use Appropriate Data Types
- Use `Long` for timestamps (epoch milliseconds)
- Use `String` for IDs (UUID recommended)
- Use `Boolean` for flags

### 2. Enable TTL for Temporary Data
- Sessions should auto-expire using TTL
- Presence data can have TTL

### 3. Use Global Secondary Indexes (GSI) Wisely
- Create GSI for frequently queried attributes
- Email, phone, username need GSI for lookups

### 4. Batch Operations
```java
// For multiple items, use batch operations
batchGetItem() / batchWriteItem()
```

### 5. Error Handling
- Handle `ProvisionedThroughputExceededException`
- Implement retry logic with exponential backoff
- Use `ConditionalCheckFailedException` for optimistic locking

---

## Monitoring and Costs

### CloudWatch Metrics
- Monitor ConsumedReadCapacityUnits
- Monitor ConsumedWriteCapacityUnits
- Set up alarms for throttling

### Cost Optimization
- Use PAY_PER_REQUEST for variable workloads
- Use PROVISIONED for predictable workloads
- Enable Auto Scaling for provisioned capacity

---

## Troubleshooting

### Common Issues

1. **Credentials Not Found**
   - Ensure AWS credentials are configured
   - Check environment variables

2. **Table Not Found**
   - Verify table names in configuration
   - Check if tables are created in the correct region

3. **Access Denied**
   - Check IAM permissions
   - Ensure user has DynamoDB read/write access

4. **Connection Timeout**
   - Check network connectivity
   - Verify endpoint URL for local DynamoDB

---

## Migration from MySQL to DynamoDB

If you need dual database support:

```java
@Service
public class UserService {
    
    @Autowired(required = false)
    private UserRepository mysqlRepository;
    
    @Autowired(required = false)
    private UserDynamoDBRepository dynamoDBRepository;
    
    @Value("${database.primary:mysql}")
    private String primaryDatabase;
    
    public User saveUser(User user) {
        if ("dynamodb".equals(primaryDatabase)) {
            // Save to DynamoDB
            UserDynamoDB dynamoUser = convertToDynamoDB(user);
            return convertToUser(dynamoDBRepository.save(dynamoUser));
        } else {
            // Save to MySQL
            return mysqlRepository.save(user);
        }
    }
}
```

---

## References

- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [AWS SDK for Java v2](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
