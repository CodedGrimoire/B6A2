# API Testing with cURL Commands

Base URL: `http://localhost:3000/api`

## 0. Setup Database Tables (Run First!)

**IMPORTANT:** Before testing any endpoints, you must create the database tables:

```bash
curl -X GET http://localhost:3000/setup-db
```

This will create the `users`, `vehicles`, and `bookings` tables in your database.

---

## 1. Authentication Endpoints

### Sign up as Customer
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "phone": "1234567890",
    "role": "customer"
  }'
```

### Sign up as Admin
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "phone": "9876543210",
    "role": "admin"
  }'
```

### Sign in as Customer
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

### Sign in as Admin
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**Note:** Save the token from the signin response for authenticated requests.

---

## 2. Vehicle Endpoints (Public - No Auth Required)

### Get All Vehicles
```bash
curl -X GET http://localhost:3000/api/vehicles
```

### Get Vehicle by ID
```bash
curl -X GET http://localhost:3000/api/vehicles/1
```

---

## 3. Vehicle Endpoints (Admin Only)

### Add Vehicle
```bash
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "vehicle_name": "Toyota Camry",
    "type": "car",
    "registration_number": "ABC123",
    "daily_rent_price": 50.00,
    "availability_status": "available"
  }'
```

### Update Vehicle
```bash
curl -X PUT http://localhost:3000/api/vehicles/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "vehicle_name": "Toyota Camry 2024",
    "daily_rent_price": 55.00,
    "availability_status": "booked"
  }'
```

### Delete Vehicle
```bash
curl -X DELETE http://localhost:3000/api/vehicles/1 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 4. User Endpoints (Admin Only)

### Get All Users
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Get User by ID
```bash
curl -X GET http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Update User
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "John Updated",
    "phone": "1111111111",
    "role": "customer"
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 5. Setup Database Tables

### Initialize Database Tables
```bash
curl -X GET http://localhost:3000/setup-db
```

---

## Example Workflow

1. **Sign up as admin:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"name": "Admin", "email": "admin@test.com", "password": "admin123", "phone": "1234567890", "role": "admin"}'
   ```

2. **Sign in and get token:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/signin \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@test.com", "password": "admin123"}'
   ```
   Copy the token from the response.

3. **Add a vehicle (replace YOUR_ADMIN_TOKEN):**
   ```bash
   curl -X POST http://localhost:3000/api/vehicles \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -d '{"vehicle_name": "Honda Civic", "type": "car", "registration_number": "XYZ123", "daily_rent_price": 45.00, "availability_status": "available"}'
   ```

4. **View all vehicles (no auth needed):**
   ```bash
   curl -X GET http://localhost:3000/api/vehicles
   ```

