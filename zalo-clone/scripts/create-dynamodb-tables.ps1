# PowerShell script to create DynamoDB tables for Zalo Clone
# Usage: .\create-dynamodb-tables.ps1 [-EndpointUrl "http://localhost:8000"]

param(
    [string]$EndpointUrl = "",
    [string]$Region = "us-east-1"
)

function Create-DynamoDBTable {
    param(
        [string]$Command
    )
    
    if ($EndpointUrl) {
        $Command = "$Command --endpoint-url $EndpointUrl"
    }
    
    Write-Host "Executing: $Command" -ForegroundColor Gray
    Invoke-Expression $Command
    return $LASTEXITCODE
}

Write-Host "Creating DynamoDB tables..." -ForegroundColor Cyan
Write-Host "Region: $Region"
if ($EndpointUrl) {
    Write-Host "Endpoint: $EndpointUrl (Local DynamoDB)"
} else {
    Write-Host "Endpoint: AWS Cloud"
}
Write-Host ""

# 1. Create Users Table
Write-Host "Creating zalo-users table..." -ForegroundColor Yellow
$usersTableCommand = @"
aws dynamodb create-table ``
    --region $Region ``
    --table-name zalo-users ``
    --attribute-definitions ``
        AttributeName=userId,AttributeType=S ``
        AttributeName=email,AttributeType=S ``
        AttributeName=phone,AttributeType=S ``
        AttributeName=username,AttributeType=S ``
    --key-schema ``
        AttributeName=userId,KeyType=HASH ``
    --billing-mode PAY_PER_REQUEST ``
    --global-secondary-indexes ``
        '[{\"IndexName\":\"email-index\",\"KeySchema\":[{\"AttributeName\":\"email\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}},{\"IndexName\":\"phone-index\",\"KeySchema\":[{\"AttributeName\":\"phone\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}},{\"IndexName\":\"username-index\",\"KeySchema\":[{\"AttributeName\":\"username\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}]'
"@

$result = Create-DynamoDBTable -Command $usersTableCommand
if ($result -eq 0) {
    Write-Host "✓ zalo-users table created successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to create zalo-users table" -ForegroundColor Red
}
Write-Host ""

# 2. Create User Sessions Table
Write-Host "Creating zalo-user-sessions table..." -ForegroundColor Yellow
$sessionsTableCommand = @"
aws dynamodb create-table ``
    --region $Region ``
    --table-name zalo-user-sessions ``
    --attribute-definitions ``
        AttributeName=userId,AttributeType=S ``
        AttributeName=sessionId,AttributeType=S ``
    --key-schema ``
        AttributeName=userId,KeyType=HASH ``
        AttributeName=sessionId,KeyType=RANGE ``
    --billing-mode PAY_PER_REQUEST
"@

$result = Create-DynamoDBTable -Command $sessionsTableCommand
if ($result -eq 0) {
    Write-Host "✓ zalo-user-sessions table created successfully" -ForegroundColor Green
    
    # Enable TTL
    Start-Sleep -Seconds 2
    Write-Host "Enabling TTL on zalo-user-sessions..." -ForegroundColor Yellow
    $ttlCommand = "aws dynamodb update-time-to-live --region $Region --table-name zalo-user-sessions --time-to-live-specification 'Enabled=true,AttributeName=expires_at'"
    $ttlResult = Create-DynamoDBTable -Command $ttlCommand
    
    if ($ttlResult -eq 0) {
        Write-Host "✓ TTL enabled on zalo-user-sessions" -ForegroundColor Green
    }
} else {
    Write-Host "✗ Failed to create zalo-user-sessions table" -ForegroundColor Red
}
Write-Host ""

# 3. Create User Presence Table
Write-Host "Creating zalo-user-presence table..." -ForegroundColor Yellow
$presenceTableCommand = @"
aws dynamodb create-table ``
    --region $Region ``
    --table-name zalo-user-presence ``
    --attribute-definitions ``
        AttributeName=userId,AttributeType=S ``
    --key-schema ``
        AttributeName=userId,KeyType=HASH ``
    --billing-mode PAY_PER_REQUEST
"@

$result = Create-DynamoDBTable -Command $presenceTableCommand
if ($result -eq 0) {
    Write-Host "✓ zalo-user-presence table created successfully" -ForegroundColor Green
    
    # Enable TTL
    Start-Sleep -Seconds 2
    Write-Host "Enabling TTL on zalo-user-presence..." -ForegroundColor Yellow
    $ttlCommand = "aws dynamodb update-time-to-live --region $Region --table-name zalo-user-presence --time-to-live-specification 'Enabled=true,AttributeName=last_activity'"
    $ttlResult = Create-DynamoDBTable -Command $ttlCommand
    
    if ($ttlResult -eq 0) {
        Write-Host "✓ TTL enabled on zalo-user-presence" -ForegroundColor Green
    }
} else {
    Write-Host "✗ Failed to create zalo-user-presence table" -ForegroundColor Red
}
Write-Host ""

Write-Host "DynamoDB tables creation completed!" -ForegroundColor Cyan
Write-Host ""
Write-Host "To verify tables, run:"
if ($EndpointUrl) {
    Write-Host "  aws dynamodb list-tables --endpoint-url $EndpointUrl --region $Region" -ForegroundColor Gray
} else {
    Write-Host "  aws dynamodb list-tables --region $Region" -ForegroundColor Gray
}
