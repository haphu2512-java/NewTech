package com.zaloclone.user.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.s3.S3Client;

import java.net.URI;

/**
 * AWS Configuration for DynamoDB and S3
 */
@Configuration
public class AwsConfig {

    @Value("${aws.region:us-east-1}")
    private String awsRegion;

    @Value("${aws.accessKeyId:}")
    private String accessKeyId;

    @Value("${aws.secretAccessKey:}")
    private String secretAccessKey;

    @Value("${aws.dynamodb.endpoint:}")
    private String dynamodbEndpoint;

    @Value("${aws.s3.endpoint:}")
    private String s3Endpoint;

    /**
     * DynamoDB Client Bean
     * Supports both AWS cloud and local DynamoDB (for development)
     */
    @Bean
    public DynamoDbClient dynamoDbClient() {
        var builder = DynamoDbClient.builder()
                .region(Region.of(awsRegion));

        // For local DynamoDB (development)
        if (!dynamodbEndpoint.isEmpty()) {
            builder.endpointOverride(URI.create(dynamodbEndpoint));
        }

        // Add credentials if provided
        if (!accessKeyId.isEmpty() && !secretAccessKey.isEmpty()) {
            builder.credentialsProvider(
                    StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(accessKeyId, secretAccessKey)));
        }

        return builder.build();
    }

    /**
     * DynamoDB Enhanced Client for easier ORM-like operations
     */
    @Bean
    public DynamoDbEnhancedClient dynamoDbEnhancedClient(DynamoDbClient dynamoDbClient) {
        return DynamoDbEnhancedClient.builder()
                .dynamoDbClient(dynamoDbClient)
                .build();
    }

    /**
     * S3 Client Bean for media storage
     */
    @Bean
    public S3Client s3Client() {
        var builder = S3Client.builder()
                .region(Region.of(awsRegion));

        // For local S3 (MinIO for development)
        if (!s3Endpoint.isEmpty()) {
            builder.endpointOverride(URI.create(s3Endpoint));
        }

        // Add credentials if provided
        if (!accessKeyId.isEmpty() && !secretAccessKey.isEmpty()) {
            builder.credentialsProvider(
                    StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(accessKeyId, secretAccessKey)));
        }

        return builder.build();
    }
}
