const catchAsync = require('../utils/catchAsync');
const Customer = require('../models/Customer'); // New model
const AppError = require('../utils/appError');

exports.getAllCustomers = catchAsync(async (req, res) => {
  const customers = await Customer.find();
  res.status(200).json({ status: 'success', results: customers.length, data: { customers } });
});

exports.createCustomer = catchAsync(async (req, res, next) => {
  const customer = await Customer.create(req.body);
  res.status(201).json({ status: 'success', data: { customer } });
});

exports.getCustomer = catchAsync(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return next(new AppError('Customer not found', 404));
  res.status(200).json({ status: 'success', data: { customer } });
});

exports.updateCustomer = catchAsync(async (req, res, next) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!customer) return next(new AppError('Customer not found', 404));
  res.status(200).json({ status: 'success', data: { customer } });
});

exports.deleteCustomer = catchAsync(async (req, res, next) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return next(new AppError('Customer not found', 404));
  res.status(204).json({ status: 'success', data: null });
});

exports.searchCustomers = catchAsync(async (req, res) => {
  const { q } = req.query;
  const customers = await Customer.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { phone: { $regex: q, $options: 'i' } }
    ]
  });
  res.status(200).json({ status: 'success', results: customers.length, data: { customers } });
});

exports.getCustomerStats = catchAsync(async (req, res) => {
  const total = await Customer.countDocuments();
  const newThisMonth = await Customer.countDocuments({
    createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
  });
  res.status(200).json({ status: 'success', data: { total, newThisMonth } });
});

exports.exportCustomers = catchAsync(async (req, res) => {
  const customers = await Customer.find().select('-__v');
  res.status(200).json({ status: 'success', data: { customers } });
});







