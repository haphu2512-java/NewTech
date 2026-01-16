package com.zaloclone.user.repository;

import com.zaloclone.user.entity.UserDynamoDB;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;

import java.util.Optional;

/**
 * Repository for UserDynamoDB operations
 * Provides CRUD operations for users in DynamoDB
 */
@Slf4j
@Repository
@RequiredArgsConstructor
public class UserDynamoDBRepository {

    private final DynamoDbEnhancedClient enhancedClient;
    private static final String TABLE_NAME = "zalo-users";

    /**
     * Get DynamoDB table reference
     */
    private DynamoDbTable<UserDynamoDB> getUserTable() {
        return enhancedClient.table(TABLE_NAME, TableSchema.fromBean(UserDynamoDB.class));
    }

    /**
     * Save or update user in DynamoDB
     */
    public UserDynamoDB save(UserDynamoDB user) {
        try {
            user.prePersist();
            getUserTable().putItem(user);
            log.info("User saved to DynamoDB: {}", user.getUserId());
            return user;
        } catch (DynamoDbException e) {
            log.error("Error saving user to DynamoDB: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save user to DynamoDB", e);
        }
    }

    /**
     * Find user by userId
     */
    public Optional<UserDynamoDB> findById(String userId) {
        try {
            Key key = Key.builder()
                    .partitionValue(userId)
                    .build();

            UserDynamoDB user = getUserTable().getItem(key);
            return Optional.ofNullable(user);
        } catch (DynamoDbException e) {
            log.error("Error finding user by ID: {}", e.getMessage(), e);
            return Optional.empty();
        }
    }

    /**
     * Find user by username (requires GSI)
     * Note: This requires a Global Secondary Index on username
     */
    public Optional<UserDynamoDB> findByUsername(String username) {
        try {
            // TODO: Implement GSI query when index is created
            // For now, this is a placeholder
            log.warn("findByUsername requires GSI implementation");
            return Optional.empty();
        } catch (DynamoDbException e) {
            log.error("Error finding user by username: {}", e.getMessage(), e);
            return Optional.empty();
        }
    }

    /**
     * Find user by email (requires GSI)
     */
    public Optional<UserDynamoDB> findByEmail(String email) {
        try {
            // TODO: Implement GSI query when index is created
            log.warn("findByEmail requires GSI implementation");
            return Optional.empty();
        } catch (DynamoDbException e) {
            log.error("Error finding user by email: {}", e.getMessage(), e);
            return Optional.empty();
        }
    }

    /**
     * Delete user by userId
     */
    public void deleteById(String userId) {
        try {
            Key key = Key.builder()
                    .partitionValue(userId)
                    .build();

            getUserTable().deleteItem(key);
            log.info("User deleted from DynamoDB: {}", userId);
        } catch (DynamoDbException e) {
            log.error("Error deleting user: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete user from DynamoDB", e);
        }
    }

    /**
     * Update user status (online/offline/away)
     */
    public void updateUserStatus(String userId, String status) {
        findById(userId).ifPresent(user -> {
            user.setStatus(status);
            user.setLastSeen(System.currentTimeMillis());
            save(user);
        });
    }

    /**
     * Check if user exists by userId
     */
    public boolean existsById(String userId) {
        return findById(userId).isPresent();
    }
}
