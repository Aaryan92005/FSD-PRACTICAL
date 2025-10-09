#!/usr/bin/env node

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function checkUsers() {
  try {
    console.log('🔍 Checking existing users...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const users = await User.find({}).select('name email role isActive');
    
    if (users.length === 0) {
      console.log('ℹ️  No users found in database');
    } else {
      console.log(`📊 Found ${users.length} users:`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - Active: ${user.isActive}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

checkUsers();