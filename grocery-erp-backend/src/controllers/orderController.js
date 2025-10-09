const catchAsync = require('../utils/catchAsync');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');

// Anonymous user placeholder for unauthenticated environments
const ANONYMOUS_USER_ID = new mongoose.Types.ObjectId('000000000000000000000000');

exports.getAllOrders = catchAsync(async (req, res) => {
  const orders = await Order.find()
    .populate('createdBy processedBy cancelledBy items.product customer')
    .sort({ createdAt: -1 });
  res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
});

// Note: No MongoDB transactions here to support standalone MongoDB deployments
exports.createOrder = catchAsync(async (req, res, next) => {
  const { customer, items, paymentMethod, tax, discount } = req.body;

  // Basic input checks (validationMiddleware also runs)
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError('Order must contain at least one item', 400);
  }

  // Generate unique order reference
  const orderRef = `Order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Validate and update stock for items
  const orderItems = [];
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) throw new AppError(`Product ${item.product} not found`, 404);
    if (product.stock < item.quantity) throw new AppError(`Insufficient stock for ${product.name}`, 400);

    // Create inventory transaction for issue
    await Inventory.create({
      product: product._id,
      sku: product.sku,
      transactionType: 'issue',
      quantity: item.quantity,
      previousStock: product.stock,
      newStock: product.stock - item.quantity,
      unitPrice: product.price,
      performedBy: null,
      reference: orderRef // Temp order ref
    });

    // Update product stock
    product.stock -= item.quantity;
    await product.save();

    orderItems.push({
      ...item,
      sku: product.sku,
      name: product.name,
      unitPrice: product.price,
      totalPrice: product.price * item.quantity
    });
  }

  // Build order document
  const orderDoc = {
    customer: customer && customer.name ? customer : { name: 'Guest' },
    items: orderItems,
    subtotal: orderItems.reduce((sum, i) => sum + i.totalPrice, 0),
    tax: tax || 0,
    discount: discount || 0,
    total: orderItems.reduce((sum, i) => sum + i.totalPrice, 0) + (tax || 0) - (discount || 0),
    paymentMethod: paymentMethod || 'cash',
    createdBy: ANONYMOUS_USER_ID
  };

  // Persist order
  const order = await Order.create(orderDoc);

  // Update inventory references with actual order number
  const txs = await Inventory.find({ reference: orderRef });
  for (const tx of txs) {
    tx.orderNumber = order.orderNumber;
    await tx.save();
  }

  res.status(201).json({ status: 'success', data: { order } });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('createdBy processedBy cancelledBy items.product customer');
  if (!order) return next(new AppError('Order not found', 404));
  res.status(200).json({ status: 'success', data: { order } });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .populate('items.product');
  if (!order) return next(new AppError('Order not found', 404));
  res.status(200).json({ status: 'success', data: { order } });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));
  res.status(204).json({ status: 'success', data: null });
});

exports.getCustomerOrders = catchAsync(async (req, res) => {
  const orders = await Order.find({ 'customer.email': req.params.customerId }).populate('items.product');
  res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
});

exports.getOrderStats = catchAsync(async (req, res) => {
  const stats = await Order.aggregate([
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
  ]);
  res.status(200).json({ status: 'success', data: stats });
});

exports.getSalesSummary = catchAsync(async (req, res) => {
  const summary = await Order.getSalesSummary(new Date('2025-01-01'), new Date());
  res.status(200).json({ status: 'success', data: summary[0] || { totalOrders: 0, totalRevenue: 0 } });
});

exports.getTopSellingProducts = catchAsync(async (req, res) => {
  const products = await Order.getTopSellingProducts(10);
  res.status(200).json({ status: 'success', results: products.length, data: { products } });
});

exports.exportOrders = catchAsync(async (req, res) => {
  const orders = await Order.find().populate('items.product');
  res.status(200).json({ status: 'success', data: { orders } });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));
  order.orderStatus = req.body.status;
  order.processedBy = null;
  await order.save();
  res.status(200).json({ status: 'success', data: { order } });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));
  order.orderStatus = 'cancelled';
  order.cancelledBy = null;
  order.cancellationReason = req.body.reason;
  await order.save();
  res.status(200).json({ status: 'success', data: { order } });
});

exports.processRefund = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));
  order.paymentStatus = 'refunded';
  order.refundAmount = req.body.amount;
  order.refundReason = req.body.reason;
  await order.save();
  res.status(200).json({ status: 'success', data: { order } });
});

exports.createQuickSale = catchAsync(async (req, res, next) => {
  req.body.customer = req.body.customer?.name ? req.body.customer : { name: 'Quick Sale' };
  return exports.createOrder(req, res, next);
});
