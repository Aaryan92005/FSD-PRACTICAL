# Grocery ERP Backend API

A comprehensive REST API for managing a grocery store's inventory, products, orders, and customers.

## Features

- **Product Management**: CRUD operations for products with SKU, barcode, and inventory tracking
- **Inventory Management**: Stock transactions, low stock alerts, and inventory reports
- **Order Management**: Sales orders, order status tracking, and payment processing
- **Customer Management**: Customer profiles and order history
- **User Authentication**: JWT-based authentication with role-based access control
- **Advanced Querying**: Filtering, sorting, pagination, and search functionality
- **Data Validation**: Input validation using express-validator
- **Security**: Rate limiting, CORS, XSS protection, and MongoDB injection prevention

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/grocery-erp
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   ```

4. Start MongoDB service

5. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user
- `PATCH /api/v1/auth/update-password` - Update password

### Products
- `GET /api/v1/products` - Get all products
- `POST /api/v1/products` - Create new product
- `GET /api/v1/products/:id` - Get product by ID
- `PATCH /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product
- `GET /api/v1/products/search?q=query` - Search products
- `GET /api/v1/products/sku/:sku` - Get product by SKU
- `GET /api/v1/products/barcode/:barcode` - Get product by barcode
- `GET /api/v1/products/low-stock` - Get low stock products
- `GET /api/v1/products/stats` - Get product statistics

### Inventory
- `GET /api/v1/inventory` - Get all inventory transactions
- `POST /api/v1/inventory` - Create inventory transaction
- `POST /api/v1/inventory/receive` - Receive stock
- `POST /api/v1/inventory/issue` - Issue stock
- `POST /api/v1/inventory/adjust` - Adjust stock
- `GET /api/v1/inventory/summary` - Get inventory summary
- `GET /api/v1/inventory/low-stock-alerts` - Get low stock alerts

### Orders
- `GET /api/v1/orders` - Get all orders
- `POST /api/v1/orders` - Create new order
- `GET /api/v1/orders/:id` - Get order by ID
- `PATCH /api/v1/orders/:id` - Update order
- `PATCH /api/v1/orders/:id/status` - Update order status
- `POST /api/v1/orders/quick-sale` - Create quick sale
- `GET /api/v1/orders/sales-summary` - Get sales summary

### Customers
- `GET /api/v1/customers` - Get all customers
- `POST /api/v1/customers` - Create new customer
- `GET /api/v1/customers/:id` - Get customer by ID
- `PATCH /api/v1/customers/:id` - Update customer
- `GET /api/v1/customers/search/:query` - Search customers

## Database Models

### Product
- SKU, name, description, category
- Price, cost price, stock, minimum stock
- Unit of measurement, barcode, location
- Supplier information, status, images
- Dietary information (organic, gluten-free, vegan)

### Inventory
- Product reference, transaction type
- Quantity, previous stock, new stock
- Unit price, total value, reference
- Supplier/customer information
- Batch number, expiry date, location

### Order
- Order number, customer information
- Items with quantity, price, discounts
- Payment method, status, delivery information
- Created by, processed by, cancellation details

### User
- Name, email, password, role
- Phone, address, avatar
- Permissions, active status
- Password reset and email verification tokens

## Query Features

The API supports advanced querying with the following features:

- **Filtering**: `?category=Fruits&price[gte]=100`
- **Sorting**: `?sort=price,-createdAt`
- **Pagination**: `?page=1&limit=10`
- **Field Selection**: `?fields=name,price,stock`
- **Search**: `?q=apple`

## Error Handling

The API uses a centralized error handling system with:
- Custom error classes
- Development vs production error responses
- MongoDB error handling
- JWT error handling
- Validation error handling

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Security headers with helmet
- MongoDB injection prevention
- XSS protection
- Input validation and sanitization

## Development

To run in development mode:
```bash
npm run dev
```

The server will start on `http://localhost:5000` with hot reloading enabled.

## Production

To run in production mode:
```bash
npm start
```

Make sure to set appropriate environment variables for production deployment.

## License

ISC












