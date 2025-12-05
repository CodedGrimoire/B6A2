#!/bin/bash

# API Base URL
BASE_URL="http://localhost:3000/api"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Generate unique emails using timestamp to avoid duplicate errors
TIMESTAMP=$(date +%s)
CUSTOMER_EMAIL="john.doe.${TIMESTAMP}@example.com"
ADMIN_EMAIL="admin.${TIMESTAMP}@example.com"

echo -e "${BLUE}=== Testing API Endpoints ===${NC}\n"
echo -e "${BLUE}Using unique emails: ${CUSTOMER_EMAIL} and ${ADMIN_EMAIL}${NC}\n"

# Check if server is running
echo -e "${YELLOW}--- CHECKING SERVER ---${NC}"
if ! curl -s -f http://localhost:3000/ > /dev/null 2>&1; then
  echo -e "${RED}ERROR: Server is not running on http://localhost:3000${NC}"
  echo -e "${YELLOW}Please start the server with: npm run dev${NC}"
  exit 1
fi
echo -e "${GREEN}Server is running!${NC}\n"

# ============================================
# 0. SETUP DATABASE TABLES (Optional - tables auto-create on server start)
# ============================================
echo -e "${YELLOW}--- SETUP DATABASE (Optional) ---${NC}"

echo -e "\n${GREEN}0. Setting up database tables (if needed):${NC}"
SETUP_RESPONSE=$(curl -s -X GET "http://localhost:3000/setup-db")
echo "$SETUP_RESPONSE"

# Wait a moment for tables to be created
sleep 1

# ============================================
# 1. AUTH ENDPOINTS
# ============================================
echo -e "${YELLOW}--- AUTH ENDPOINTS ---${NC}"

# Sign up as a customer
echo -e "\n${GREEN}1. Sign up as customer:${NC}"
CUSTOMER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"John Doe\",
    \"email\": \"${CUSTOMER_EMAIL}\",
    \"password\": \"password123\",
    \"phone\": \"1234567890\",
    \"role\": \"customer\"
  }")
echo "$CUSTOMER_RESPONSE" | jq '.' 2>/dev/null || echo "$CUSTOMER_RESPONSE"

# Sign up as an admin
echo -e "\n${GREEN}2. Sign up as admin:${NC}"
ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Admin User\",
    \"email\": \"${ADMIN_EMAIL}\",
    \"password\": \"admin123\",
    \"phone\": \"9876543210\",
    \"role\": \"admin\"
  }")
echo "$ADMIN_RESPONSE" | jq '.' 2>/dev/null || echo "$ADMIN_RESPONSE"

# Sign in as customer
echo -e "\n${GREEN}3. Sign in as customer:${NC}"
CUSTOMER_LOGIN=$(curl -s -X POST "$BASE_URL/auth/signin" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${CUSTOMER_EMAIL}\",
    \"password\": \"password123\"
  }")
echo "$CUSTOMER_LOGIN" | jq '.' 2>/dev/null || echo "$CUSTOMER_LOGIN"

# Extract customer token
CUSTOMER_TOKEN=$(echo "$CUSTOMER_LOGIN" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Check if token extraction failed
if [ -z "$CUSTOMER_TOKEN" ]; then
  echo -e "${RED}ERROR: Failed to extract customer token. Sign in may have failed.${NC}"
  echo -e "${YELLOW}Response: ${CUSTOMER_LOGIN}${NC}"
fi

# Sign in as admin
echo -e "\n${GREEN}4. Sign in as admin:${NC}"
ADMIN_LOGIN=$(curl -s -X POST "$BASE_URL/auth/signin" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${ADMIN_EMAIL}\",
    \"password\": \"admin123\"
  }")
echo "$ADMIN_LOGIN" | jq '.' 2>/dev/null || echo "$ADMIN_LOGIN"

# Extract admin token
ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Check if token extraction failed
if [ -z "$ADMIN_TOKEN" ]; then
  echo -e "${RED}ERROR: Failed to extract admin token. Sign in may have failed.${NC}"
  echo -e "${YELLOW}Response: ${ADMIN_LOGIN}${NC}"
fi

echo -e "\n${BLUE}Customer Token: ${CUSTOMER_TOKEN:0:50}...${NC}"
echo -e "${BLUE}Admin Token: ${ADMIN_TOKEN:0:50}...${NC}\n"

# Exit if tokens are missing
if [ -z "$CUSTOMER_TOKEN" ] || [ -z "$ADMIN_TOKEN" ]; then
  echo -e "${RED}FATAL: Cannot continue without authentication tokens.${NC}"
  exit 1
fi

# ============================================
# 2. VEHICLE ENDPOINTS (Public - No Auth)
# ============================================
echo -e "${YELLOW}--- VEHICLE ENDPOINTS (Public) ---${NC}"

# Get all vehicles (public)
echo -e "\n${GREEN}5. Get all vehicles (public):${NC}"
curl -s -X GET "$BASE_URL/vehicles" | jq '.' 2>/dev/null || curl -s -X GET "$BASE_URL/vehicles"

# Get vehicle by ID (public)
echo -e "\n${GREEN}6. Get vehicle by ID (public):${NC}"
curl -s -X GET "$BASE_URL/vehicles/1" | jq '.' 2>/dev/null || curl -s -X GET "$BASE_URL/vehicles/1"

# ============================================
# 3. VEHICLE ENDPOINTS (Admin Only)
# ============================================
echo -e "${YELLOW}--- VEHICLE ENDPOINTS (Admin Only) ---${NC}"

# Add a vehicle (admin only)
echo -e "\n${GREEN}7. Add vehicle (admin only):${NC}"
VEHICLE_RESPONSE=$(curl -s -X POST "$BASE_URL/vehicles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "vehicle_name": "Toyota Camry",
    "type": "car",
    "registration_number": "ABC123",
    "daily_rent_price": 50.00,
    "availability_status": "available"
  }')
echo "$VEHICLE_RESPONSE" | jq '.' 2>/dev/null || echo "$VEHICLE_RESPONSE"

# Extract vehicle ID (if available)
VEHICLE_ID=$(echo "$VEHICLE_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
if [ -z "$VEHICLE_ID" ]; then
  VEHICLE_ID=1
fi

# Add another vehicle
echo -e "\n${GREEN}8. Add another vehicle:${NC}"
curl -s -X POST "$BASE_URL/vehicles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "vehicle_name": "Honda Civic",
    "type": "car",
    "registration_number": "XYZ789",
    "daily_rent_price": 45.00,
    "availability_status": "available"
  }' | jq '.' 2>/dev/null || curl -s -X POST "$BASE_URL/vehicles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "vehicle_name": "Honda Civic",
    "type": "car",
    "registration_number": "XYZ789",
    "daily_rent_price": 45.00,
    "availability_status": "available"
  }'

