/**
 * Database Configuration
 * Handles MongoDB connection with fallback options
 */

const mongoose = require('mongoose');

// MongoDB Atlas connection string (hardcoded for Render deployment)
const MONGODB_ATLAS_URI = 'mongodb+srv://aaryanshetye9:Aaryan92005@cluster1.kvcvjdf.mongodb.net/grocery-erp?retryWrites=true&w=majority';

/**
 * Get MongoDB connection string with fallback
 */
const getMongoUri = () => {
  // Try environment variable first
  let mongoUri = process.env.MONGODB_URI;
  
  console.log('🔍 Environment MONGODB_URI:', mongoUri ? 'Set' : 'Not set');
  
  // If environment variable is corrupted or invalid, use hardcoded fallback
  if (!mongoUri || !mongoUri.startsWith('mongodb')) {
    console.log('⚠️ Using fallback MongoDB URI');
    mongoUri = MONGODB_ATLAS_URI;
  }
  
  // Clean the URI - remove any extra whitespace or characters
  mongoUri = mongoUri.trim();
  
  // Validate the URI format
  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    console.error('❌ Invalid MongoDB URI format:', mongoUri);
    console.error('🔍 Connection string format should be: mongodb+srv://username:password@cluster.mongodb.net/database');
    throw new Error('Invalid MongoDB URI format');
  }
  
  console.log('✅ MongoDB URI format is valid');
  return mongoUri;
};

/**
 * Connect to MongoDB Atlas
 */
const connectDB = async () => {
  try {
    const mongoUri = getMongoUri();
    
    console.log('🔗 Connecting to MongoDB Atlas...');
    console.log('📍 URI format check: ✅');
    
    // Connection options optimized for Atlas
    const options = {
      serverSelectionTimeoutMS: 15000, // 15 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10, // Maximum 10 connections
      minPoolSize: 2 // Minimum 2 connections
    };

    const conn = await mongoose.connect(mongoUri, options);
    
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔌 Connection State: ${conn.connection.readyState}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
    // Test the connection with a ping
    await mongoose.connection.db.admin().ping();
    console.log('📡 Database ping successful');
    
    return conn;
    
  } catch (error) {
    console.error('❌ Error connecting to MongoDB Atlas:', error.message);
    
    // Provide specific error guidance
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication failed - check username/password');
    } else if (error.message.includes('network')) {
      console.error('🌐 Network error - check IP whitelist in MongoDB Atlas');
    } else if (error.message.includes('timeout')) {
      console.error('⏰ Connection timeout - check network connectivity');
    } else if (error.message.includes('Invalid scheme')) {
      console.error('🔗 Invalid connection string format');
      console.error('Expected: mongodb+srv://username:password@cluster.mongodb.net/database');
    }
    
    console.error('🔍 Troubleshooting steps:');
    console.error('1. Check MongoDB Atlas IP whitelist (add 0.0.0.0/0)');
    console.error('2. Verify username and password');
    console.error('3. Ensure cluster is running');
    
    process.exit(1);
  }
};

/**
 * Close database connection gracefully
 */
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error.message);
  }
};

module.exports = {
  connectDB,
  closeDB,
  getMongoUri
};