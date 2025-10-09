#!/usr/bin/env node

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function fixManagerUser() {
  try {
    console.log('🔧 Fixing manager user...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const email = 'aaryanshetye9@gmail.com';
    
    // First, let's see if the user exists
    let user = await User.findOne({ email });
    
    if (user) {
      console.log(`👤 User found: ${user.name}`);
      console.log(`🏷️  Current role: ${user.role}`);
      
      // Update the user to be a manager with correct password
      user.role = 'manager';
      user.password = 'manager123'; // This will be hashed by the pre-save middleware
      user.permissions = [
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
      user.isActive = true;
      user.isEmailVerified = true;
      
      await user.save();
      console.log('✅ User updated successfully!');
      
    } else {
      console.log('👤 User not found, creating new manager user...');
      
      user = await User.create({
        name: 'Aaryan Shetye',
        email: email,
        password: 'manager123',
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
      });
      
      console.log('✅ Manager user created successfully!');
    }
    
    console.log('📧 Email:', user.email);
    console.log('🔑 Password: manager123');
    console.log('👤 Role:', user.role);
    console.log('✅ Active:', user.isActive);
    
    // Test the password
    const isPasswordValid = await user.comparePassword('manager123');
    console.log('🔑 Password test:', isPasswordValid ? 'PASS' : 'FAIL');
    
    if (isPasswordValid && user.role === 'manager') {
      console.log('🎉 Login should work now!');
    } else {
      console.log('❌ There might still be an issue');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 11000) {
      console.error('💡 This might be a duplicate key error. The user might already exist with different data.');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

fixManagerUser();