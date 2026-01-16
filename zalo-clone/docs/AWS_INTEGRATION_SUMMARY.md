# AWS Services Integration Summary

## Overview

This document summarizes the AWS services integration into the Zalo Clone project.

## Integrated AWS Services

### 1. **Amazon DynamoDB**
- **Purpose**: NoSQL database for user data and sessions
- **Tables Created**:
  - `zalo-users` - User profile data with GSI for email, phone, username
  - `zalo-user-sessions` - User login sessions tracking
  - `zalo-user-presence` - Real-time user presence/status
- **Features Used**:
  - Auto-scaling (PAY_PER_REQUEST mode)
  - Global Secondary Indexes (GSI)
  - Time-to-Live (TTL) for automatic data expiration
  - DynamoDB Enhanced Client for ORM-like operations

### 2. **Amazon S3** 
- **Purpose**: Object storage for media files (images, videos, documents)
- **Integration**: AWS SDK for Java v2
- **Local Alternative**: MinIO for development

### 3. **Other AWS Services** (Documentation)
- **Amazon ElastiCache**: Redis-compatible cache
- **Amazon RDS**: Managed MySQL/PostgreSQL
- **Amazon MSK**: Managed Kafka
- **Amazon CloudFront**: CDN for content delivery

## Files Created

### Java Files
1. **AwsConfig.java** - AWS SDK configuration
   - DynamoDB client initialization
   - S3 client initialization
   - Support for both cloud and local endpoints

2. **UserDynamoDB.java** - DynamoDB user entity
   - Partition key: userId
   - Attributes: username, email, phone, password, status, etc.
   - Automatic timestamps

3. **UserSession.java** - DynamoDB session entity
   - Composite key: userId + sessionId
   - TTL support for auto-expiration

4. **UserDynamoDBRepository.java** - Repository for user CRUD operations
   - Save, find, update, delete operations
   - GSI query placeholders

5. **UserSessionRepository.java** - Repository for session management
   - Multi-device session tracking
   - Session invalidation support

### Configuration Files
1. **application.yml** - Updated with AWS configuration
   - AWS region, credentials
   - DynamoDB endpoint configuration
   - S3 bucket configuration

2. **pom.xml** - Added AWS SDK dependencies
   - AWS SDK for DynamoDB (v2.21.0)
   - DynamoDB Enhanced Client
   - AWS SDK for S3
   - AWS Core Authentication

### Docker Configuration
1. **docker-compose.yml** - Added local AWS services
   - DynamoDB Local container (port 8000)
   - MinIO S3-compatible storage (ports 9000, 9001)
   - Environment variables for AWS configuration

### Documentation
1. **AWS_DYNAMODB_GUIDE.md** - Comprehensive integration guide
   - AWS setup instructions
   - Local development setup
   - Table creation commands
   - Usage examples
   - Best practices

2. **README.md** - Updated architecture documentation
   - DynamoDB table schemas
   - AWS services description
   - Tech stack updates

### Scripts
1. **create-dynamodb-tables.sh** - Bash script for table creation
   - Creates all DynamoDB tables
   - Configures GSI and TTL
   - Supports both AWS and local DynamoDB

2. **create-dynamodb-tables.ps1** - PowerShell script (Windows)
   - Same functionality as bash script
   - Colored output for better UX

## How to Use

### Local Development

1. **Start all services including DynamoDB Local**:
   ```bash
   docker-compose up -d
   ```

2. **Create DynamoDB tables** (first time only):
   ```bash
   # Windows (PowerShell)
   .\scripts\create-dynamodb-tables.ps1 -EndpointUrl "http://localhost:8000"
   
   # Linux/Mac
   ./scripts/create-dynamodb-tables.sh http://localhost:8000
   ```

3. **Run User Service**:
   ```bash
   cd backend/user-service
   mvn spring-boot:run
   ```

### AWS Cloud Deployment

1. **Configure AWS credentials**:
   ```bash
   aws configure
   ```

2. **Create DynamoDB tables in AWS**:
   ```bash
   # Windows
   .\scripts\create-dynamodb-tables.ps1
   
   # Linux/Mac
   ./scripts/create-dynamodb-tables.sh
   ```

3. **Update application.yml** (remove endpoint properties for production):
   ```yaml
   aws:
     region: us-east-1
     dynamodb:
       endpoint:  # Leave empty for AWS cloud
     s3:
       endpoint:  # Leave empty for AWS cloud
   ```

4. **Use IAM roles** (recommended for production):
   - Don't use access keys in production
   - Attach IAM role to EC2/EKS instances
   - Role should have DynamoDB and S3 permissions

## Benefits

### 1. **Scalability**
- DynamoDB auto-scales to handle millions of requests
- No need to manage database servers

### 2. **Performance**
- Single-digit millisecond latency
- Global tables for multi-region support

### 3. **Cost-Effective**
- Pay only for what you use (PAY_PER_REQUEST)
- No upfront costs for infrastructure

### 4. **Reliability**
- 99.99% availability SLA
- Automatic backups with point-in-time recovery

### 5. **Serverless**
- No server management
- Focus on application logic

## Migration Strategy

### Dual Database Support (Optional)

You can run MySQL and DynamoDB in parallel:

```java
@Value("${database.primary:mysql}")
private String primaryDatabase;

public User saveUser(User user) {
    if ("dynamodb".equals(primaryDatabase)) {
        return saveToD DynamoDB(user);
    } else {
        return saveToMySQL(user);
    }
}
```

This allows gradual migration without downtime.

## IAM Permissions Required

For production deployment, create an IAM policy with these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:*:table/zalo-users",
        "arn:aws:dynamodb:us-east-1:*:table/zalo-user-sessions",
        "arn:aws:dynamodb:us-east-1:*:table/zalo-user-presence",
        "arn:aws:dynamodb:us-east-1:*:table/zalo-users/index/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::zalo-media-bucket/*"
    }
  ]
}
```

## Monitoring

### CloudWatch Metrics to Monitor
- ConsumedReadCapacityUnits
- ConsumedWriteCapacityUnits
- SystemErrors
- UserErrors
- ThrottledRequests

### Set Up Alarms
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name zalo-dynamodb-throttle \
  --alarm-description "Alert when DynamoDB is throttling" \
  --metric-name ThrottledRequests \
  --namespace AWS/DynamoDB \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold
```

## Cost Estimation

### DynamoDB
- **On-Demand Mode**: $1.25 per million write requests, $0.25 per million read requests
- **Provisioned Mode**: Cheaper for predictable workloads

### S3
- **Storage**: $0.023 per GB/month (first 50 TB)
- **Requests**: $0.005 per 1,000 PUT requests, $0.0004 per 1,000 GET requests

## Next Steps

1. **Implement GSI queries** in UserDynamoDBRepository for email/phone/username lookups
2. **Add DynamoDB Streams** for real-time data replication
3. **Implement S3 upload** functionality in MediaService
4. **Add CloudWatch logging** and monitoring
5. **Set up DynamoDB backups** using AWS Backup
6. **Configure VPC endpoints** for secure AWS service communication
7. **Implement caching** with DAX (DynamoDB Accelerator)

## References

- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [AWS SDK for Java v2](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
