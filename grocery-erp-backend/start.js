#!/usr/bin/env node

// Simple server starter with environment setup
require('dotenv').config();

// Set default environment variables if not provided
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery-erp';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
process.env.PORT = process.env.PORT || '5000';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

console.log('🚀 Starting Grocery ERP Backend...');
console.log('📊 Environment:', process.env.NODE_ENV);
console.log('🔗 MongoDB:', process.env.MONGODB_URI);
console.log('🌐 Port:', process.env.PORT);
console.log('');

// Start the server
require('./server.js');






