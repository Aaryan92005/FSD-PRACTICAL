#!/usr/bin/env node

/**
 * Database Initialization Script
 * Sets up initial collections and indexes for the Grocery ERP system
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function initializeDatabase() {
  log('🚀 Initializing Grocery ERP Database...', colors.blue);
  log('=====================================', colors.blue);
  
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI);
    log('✅ Connected to MongoDB Atlas', colors.green);
    
    const db = mongoose.connection.db;
    
    // Define collections to create
    const collections = [
      {
        name: 'products',
        indexes: [
          { key: { name: 1 }, unique: true },
          { key: { category: 1 } },
          { key: { barcode: 1 }, unique: true, sparse: true }
        ]
      },
      {
        name: 'inventory',
        indexes: [
          { key: { productId: 1 }, unique: true },
          { key: { quantity: 1 } },
          { key: { lastUpdated: -1 } }
        ]
      },
      {
        name: 'orders',
        indexes: [
          { key: { orderNumber: 1 }, unique: true },
          { key: { customerId: 1 } },
          { key: { status: 1 } },
          { key: { createdAt: -1 } }
        ]
      },
      {
        name: 'customers',
        indexes: [
          { key: { email: 1 }, unique: true, sparse: true },
          { key: { phone: 1 }, unique: true, sparse: true },
          { key: { name: 1 } }
        ]
      },
      {
        name: 'users',
        indexes: [
          { key: { email: 1 }, unique: true },
          { key: { username: 1 }, unique: true },
          { key: { role: 1 } }
        ]
      }
    ];
    
    // Create collections and indexes
    for (const collection of collections) {
      log(`📁 Setting up collection: ${collection.name}`, colors.blue);
      
      try {
        // Create collection if it doesn't exist
        const collectionExists = await db.listCollections({ name: collection.name }).hasNext();
        
        if (!collectionExists) {
          await db.createCollection(collection.name);
          log(`   ✅ Collection '${collection.name}' created`, colors.green);
        } else {
          log(`   ℹ️  Collection '${collection.name}' already exists`, colors.yellow);
        }
        
        // Create indexes
        const coll = db.collection(collection.name);
        for (const index of collection.indexes) {
          try {
            await coll.createIndex(index.key, {
              unique: index.unique || false,
              sparse: index.sparse || false
            });
            log(`   📊 Index created: ${JSON.stringify(index.key)}`, colors.green);
          } catch (indexError) {
            if (indexError.code === 85) { // Index already exists
              log(`   ℹ️  Index already exists: ${JSON.stringify(index.key)}`, colors.yellow);
            } else {
              log(`   ⚠️  Index creation failed: ${indexError.message}`, colors.yellow);
            }
          }
        }
        
      } catch (collectionError) {
        log(`   ❌ Error setting up collection '${collection.name}': ${collectionError.message}`, colors.red);
      }
    }
    
    // Insert sample data if collections are empty
    log('\n🌱 Checking for sample data...', colors.blue);
    
    const productsCount = await db.collection('products').countDocuments();
    if (productsCount === 0) {
      log('📦 Inserting sample products...', colors.blue);
      
      const sampleProducts = [
        {
          name: 'Organic Bananas',
          category: 'Fruits',
          price: 2.99,
          unit: 'lb',
          description: 'Fresh organic bananas',
          barcode: '1234567890123',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Whole Milk',
          category: 'Dairy',
          price: 3.49,
          unit: 'gallon',
          description: 'Fresh whole milk',
          barcode: '2345678901234',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Bread - Whole Wheat',
          category: 'Bakery',
          price: 2.79,
          unit: 'loaf',
          description: 'Fresh whole wheat bread',
          barcode: '3456789012345',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await db.collection('products').insertMany(sampleProducts);
      log(`   ✅ Inserted ${sampleProducts.length} sample products`, colors.green);
      
      // Create corresponding inventory entries
      const inventoryEntries = sampleProducts.map((product, index) => ({
        productId: product._id,
        quantity: 100 + (index * 50),
        minQuantity: 10,
        maxQuantity: 500,
        lastUpdated: new Date(),
        location: 'Main Warehouse'
      }));
      
      await db.collection('inventory').insertMany(inventoryEntries);
      log(`   ✅ Inserted ${inventoryEntries.length} inventory entries`, colors.green);
    } else {
      log(`   ℹ️  Found ${productsCount} existing products, skipping sample data`, colors.yellow);
    }
    
    // Create default admin user if no users exist
    const usersCount = await db.collection('users').countDocuments();
    if (usersCount === 0) {
      log('👤 Creating default admin user...', colors.blue);
      
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const adminUser = {
        username: 'admin',
        email: 'admin@grocery-erp.com',
        password: hashedPassword,
        role: 'admin',
        firstName: 'System',
        lastName: 'Administrator',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('users').insertOne(adminUser);
      log('   ✅ Default admin user created', colors.green);
      log('   📧 Email: admin@grocery-erp.com', colors.green);
      log('   🔑 Password: admin123', colors.green);
      log('   ⚠️  Please change the default password after first login!', colors.yellow);
    } else {
      log(`   ℹ️  Found ${usersCount} existing users, skipping admin creation`, colors.yellow);
    }
    
    log('\n🎉 Database initialization completed successfully!', colors.green);
    log('📊 Database Summary:', colors.blue);
    
    // Show collection stats
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      log(`   - ${collection.name}: ${count} documents`, colors.green);
    }
    
  } catch (error) {
    log(`❌ Database initialization failed: ${error.message}`, colors.red);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    log('\n🔌 Database connection closed', colors.blue);
  }
}

// Handle command line help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Grocery ERP Database Initialization

Usage: node init-database.js

This script initializes the database with:
- Required collections and indexes
- Sample product data
- Default admin user

Environment Variables:
  MONGODB_URI    MongoDB Atlas connection string

Default Admin Credentials:
  Email: admin@grocery-erp.com
  Password: admin123
  `);
  process.exit(0);
}

// Run initialization
initializeDatabase().catch((error) => {
  log(`💥 Unexpected error: ${error.message}`, colors.red);
  process.exit(1);
});