# Update vehicle (admin only)
echo -e "\n${GREEN}9. Update vehicle (admin only):${NC}"
curl -s -X PUT "$BASE_URL/vehicles/$VEHICLE_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "vehicle_name": "Toyota Camry 2024",
    "daily_rent_price": 55.00,
    "availability_status": "booked"
  }' | jq '.' 2>/dev/null || curl -s -X PUT "$BASE_URL/vehicles/$VEHICLE_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "vehicle_name": "Toyota Camry 2024",
    "daily_rent_price": 55.00,
    "availability_status": "booked"
  }'

# Try to add vehicle as customer (should fail)
echo -e "\n${GREEN}10. Try to add vehicle as customer (should fail):${NC}"
curl -s -X POST "$BASE_URL/vehicles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -d '{
    "vehicle_name": "Test Car",
    "type": "car",
    "registration_number": "TEST123",
    "daily_rent_price": 30.00,
    "availability_status": "available"
  }' | jq '.' 2>/dev/null || curl -s -X POST "$BASE_URL/vehicles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -d '{
    "vehicle_name": "Test Car",
    "type": "car",
    "registration_number": "TEST123",
    "daily_rent_price": 30.00,
    "availability_status": "available"
  }'

# ============================================
# 4. USER ENDPOINTS (Admin Only)
# ============================================
echo -e "${YELLOW}--- USER ENDPOINTS (Admin Only) ---${NC}"

# Get all users (admin only)
echo -e "\n${GREEN}11. Get all users (admin only):${NC}"
curl -s -X GET "$BASE_URL/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.' 2>/dev/null || curl -s -X GET "$BASE_URL/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Get user by ID (admin only)
echo -e "\n${GREEN}12. Get user by ID (admin only):${NC}"
curl -s -X GET "$BASE_URL/users/1" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.' 2>/dev/null || curl -s -X GET "$BASE_URL/users/1" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Update user (admin only)
echo -e "\n${GREEN}13. Update user (admin only):${NC}"
curl -s -X PUT "$BASE_URL/users/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "John Updated",
    "phone": "1111111111",
    "role": "customer"
  }' | jq '.' 2>/dev/null || curl -s -X PUT "$BASE_URL/users/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "John Updated",
    "phone": "1111111111",
    "role": "customer"
  }'

# Try to get users as customer (should fail)
echo -e "\n${GREEN}14. Try to get users as customer (should fail):${NC}"
curl -s -X GET "$BASE_URL/users" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" | jq '.' 2>/dev/null || curl -s -X GET "$BASE_URL/users" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"

# ============================================
# 5. ERROR CASES
# ============================================
echo -e "${YELLOW}--- ERROR CASES ---${NC}"

# Sign in with wrong password
echo -e "\n${GREEN}15. Sign in with wrong password:${NC}"
curl -s -X POST "$BASE_URL/auth/signin" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${CUSTOMER_EMAIL}\",
    \"password\": \"wrongpassword\"
  }" | jq '.' 2>/dev/null || curl -s -X POST "$BASE_URL/auth/signin" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${CUSTOMER_EMAIL}\",
    \"password\": \"wrongpassword\"
  }"

# Get non-existent vehicle
echo -e "\n${GREEN}16. Get non-existent vehicle:${NC}"
curl -s -X GET "$BASE_URL/vehicles/999" | jq '.' 2>/dev/null || curl -s -X GET "$BASE_URL/vehicles/999"

# Request without token
echo -e "\n${GREEN}17. Request without token (should fail):${NC}"
curl -s -X GET "$BASE_URL/users" | jq '.' 2>/dev/null || curl -s -X GET "$BASE_URL/users"

echo -e "\n${BLUE}=== Testing Complete ===${NC}"

