#!/usr/bin/env node

/**
 * MongoDB Atlas Connection Test Script
 * Tests the connection to your MongoDB Atlas cluster
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testConnection() {
  log('🔍 Testing MongoDB Atlas Connection...', colors.blue);
  log('=====================================', colors.blue);
  
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    log('❌ MONGODB_URI environment variable is not set!', colors.red);
    log('Please check your .env file', colors.yellow);
    process.exit(1);
  }
  
  // Hide password in logs
  const safeUri = mongoUri.replace(/:([^:@]{1,}@)/, ':****@');
  log(`🔗 Connection URI: ${safeUri}`, colors.blue);
  
  try {
    // Connection options optimized for Atlas
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    };
    
    log('⏳ Connecting to MongoDB Atlas...', colors.yellow);
    const startTime = Date.now();
    
    await mongoose.connect(mongoUri, options);
    
    const connectionTime = Date.now() - startTime;
    log(`✅ Successfully connected to MongoDB Atlas!`, colors.green);
    log(`⚡ Connection time: ${connectionTime}ms`, colors.green);
    log(`🏠 Host: ${mongoose.connection.host}`, colors.green);
    log(`📊 Database: ${mongoose.connection.name}`, colors.green);
    log(`🔌 Ready State: ${mongoose.connection.readyState} (1 = connected)`, colors.green);
    
    // Test basic operations
    log('\n🧪 Testing basic database operations...', colors.blue);
    
    // Test ping
    const pingResult = await mongoose.connection.db.admin().ping();
    log(`📡 Ping result: ${JSON.stringify(pingResult)}`, colors.green);
    
    // Test database stats
    try {
      const stats = await mongoose.connection.db.stats();
      log(`📈 Database stats:`, colors.green);
      log(`   - Collections: ${stats.collections}`, colors.green);
      log(`   - Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`, colors.green);
      log(`   - Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`, colors.green);
    } catch (statsError) {
      log(`⚠️ Could not get database stats: ${statsError.message}`, colors.yellow);
    }
    
    // Test creating a simple collection and document
    log('\n🔬 Testing collection operations...', colors.blue);
    try {
      const testCollection = mongoose.connection.db.collection('connection_test');
      
      // Insert test document
      const testDoc = {
        test: true,
        timestamp: new Date(),
        message: 'Connection test successful'
      };
      
      const insertResult = await testCollection.insertOne(testDoc);
      log(`✅ Test document inserted with ID: ${insertResult.insertedId}`, colors.green);
      
      // Read test document
      const foundDoc = await testCollection.findOne({ _id: insertResult.insertedId });
      log(`✅ Test document retrieved: ${foundDoc.message}`, colors.green);
      
      // Clean up test document
      await testCollection.deleteOne({ _id: insertResult.insertedId });
      log(`🧹 Test document cleaned up`, colors.green);
      
    } catch (testError) {
      log(`⚠️ Collection test failed: ${testError.message}`, colors.yellow);
    }
    
    log('\n🎉 All tests passed! Your MongoDB Atlas connection is working perfectly!', colors.green);
    
  } catch (error) {
    log(`❌ Connection failed: ${error.message}`, colors.red);
    
    // Provide helpful error messages
    if (error.message.includes('authentication failed')) {
      log('\n💡 Troubleshooting tips:', colors.yellow);
      log('   - Check your username and password in the connection string', colors.yellow);
      log('   - Ensure the database user has proper permissions', colors.yellow);
    } else if (error.message.includes('network')) {
      log('\n💡 Troubleshooting tips:', colors.yellow);
      log('   - Check your internet connection', colors.yellow);
      log('   - Verify MongoDB Atlas cluster is running', colors.yellow);
      log('   - Check if your IP is whitelisted in Atlas', colors.yellow);
    } else if (error.message.includes('timeout')) {
      log('\n💡 Troubleshooting tips:', colors.yellow);
      log('   - Check your internet connection', colors.yellow);
      log('   - Verify the cluster endpoint is correct', colors.yellow);
      log('   - Try increasing the connection timeout', colors.yellow);
    }
    
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    log('\n🔌 Connection closed', colors.blue);
  }
}

// Handle command line help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
MongoDB Atlas Connection Test

Usage: node test-db-connection.js

This script tests the connection to your MongoDB Atlas cluster using
the MONGODB_URI environment variable from your .env file.

Environment Variables:
  MONGODB_URI    MongoDB Atlas connection string

Example:
  MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
  `);
  process.exit(0);
}

// Run the test
testConnection().catch((error) => {
  log(`💥 Unexpected error: ${error.message}`, colors.red);
  process.exit(1);
});