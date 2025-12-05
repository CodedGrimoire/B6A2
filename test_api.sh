#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# A script to test the API endpoints for the vehicle rental application.
# Make sure the server is running before executing this script.
#
# To run:
# 1. Save this file as `test_api.sh` in your project root.
# 2. Make it executable: `chmod +x test_api.sh`
# 3. Run it: `./test_api.sh`

BASE_URL="http://localhost:3000"

echo "--- API Test Script ---"
echo ""

# Function to print a formatted header
print_header() {
    echo ""
    echo "----------------------------------------------------"
    echo "=> $1"
    echo "----------------------------------------------------"
    echo ""
}

# 1. Setup Database
print_header "Setting up the database tables..."
curl -X GET "$BASE_URL/setup-db"
echo ""

# 2. User Signup
print_header "Creating an Admin and a Customer user..."

echo "Creating Admin User (admin@example.com)..."
curl -X POST "$BASE_URL/api/auth/signup" \
     -H "Content-Type: application/json" \
     -d '{
           "name": "Admin User",
           "email": "admin@example.com",
           "password": "password123",
           "phone": "111222333",
           "role": "admin"
         }'
echo ""

echo "Creating Customer User (customer@example.com)..."
curl -X POST "$BASE_URL/api/auth/signup" \
     -H "Content-Type: application/json" \
     -d '{
           "name": "Customer User",
           "email": "customer@example.com",
           "password": "password123",
           "phone": "444555666",
           "role": "customer"
         }'
echo ""

# 3. User Signin
print_header "Signing in to get JWT tokens..."

echo "Signing in as Admin..."
ADMIN_TOKEN=$(curl -s -X POST "$BASE_URL/api/auth/signin" \
                   -H "Content-Type: application/json" \
                   -d '{"email": "admin@example.com", "password": "password123"}' | jq -r '.token // empty')

if [ -z "$ADMIN_TOKEN" ]; then
    echo "Error: Failed to get Admin token. Exiting."
    exit 1
fi
echo "Admin Token: $ADMIN_TOKEN"
echo ""

echo "Signing in as Customer..."
CUSTOMER_TOKEN=$(curl -s -X POST "$BASE_URL/api/v1/auth/signin" \
                      -H "Content-Type: application/json" \
                      -d '{"email": "customer@example.com", "password": "password123"}' | jq -r .token)
echo "Customer Token: $CUSTOMER_TOKEN"
echo ""

# 4. Vehicle Management (Admin Only)
print_header "Testing Vehicle Management (Admin)..."

echo "Admin creating a new vehicle..."
VEHICLE_ID=$(curl -s -X POST "$BASE_URL/api/v1/vehicles" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $ADMIN_TOKEN" \
     -d '{
           "vehicle_name": "Toyota Camry",
           "type": "car",
           "registration_number": "NYC-1234",
           "daily_rent_price": 75.50
           "availability_status": "available"
         }' | jq -r .id)
echo "Created Vehicle with ID: $VEHICLE_ID"
echo ""

echo "Admin updating the vehicle..."
curl -X PUT "$BASE_URL/api/vehicles/$VEHICLE_ID" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $ADMIN_TOKEN" \
     -d '{"daily_rent_price": 80.00}'
echo ""

# 5. Public Vehicle Routes
print_header "Testing Public Vehicle Routes..."

echo "Getting all vehicles (no token needed)..."
curl -X GET "$BASE_URL/api/v1/vehicles"
echo ""

echo "Getting a single vehicle by ID (no token needed)..."
curl -X GET "$BASE_URL/api/v1/vehicles/$VEHICLE_ID"
echo ""

# 6. User Management (Admin Only)
print_header "Testing User Management (Admin)..."

echo "Admin getting all users..."
curl -X GET "$BASE_URL/api/users" -H "Authorization: Bearer $ADMIN_TOKEN"
echo ""

# 7. Cleanup
print_header "Cleaning up created vehicle..."
echo "Admin deleting the vehicle..."
curl -X DELETE "$BASE_URL/api/v1/vehicles/$VEHICLE_ID" \
     -H "Authorization: Bearer $ADMIN_TOKEN"
echo ""

echo "--- Test Complete ---"