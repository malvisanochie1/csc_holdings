# Frontend API Documentation

## Base URL
```
{BASE_URL}/api
```

## Authentication
All authenticated endpoints require Bearer token in Authorization header:
```
Authorization: Bearer {token}
```

---

## Auth Endpoints

### 1. User Registration
**POST** `/auth/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "1234567890",
  "country": "United States",
  "country_code": "1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {UserResource},
    "token": "bearer_token_here"
  }
}
```

### 2. User Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {UserResource},
    "token": "bearer_token_here"
  }
}
```

### 3. Auto Login (Token-based)
**POST** `/auth/auto-login`

**Request Body:**
```json
{
  "token": "auto_login_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Auto login successful",
  "data": {
    "user": {UserResource},
    "token": "new_bearer_token_here"
  }
}
```

### 4. Get Current User
**GET** `/user`
*Requires Authentication*

**Response:**
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {UserResource}
}
```

### 5. Update Profile
**PUT** `/user/profile`
*Requires Authentication*

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "country": "US",
  "address": "123 Main St",
  "avatar": "base64_image_or_file"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {UserResource}
}
```

### 6. Logout
**POST** `/auth/logout`
*Requires Authentication*

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Settings Endpoints

### 1. Get App Settings
**GET** `/settings`

**Response:**
```json
{
  "success": true,
  "message": "site data retrieved",
  "data": {
    "status": "active",
    "name": "Site Name",
    "has_ecn": true,
    "must_verify_account": false,
    "contactEmail": "support@example.com",
    "website_url": "https://example.com",
    "favicon": "favicon_url",
    "logo": "logo_url",
    "wallets": [
      {
        "id": 1,
        "name": "Bitcoin",
        "symbol": "₿",
        "image": "wallet_image_url",
        "is_fiat": false,
        "conversion_rate": {
          "min": 0,
          "max": 0
        },
        "active": true,
        "crypto_network": "Bitcoin",
        "address": "wallet_address",
        "status": "active"
      }
    ]
  }
}
```

### 2. Get Site Data (Deprecated - Use Settings)
**GET** `/data`

**Response:**
```json
{
  "success": true,
  "message": "site data retrieved",
  "data": {
    "currencies": [{Currency}],
    "wallets": [{Wallet}],
    "plans": [{Plan}],
    "withdrawal_methods": [{Method}],
    "wire_transfer": {WireInfo}
  }
}
```

---

## UserResource Structure

The UserResource contains comprehensive user information including wallets:

```json
{
  "id": "uuid",
  "account_id": "ACC123",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "country": "US",
  "balance": "1,000.00",
  "savings_balance": "500.00",
  "credit_balance": 100.0,
  "verification_status": "verified",
  "accounts": [
    {
      "type": "balance",
      "title": "Account Balance",
      "balance": "1,000.00",
      "currency": "USD"
    }
  ],
  "currencies": [
    {
      "id": 1,
      "user_wallet_id": 5,
      "name": "Bitcoin",
      "symbol": "₿",
      "image": "wallet_image_url",
      "balance": "1.50000000",
      "balance_val": "1.50000000",
      "is_fiat": false,
      "conversion_rate": {
        "min": 2,
        "max": 5
      },
      "status": "active"
    }
  ],
  "wallets": [
    {
      "id": 1,
      "user_wallet_id": 5,
      "name": "Bitcoin",
      "symbol": "₿",
      "image": "wallet_image_url",
      "balance": 1.50000000,
      "formatted_balance": "1.50000000",
      "is_fiat": false,
      "conversion_fee": {
        "min_percent": 2,
        "max_percent": 5
      },
      "active": true
    }
  ]
}
```

---

## Financial Endpoints

### 1. Get Deposits
**GET** `/deposits`
*Requires Authentication*

**Response:**
```json
{
  "success": true,
  "message": "deposit data",
  "data": {
    "data": [
      {
        "id": 1,
        "amount": "$100.00",
        "date": "2023-01-01",
        "type": "deposit",
        "account": "Account Wallet",
        "status": "completed",
        "details": "{\"method\":\"crypto\"}"
      }
    ]
  }
}
```

### 2. Submit Deposit
**POST** `/deposit`
*Requires Authentication*

**Request Body:**
```json
{
  "method": "crypto",
  "wallet_id": 1,
  "amount": 100.00,
  "transaction_id": "tx123"
}
```

### 3. Get Withdrawals
**GET** `/withdrawals`
*Requires Authentication*

### 4. Submit Withdrawal
**POST** `/withdraw`
*Requires Authentication*

**Request Body:**
```json
{
  "amount": 100.00,
  "method": "crypto",
  "network": "Bitcoin",
  "wallet_address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
}
```

---

## Important Notes for Frontend Team

### 1. Auto Login Implementation
- Create an auto-login endpoint that accepts a token
- This should validate the token and return user data with new bearer token
- Use for seamless user experience after registration or password reset

### 2. Wallet/Currency Usage
- Use `currencies` array for display purposes (formatted balances)
- Use `wallets` array for transaction calculations (raw values)
- Each user wallet has conversion fee ranges (min/max percentages)

### 3. Error Handling
All endpoints return consistent error format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": ["validation error"]
  }
}
```

### 4. Authentication Flow
1. User registers/logs in → Receive bearer token
2. Store token securely
3. Include token in all authenticated requests
4. Handle token expiration (401 responses)
5. Auto-refresh or redirect to login

### 5. Settings Caching
- Cache settings response to reduce API calls
- Refresh periodically or on app startup
- Contains all wallet information with rates

### 6. Balance Display
- Always use formatted values from API for display
- Handle different decimal places for crypto vs fiat
- Show conversion rates when applicable