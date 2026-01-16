package com.zaloclone.user.repository;

import com.zaloclone.user.entity.UserSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Repository for UserSession operations in DynamoDB
 */
@Slf4j
@Repository
@RequiredArgsConstructor
public class UserSessionRepository {

    private final DynamoDbEnhancedClient enhancedClient;
    private static final String TABLE_NAME = "zalo-user-sessions";

    /**
     * Get session table reference
     */
    private DynamoDbTable<UserSession> getSessionTable() {
        return enhancedClient.table(TABLE_NAME, TableSchema.fromBean(UserSession.class));
    }

    /**
     * Create new session
     */
    public UserSession save(UserSession session) {
        try {
            getSessionTable().putItem(session);
            log.info("Session saved: userId={}, sessionId={}", session.getUserId(), session.getSessionId());
            return session;
        } catch (DynamoDbException e) {
            log.error("Error saving session: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save session", e);
        }
    }

    /**
     * Find session by userId and sessionId
     */
    public Optional<UserSession> findByUserIdAndSessionId(String userId, String sessionId) {
        try {
            Key key = Key.builder()
                    .partitionValue(userId)
                    .sortValue(sessionId)
                    .build();

            UserSession session = getSessionTable().getItem(key);
            return Optional.ofNullable(session);
        } catch (DynamoDbException e) {
            log.error("Error finding session: {}", e.getMessage(), e);
            return Optional.empty();
        }
    }

    /**
     * Get all active sessions for a user
     */
    public List<UserSession> findActiveSessionsByUserId(String userId) {
        try {
            QueryConditional queryConditional = QueryConditional.keyEqualTo(
                    Key.builder()
                            .partitionValue(userId)
                            .build());

            List<UserSession> sessions = new ArrayList<>();
            getSessionTable().query(queryConditional).items().forEach(session -> {
                if (Boolean.TRUE.equals(session.getIsActive())) {
                    sessions.add(session);
                }
            });

            return sessions;
        } catch (DynamoDbException e) {
            log.error("Error querying sessions: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    /**
     * Invalidate a session
     */
    public void invalidateSession(String userId, String sessionId) {
        findByUserIdAndSessionId(userId, sessionId).ifPresent(session -> {
            session.setIsActive(false);
            save(session);
            log.info("Session invalidated: {}", sessionId);
        });
    }

    /**
     * Delete session
     */
    public void deleteSession(String userId, String sessionId) {
        try {
            Key key = Key.builder()
                    .partitionValue(userId)
                    .sortValue(sessionId)
                    .build();

            getSessionTable().deleteItem(key);
            log.info("Session deleted: {}", sessionId);
        } catch (DynamoDbException e) {
            log.error("Error deleting session: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete session", e);
        }
    }

    /**
     * Invalidate all sessions for a user
     */
    public void invalidateAllUserSessions(String userId) {
        List<UserSession> sessions = findActiveSessionsByUserId(userId);
        sessions.forEach(session -> invalidateSession(userId, session.getSessionId()));
        log.info("All sessions invalidated for user: {}", userId);
    }
}
