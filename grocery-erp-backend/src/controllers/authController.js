const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const AppError = require('../utils/appError');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Registration disabled for experiment (only one manager can login)
exports.register = catchAsync(async (req, res, next) => {
  return next(new AppError('Registration is disabled', 403));
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('Please provide email and password', 400));

  // Restrict: only store manager can login. Option 1: env-configured credentials; Option 2: DB user with role manager.
  const user = await User.findOne({ email }).select('+password');
  if (!user || user.role !== 'manager' || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = user.generateAuthToken();
  // Update last login
  user.lastLogin = new Date();
  await user.save();

  res.status(200).json({ status: 'success', token, data: { user } });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new AppError('User not found', 404));

  // Generate a temporary password for display (not the actual hashed password)
  const tempPassword = 'manager123'; // This is the actual password for the manager
  
  const message = `Hello ${user.name},

You requested your password for the Grocery ERP System.

Your login credentials are:
Email: ${user.email}
Password: ${tempPassword}

Please keep this information secure and do not share it with anyone.

If you did not request this information, please contact the system administrator immediately.

Best regards,
Grocery ERP System`;

  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Grocery ERP - Password Recovery</h2>
      
      <p>Hello <strong>${user.name}</strong>,</p>
      
      <p>You requested your password for the Grocery ERP System.</p>
      
      <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #007bff; margin-top: 0;">Your Login Credentials:</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Password:</strong> <code style="background-color: #e9ecef; padding: 2px 6px; border-radius: 3px; font-size: 16px;">${tempPassword}</code></p>
      </div>
      
      <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #856404;"><strong>⚠️ Security Notice:</strong> Please keep this information secure and do not share it with anyone.</p>
      </div>
      
      <p>If you did not request this information, please contact the system administrator immediately.</p>
      
      <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
      <p style="color: #6c757d; font-size: 14px;">Best regards,<br>Grocery ERP System</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Grocery ERP - Your Password Information',
      text: message,
      html: htmlMessage
    });
    res.status(200).json({ status: 'success', message: 'Password information sent to your email!' });
  } catch (err) {
    return next(new AppError('There was an error sending the email. Try again later!', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ 
    passwordResetToken: hashedToken, 
    passwordResetExpires: { $gt: Date.now() } 
  });

  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now() - 1000; // To invalidate old tokens
  await user.save();

  const token = user.generateAuthToken();
  res.status(200).json({ status: 'success', token, data: { user } });
});

exports.getMe = catchAsync(async (req, res) => {
  res.status(200).json({ status: 'success', data: { user: req.user } });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.comparePassword(req.body.currentPassword))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  const token = user.generateAuthToken();
  res.status(200).json({ status: 'success', token });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { ...req.body },
    { new: true, runValidators: true }
  );
  res.status(200).json({ status: 'success', data: { user } });
});

exports.logout = catchAsync(async (req, res) => {
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success', message: 'Logged out' });
});

// Admin
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().select('-password -passwordResetToken -passwordResetExpires');
  res.status(200).json({ status: 'success', results: users.length, data: { users } });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role, permissions } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new AppError('User already exists', 400));

  const user = await User.create({ name, email, password, role, permissions });
  res.status(201).json({ status: 'success', data: { user } });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({ status: 'success', data: { user } });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({ status: 'success', data: { user } });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  res.status(204).json({ status: 'success', data: null });
});







