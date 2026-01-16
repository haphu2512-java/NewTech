package com.zaloclone.user.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

import java.time.Instant;

/**
 * DynamoDB User Entity
 * Represents user data stored in AWS DynamoDB
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class UserDynamoDB {

    private String userId;
    private String username;
    private String email;
    private String phone;
    private String passwordHash;
    private String avatarUrl;
    private String status; // online, offline, away
    private Long lastSeen; // timestamp
    private Long createdAt; // timestamp
    private Long updatedAt; // timestamp
    private String firstName;
    private String lastName;
    private String bio;
    private Boolean isVerified;

    @DynamoDbPartitionKey
    @DynamoDbAttribute("userId")
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @DynamoDbAttribute("username")
    public String getUsername() {
        return username;
    }

    @DynamoDbAttribute("email")
    public String getEmail() {
        return email;
    }

    @DynamoDbAttribute("phone")
    public String getPhone() {
        return phone;
    }

    @DynamoDbAttribute("password_hash")
    public String getPasswordHash() {
        return passwordHash;
    }

    @DynamoDbAttribute("avatar_url")
    public String getAvatarUrl() {
        return avatarUrl;
    }

    @DynamoDbAttribute("status")
    public String getStatus() {
        return status;
    }

    @DynamoDbAttribute("last_seen")
    public Long getLastSeen() {
        return lastSeen;
    }

    @DynamoDbAttribute("created_at")
    public Long getCreatedAt() {
        return createdAt;
    }

    @DynamoDbAttribute("updated_at")
    public Long getUpdatedAt() {
        return updatedAt;
    }

    @DynamoDbAttribute("first_name")
    public String getFirstName() {
        return firstName;
    }

    @DynamoDbAttribute("last_name")
    public String getLastName() {
        return lastName;
    }

    @DynamoDbAttribute("bio")
    public String getBio() {
        return bio;
    }

    @DynamoDbAttribute("is_verified")
    public Boolean getIsVerified() {
        return isVerified;
    }

    /**
     * Pre-persist method to set timestamps
     */
    public void prePersist() {
        long now = Instant.now().toEpochMilli();
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;
        if (status == null) {
            status = "offline";
        }
        if (isVerified == null) {
            isVerified = false;
        }
    }
}
