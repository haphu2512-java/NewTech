package com.zaloclone.user.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey;

/**
 * DynamoDB UserSession Entity
 * Tracks user login sessions across devices
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class UserSession {

    private String userId;
    private String sessionId;
    private String token;
    private String deviceInfo;
    private String ipAddress;
    private Long createdAt;
    private Long expiresAt;
    private Boolean isActive;
    private String userAgent;

    @DynamoDbPartitionKey
    @DynamoDbAttribute("userId")
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @DynamoDbSortKey
    @DynamoDbAttribute("sessionId")
    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    @DynamoDbAttribute("token")
    public String getToken() {
        return token;
    }

    @DynamoDbAttribute("device_info")
    public String getDeviceInfo() {
        return deviceInfo;
    }

    @DynamoDbAttribute("ip_address")
    public String getIpAddress() {
        return ipAddress;
    }

    @DynamoDbAttribute("created_at")
    public Long getCreatedAt() {
        return createdAt;
    }

    @DynamoDbAttribute("expires_at")
    public Long getExpiresAt() {
        return expiresAt;
    }

    @DynamoDbAttribute("is_active")
    public Boolean getIsActive() {
        return isActive;
    }

    @DynamoDbAttribute("user_agent")
    public String getUserAgent() {
        return userAgent;
    }
}
