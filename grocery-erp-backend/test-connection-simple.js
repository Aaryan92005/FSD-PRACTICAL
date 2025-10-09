#!/usr/bin/env node

/**
 * Simple MongoDB Connection Test
 * Tests the exact connection string format
 */

require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB Connection...');
console.log('Environment:', process.env.NODE_ENV || 'development');

// Get the connection string
const mongoUri = process.env.MONGODB_URI;

console.log('📋 Connection String Check:');
console.log('- Length:', mongoUri ? mongoUri.length : 'undefined');
console.log('- Starts with mongodb+srv:', mongoUri ? mongoUri.startsWith('mongodb+srv://') : false);
console.log('- Contains @:', mongoUri ? mongoUri.includes('@') : false);

// Clean connection string (remove extra parameters that might cause issues)
const cleanUri = 'mongodb+srv://aaryanshetye9:Aaryan92005@cluster1.kvcvjdf.mongodb.net/grocery-erp?retryWrites=true&w=majority';

console.log('\n🧪 Testing with clean connection string...');

async function testConnection() {
  try {
    await mongoose.connect(cleanUri, {
      serverSelectionTimeoutMS: 10000
    });
    
    console.log('✅ Connection successful!');
    console.log('🏠 Host:', mongoose.connection.host);
    console.log('📊 Database:', mongoose.connection.name);
    
    // Test ping
    await mongoose.connection.db.admin().ping();
    console.log('📡 Ping successful!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('Invalid scheme')) {
      console.log('\n💡 Connection string format issue detected');
      console.log('Expected format: mongodb+srv://username:password@cluster.mongodb.net/database');
    }
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Authentication issue - check username/password');
    }
    
    if (error.message.includes('network')) {
      console.log('\n💡 Network issue - check IP whitelist in MongoDB Atlas');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
}

testConnection();