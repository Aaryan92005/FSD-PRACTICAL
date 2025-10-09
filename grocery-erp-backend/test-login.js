#!/usr/bin/env node

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function testLogin() {
  try {
    console.log('🧪 Testing login functionality...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const email = 'aaryanshetye9@gmail.com';
    const password = 'manager123';
    
    console.log(`🔍 Looking for user: ${email}`);
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log(`👤 User found: ${user.name}`);
    console.log(`🏷️  Role: ${user.role}`);
    console.log(`✅ Active: ${user.isActive}`);
    
    if (user.role !== 'manager') {
      console.log('⚠️  User role is not "manager"');
    }
    
    const isPasswordValid = await user.comparePassword(password);
    console.log(`🔑 Password valid: ${isPasswordValid}`);
    
    if (user.role === 'manager' && isPasswordValid) {
      console.log('🎉 Login should work!');
      const token = user.generateAuthToken();
      console.log('🎫 Token generated successfully');
    } else {
      console.log('❌ Login will fail');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

testLogin();