#!/bin/bash

# Script to create DynamoDB tables for Zalo Clone
# Usage: ./create-dynamodb-tables.sh [endpoint-url]
# Default endpoint is AWS cloud, provide http://localhost:8000 for local DynamoDB

ENDPOINT_URL="${1:-}"
REGION="${AWS_REGION:-us-east-1}"

# Function to create table with optional endpoint
create_table() {
    local cmd="$1"
    if [ -n "$ENDPOINT_URL" ]; then
        cmd="$cmd --endpoint-url $ENDPOINT_URL"
    fi
    eval "$cmd"
}

echo "Creating DynamoDB tables..."
echo "Region: $REGION"
if [ -n "$ENDPOINT_URL" ]; then
    echo "Endpoint: $ENDPOINT_URL (Local DynamoDB)"
else
    echo "Endpoint: AWS Cloud"
fi
echo ""

# 1. Create Users Table
echo "Creating zalo-users table..."
create_table "aws dynamodb create-table \
    --region $REGION \
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
        '[{
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
        }]'"

if [ $? -eq 0 ]; then
    echo "✓ zalo-users table created successfully"
else
    echo "✗ Failed to create zalo-users table"
fi
echo ""

# 2. Create User Sessions Table
echo "Creating zalo-user-sessions table..."
create_table "aws dynamodb create-table \
    --region $REGION \
    --table-name zalo-user-sessions \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
        AttributeName=sessionId,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
        AttributeName=sessionId,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST"

if [ $? -eq 0 ]; then
    echo "✓ zalo-user-sessions table created successfully"
    
    # Enable TTL for sessions
    sleep 2
    echo "Enabling TTL on zalo-user-sessions..."
    create_table "aws dynamodb update-time-to-live \
        --region $REGION \
        --table-name zalo-user-sessions \
        --time-to-live-specification 'Enabled=true,AttributeName=expires_at'"
    
    if [ $? -eq 0 ]; then
        echo "✓ TTL enabled on zalo-user-sessions"
    fi
else
    echo "✗ Failed to create zalo-user-sessions table"
fi
echo ""

# 3. Create User Presence Table
echo "Creating zalo-user-presence table..."
create_table "aws dynamodb create-table \
    --region $REGION \
    --table-name zalo-user-presence \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST"

if [ $? -eq 0 ]; then
    echo "✓ zalo-user-presence table created successfully"
    
    # Enable TTL for presence
    sleep 2
    echo "Enabling TTL on zalo-user-presence..."
    create_table "aws dynamodb update-time-to-live \
        --region $REGION \
        --table-name zalo-user-presence \
        --time-to-live-specification 'Enabled=true,AttributeName=last_activity'"
    
    if [ $? -eq 0 ]; then
        echo "✓ TTL enabled on zalo-user-presence"
    fi
else
    echo "✗ Failed to create zalo-user-presence table"
fi
echo ""

echo "DynamoDB tables creation completed!"
echo ""
echo "To verify tables, run:"
if [ -n "$ENDPOINT_URL" ]; then
    echo "  aws dynamodb list-tables --endpoint-url $ENDPOINT_URL --region $REGION"
else
    echo "  aws dynamodb list-tables --region $REGION"
fi
