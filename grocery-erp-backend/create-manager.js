#!/usr/bin/env node

/**
 * Create Manager User Script
 * Creates a default manager user for the Grocery ERP system
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function createManager() {
  try {
    console.log('🚀 Creating manager user...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check if manager already exists
    const existingManager = await User.findOne({ email: 'aaryanshetye9@gmail.com' });
    if (existingManager) {
      console.log('ℹ️  User already exists:', existingManager.email);
      console.log('🔄 Updating role to manager...');
      existingManager.role = 'manager';
      existingManager.permissions = [
        'products:read',
        'products:write',
        'products:delete',
        'inventory:read',
        'inventory:write',
        'orders:read',
        'orders:write',
        'orders:cancel',
        'customers:read',
        'customers:write',
        'reports:read',
        'users:read',
        'settings:read',
        'settings:write'
      ];
      await existingManager.save();
      console.log('✅ User updated to manager role!');
      return;
    }
    
    // Create manager user
    const managerData = {
      name: 'Aaryan Shetye',
      email: 'aaryanshetye9@gmail.com',
      password: 'manager123', // Note: using 'manager123' without space
      role: 'manager',
      permissions: [
        'products:read',
        'products:write',
        'products:delete',
        'inventory:read',
        'inventory:write',
        'orders:read',
        'orders:write',
        'orders:cancel',
        'customers:read',
        'customers:write',
        'reports:read',
        'users:read',
        'settings:read',
        'settings:write'
      ],
      isActive: true,
      isEmailVerified: true
    };
    
    const manager = await User.create(managerData);
    console.log('✅ Manager user created successfully!');
    console.log('📧 Email:', manager.email);
    console.log('🔑 Password: manager123');
    console.log('👤 Role:', manager.role);
    
  } catch (error) {
    console.error('❌ Error creating manager:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

createManager();