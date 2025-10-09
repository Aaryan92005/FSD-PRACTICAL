#!/usr/bin/env node

// Script to test email configuration
require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
  try {
    console.log('🧪 Testing email configuration...');
    console.log('📧 Email User:', process.env.EMAIL_USER);
    console.log('🔑 Email Pass:', process.env.EMAIL_PASS ? 'Set' : 'Not Set');
    console.log('🌐 Email Host:', process.env.EMAIL_HOST);
    console.log('🔌 Email Port:', process.env.EMAIL_PORT);
    console.log('');

    if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'REPLACE_WITH_YOUR_APP_PASSWORD') {
      console.log('❌ Email password not configured!');
      console.log('');
      console.log('📋 To fix this:');
      console.log('1. Go to: https://myaccount.google.com/apppasswords');
      console.log('2. Generate an App Password for "Mail"');
      console.log('3. Replace "REPLACE_WITH_YOUR_APP_PASSWORD" in .env file');
      console.log('4. Use the 16-character app password (no spaces)');
      return;
    }

    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log('📤 Sending test email...');

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Grocery ERP - Email Test',
      text: 'This is a test email from your Grocery ERP system. Email configuration is working correctly!',
      html: `
        <h2>Grocery ERP - Email Test</h2>
        <p>This is a test email from your Grocery ERP system.</p>
        <p><strong>Email configuration is working correctly!</strong></p>
        <p>You can now use the "Forgot Password" feature.</p>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Check your inbox at:', process.env.EMAIL_USER);

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('');
    console.log('🔧 Common fixes:');
    console.log('1. Make sure 2-Step Verification is enabled on your Google account');
    console.log('2. Generate a new App Password (not your regular password)');
    console.log('3. Check that the App Password is correct (16 characters, no spaces)');
    console.log('4. Ensure "Less secure app access" is not blocking the connection');
  }
};

testEmail();





