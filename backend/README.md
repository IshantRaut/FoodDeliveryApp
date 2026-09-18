# Backend API Documentation

This document lists the available APIs for the Food-App backend.

Base URL:
- Local development: http://localhost:8080

Authentication:
- User auth uses a cookie named `token`
- Seller auth uses a cookie named `sellerToken`
- All authenticated requests require the appropriate cookie to be sent by the browser

General response format:

```json
{
  "success": true,
  "message": "Description",
  "data": {}
}
```

For error responses:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## 1. User APIs

Base path: `/api/user`

### 1. Register User
- Method: `POST`
- Endpoint: `/api/user/register`
- Description: Register a new customer account
- Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

- Success response:

```json
{
  "success": true,
  "user": {
    "_id": "mongo_object_id",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### 2. Login User
- Method: `POST`
- Endpoint: `/api/user/login`
- Description: Login a registered user
- Body:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

- Success response:

```json
{
  "success": true,
  "user": {
    "_id": "mongo_object_id",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### 3. Check User Auth
- Method: `GET`
- Endpoint: `/api/user/is-auth`
- Description: Checks if the current logged-in user is authenticated
- Requires: user cookie (`token`)
- Success response:

```json
{
  "success": true,
  "user": {
    "_id": "mongo_object_id",
    "name": "John Doe",
    "email": "john@example.com",
    "cartItems": {}
  }
}
```

### 4. Logout User
- Method: `GET`
- Endpoint: `/api/user/logout`
- Description: Clears the user auth cookie
- Requires: user cookie (`token`)
- Success response:

```json
{
  "success": true,
  "message": "Logged Out"
}
```

---

## 2. Seller APIs

Base path: `/api/seller`

### 1. Seller Login
- Method: `POST`
- Endpoint: `/api/seller/login`
- Description: Login seller using admin credentials from environment variables
- Body:

```json
{
  "email": "test@gmail.com",
  "password": "1234567"
}
```

- Success response:

```json
{
  "success": true,
  "message": "Logged in"
}
```

### 2. Check Seller Auth
- Method: `GET`
- Endpoint: `/api/seller/is-auth`
- Description: Validates seller session
- Requires: seller cookie (`sellerToken`)
- Success response:

```json
{
  "success": true
}
```

### 3. Seller Logout
- Method: `GET`
- Endpoint: `/api/seller/logout`
- Description: Clears the seller auth cookie
- Requires: seller cookie (`sellerToken`)
- Success response:

```json
{
  "success": true,
  "message": "Logged Out"
}
```

---

## 3. Product APIs

Base path: `/api/product`

### 1. Add Product
- Method: `POST`
- Endpoint: `/api/product/add`
- Description: Adds a new product to the catalog
- Requires: seller auth
- Content-type: `multipart/form-data`
- Form fields:
  - `images`: product image files
  - `productData`: JSON string containing product data

Example `productData`:

```json
{
  "name": "Organic Banana",
  "category": "Fruits",
  "description": "Fresh banana bunch",
  "weight": "1 kg",
  "price": 80,
  "offerprice": 70,
  "inStock": true
}
```

- Success response:

```json
{
  "success": true,
  "message": "Product added"
}
```

### 2. Get All Products
- Method: `GET`
- Endpoint: `/api/product/list`
- Description: Fetches all products
- Success response:

```json
{
  "success": true,
  "products": [
    {
      "_id": "mongo_object_id",
      "name": "Organic Banana",
      "category": "Fruits",
      "offerPrice": 70,
      "image": ["url1", "url2"]
    }
  ]
}
```

### 3. Get Product By ID
- Method: `GET`
- Endpoint: `/api/product/id`
- Description: Fetches one product by its ID
- Body:

```json
{
  "id": "mongo_object_id"
}
```

- Success response:

```json
{
  "success": true,
  "product": {
    "_id": "mongo_object_id",
    "name": "Organic Banana"
  }
}
```

### 4. Update Product Stock
- Method: `POST`
- Endpoint: `/api/product/stock`
- Description: Updates product availability
- Requires: seller auth
- Body:

```json
{
  "id": "mongo_object_id",
  "inStock": true
}
```

- Success response:

```json
{
  "success": true,
  "message": "Stock Updated"
}
```

---

## 4. Address APIs

Base path: `/api/address`

### 1. Add Address
- Method: `POST`
- Endpoint: `/api/address/add`
- Description: Saves a shipping address for logged-in user
- Requires: user auth
- Body:

```json
{
  "address": {
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "street": "Main Road",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipcode": 400001,
    "country": "India",
    "phone": 9876543210
  }
}
```

- Success response:

```json
{
  "success": true,
  "message": "Address added successfully"
}
```

### 2. Get User Addresses
- Method: `GET`
- Endpoint: `/api/address/get`
- Description: Returns all addresses for the logged-in user
- Requires: user auth
- Success response:

```json
{
  "success": true,
  "addresses": [
    {
      "_id": "mongo_object_id",
      "userId": "mongo_object_id",
      "firstName": "John",
      "lastName": "Doe",
      "street": "Main Road",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipcode": 400001,
      "country": "India",
      "phone": 9876543210
    }
  ]
}
```

---

## 5. Cart APIs

Base path: `/api/cart`

### 1. Update Cart
- Method: `POST`
- Endpoint: `/api/cart/update`
- Description: Saves the current cart for the logged-in user
- Requires: user auth
- Body:

```json
{
  "cartItems": {
    "productId1": 2,
    "productId2": 1
  }
}
```

- Success response:

```json
{
  "success": true,
  "message": "Cart updated"
}
```

---

## 6. Order APIs

Base path: `/api/order`

### 1. Place COD Order
- Method: `POST`
- Endpoint: `/api/order/cod`
- Description: Creates a cash-on-delivery order
- Requires: user auth
- Body:

```json
{
  "items": [
    {
      "product": "mongo_object_id",
      "quantity": 2
    }
  ],
  "address": "mongo_object_id"
}
```

- Success response:

```json
{
  "success": true,
  "message": "Order Placed successfully"
}
```

### 2. Create Razorpay Order
- Method: `POST`
- Endpoint: `/api/order/razor`
- Description: Creates an online payment order with Razorpay
- Requires: user auth
- Body:

```json
{
  "items": [
    {
      "product": "mongo_object_id",
      "quantity": 1
    }
  ],
  "address": "mongo_object_id"
}
```

- Success response:

```json
{
  "success": true,
  "message": "Razorpay order created",
  "orderId": "order_mongo_id",
  "razorpayOrderId": "razorpay_order_id",
  "amount": 25000,
  "currency": "INR",
  "key": "razorpay_key_id"
}
```

### 3. Get My Orders
- Method: `GET`
- Endpoint: `/api/order/user`
- Description: Fetches current user’s orders
- Requires: user auth
- Success response:

```json
{
  "success": true,
  "orders": [
    {
      "_id": "mongo_object_id",
      "userId": "mongo_object_id",
      "items": [
        {
          "product": {
            "_id": "mongo_object_id",
            "name": "Organic Banana"
          },
          "quantity": 2
        }
      ],
      "amount": 140,
      "status": "Order placed",
      "paymentType": "COD",
      "isPaid": false
    }
  ]
}
```

### 4. Get All Orders (Seller)
- Method: `GET`
- Endpoint: `/api/order/seller`
- Description: Returns all orders for the seller dashboard
- Requires: seller auth
- Success response:

```json
{
  "success": true,
  "orders": [
    {
      "_id": "mongo_object_id",
      "amount": 140,
      "paymentType": "COD",
      "isPaid": false,
      "status": "Order placed",
      "items": [],
      "address": {}
    }
  ]
}
```

---

## Notes

- Most APIs return JSON using `success: true/false`.
- User and seller authentication rely on browser cookies.
- For products with images, use `FormData` and upload with `multipart/form-data`.
- The backend is using MongoDB models with Mongoose.

---

## Common environment variables

The backend expects these variables in `.env`:

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/food-delivery
JWT_SECRET=your_secret_key
NODE_ENV=development
SELLER_EMAIL=test@gmail.com
SELLER_PASSWORD=1234567
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
