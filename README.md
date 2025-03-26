## Getting Started

Install dependencies
```bash
    npm i -f
```

Copy environment from example
```bash
    cp .env.example .env
```

Run postgres locally 
```bash
    docker compose up -d db
```

Prepare db (can require sudo)
```bash
    prisma db push
```

Local development serving
```bash
    npm run dev
```

# API Documentation

This document outlines the available API endpoints for authentication and user interactions.

## Authentication

### Login

Authenticates a user and returns an access token.

- **URL**: `/api/auth/login`
- **Method**: `POST`

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

#### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Response

- **Code**: `401 Unauthorized`
- **Content**:

```json
{
  "message": "Invalid email!"
}
```

- **Code**: `401 Unauthorized`
- **Content**:

```json
{
  "message": "Invalid password!"
}
```

## Greeting

### Greet

- **URL**: `/api/greet`
- **Method**: `GET`
- **Authorization**: Bearer Token

#### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "message": "Hello, user!"
}
```

## Customers

### List All Customers

- **URL**: `/api/customers`
- **Method**: `GET`
- **Authorization**: Bearer Token

#### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "data": [
    {
      "id": "a9d42dc8-d0a9-411d-8634-e7f22273a2c4",
      "email": "customer@example.com",
      "name": "John Doe"
    }
  ]
}
```

### Create Customer

- **URL**: `/api/customers`
- **Method**: `POST`
- **Authorization**: Bearer Token

#### Request Body

```json
{
  "email": "newcustomer@example.com",
  "name": "Jane Smith"
}
```

#### Success Response

- **Code**: `201 Created`
- **Content**: Returns the created customer object

```json
{
  "id": "a9d42dc8-d0a9-411d-8634-e7f22273a2c4",
  "email": "newcustomer@example.com",
  "name": "Jane Smith"
}
```

#### Error Responses

- **Code**: `400 Bad Request`
- **Content**:

```json
{
  "message": "Invalid request body"
}
```

- **Code**: `409 Conflict`
- **Content**:

```json
{
  "message": "Customer with such email already exists"
}
```

- **Code**: `500 Internal Server Error`
- **Content**:

```json
{
  "message": "Unexpected error occurred!"
}
```

### Update Customer

- **URL**: `/api/customers`
- **Method**: `PATCH`
- **Authorization**: Bearer Token

#### Request Body

```json
{
  "id": "a9d42dc8-d0a9-411d-8634-e7f22273a2c4",
  "email": "updated@example.com",
  "name": "John Doe Updated"
}
```

#### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "id": "a9d42dc8-d0a9-411d-8634-e7f22273a2c4",
  "email": "updated@example.com",
  "name": "John Doe Updated"
}
```

#### Error Responses

- **Code**: `400 Bad Request`
- **Content**:

```json
{
  "message": "Invalid request body"
}
```

- **Code**: `404 Not Found`
- **Content**:

```json
{
  "message": "Customer with such ID not found"
}
```

- **Code**: `409 Conflict`
- **Content**:

```json
{
  "message": "Customer with such email already exists"
}
```

- **Code**: `500 Internal Server Error`
- **Content**:

```json
{
  "message": "Unexpected error occurred!"
}
```

## Notes

- All endpoints require authentication via Bearer token (except /api/auth/login)
- Validation is performed on all request bodies
- Email addresses must be unique across all customers
- All request messages have two langs based on header Accept-Language ("uk" and "en"), default is "en"
- Postman config located in project directory ("test-task.postman_collection.json")