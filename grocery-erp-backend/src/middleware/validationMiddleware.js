const { body, query, validationResult } = require('express-validator');
const AppError = require('../utils/appError');

// Fix: Use default imports (no destructuring) for Mongoose models
const Product = require('../models/Product');
const User = require('../models/User');
const Inventory = require('../models/Inventory');
const Order = require('../models/Order');

// Middleware to check for validation errors (enhanced with structured errors)
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400, { errors: errors.array() }));
  }
  next();
};

// Product validation rules
exports.validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Product name must be between 1 and 100 characters'),
  
  body('category')
    .isIn(['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Grains', 'Beverages', 'Snacks', 'Household'])
    .withMessage('Please select a valid category'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  
  body('uom')
    .isIn(['kg', 'g', 'litre', 'ml', 'pack', 'piece', 'dozen', 'bundle'])
    .withMessage('Please select a valid unit of measurement'),
  
  body('barcode')
    .optional()
    .isLength({ min: 1, max: 64 })
    .withMessage('Barcode must be between 1 and 64 characters'),
  
  handleValidationErrors
];

// User validation rules (added permissions validation)
exports.validateUser = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Name must be between 1 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .custom((value) => {
      const allowedDomains = ['gmail.com', 'yahoo.com'];
      const domain = value.split('@')[1];
      if (!allowedDomains.includes(domain)) {
        throw new Error('Email must be from @gmail.com or @yahoo.com domain');
      }
      return true;
    })
    .withMessage('Please provide a valid email address from @gmail.com or @yahoo.com'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'cashier', 'stockist'])
    .withMessage('Please select a valid role'),
  
  body('permissions')
    .optional()
    .isArray()
    .custom((value) => {
      const validPermissions = ['products:read', 'products:write', 'products:delete', 'inventory:read', 'inventory:write', 'orders:read', 'orders:write', 'orders:cancel', 'customers:read', 'customers:write', 'reports:read', 'users:read', 'users:write', 'settings:read', 'settings:write'];
      return value.every(p => validPermissions.includes(p));
    })
    .withMessage('Invalid permissions provided'),
  
  handleValidationErrors
];

// Login validation rules
exports.validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .custom((value) => {
      const allowedDomains = ['gmail.com', 'yahoo.com'];
      const domain = value.split('@')[1];
      if (!allowedDomains.includes(domain)) {
        throw new Error('Email must be from @gmail.com or @yahoo.com domain');
      }
      return true;
    })
    .withMessage('Please provide a valid email address from @gmail.com or @yahoo.com'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Order validation rules (added isMongoId for items.*.product)
exports.validateOrder = [
  body('customer.name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Customer name must be between 1 and 100 characters'),
  
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  
  body('items.*.product')
    .isMongoId()
    .withMessage('Item product must be a valid MongoDB ID'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Item quantity must be at least 1'),
  
  body('paymentMethod')
    .isIn(['cash', 'card', 'upi', 'bank_transfer', 'wallet'])
    .withMessage('Please select a valid payment method'),
  
  handleValidationErrors
];

// Inventory transaction validation rules (reused enum)
exports.validateInventoryTransaction = [
  body('product')
    .isMongoId()
    .withMessage('Please provide a valid product ID'),
  
  body('transactionType')
    .isIn(['receive', 'issue', 'adjust', 'return', 'damage', 'expiry'])
    .withMessage('Please select a valid transaction type'),
  
  body('quantity')
    .isFloat({ min: 0 })
    .withMessage('Quantity must be a non-negative number'),
  
  body('reason')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Reason cannot exceed 200 characters'),
  
  handleValidationErrors
];

// Search validation rules (using query instead of body)
exports.validateSearch = [
  query('q')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search query is required'),
  
  handleValidationErrors
];
