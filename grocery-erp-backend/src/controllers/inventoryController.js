const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllTransactions = catchAsync(async (req, res) => {
  const transactions = await Inventory.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .populate('product performedBy');
  res.status(200).json({ status: 'success', results: transactions.length, data: { transactions } });
});

// Create an inventory transaction and synchronize product stock (no MongoDB transactions)
exports.createTransaction = catchAsync(async (req, res, next) => {
  const { product: productId, quantity, transactionType } = req.body;
  const product = await Product.findById(productId);
  if (!product) return next(new AppError('Product not found', 404));

  const qty = Number(quantity || 0);
  if (qty < 0) return next(new AppError('Quantity must be a non-negative number', 400));

  const previousStock = product.stock;
  let newStock = previousStock;
  if (transactionType === 'receive') {
    newStock += qty;
  } else if (transactionType === 'issue') {
    if (product.stock < qty) return next(new AppError('Insufficient stock', 400));
    newStock -= qty;
  } else if (transactionType === 'adjust') {
    newStock = qty;
  } else {
    return next(new AppError('Invalid transaction type', 400));
  }

  const tx = await Inventory.create({
    ...req.body,
    sku: product.sku,
    previousStock,
    newStock,
    unitPrice: product.price,
    totalValue: product.price * qty,
    performedBy: null
  });

  product.stock = newStock;
  await product.save();

  const populated = await tx.populate('product');
  res.status(201).json({ status: 'success', data: { transaction: populated } });
});

exports.getTransaction = catchAsync(async (req, res, next) => {
  const tx = await Inventory.findById(req.params.id).populate('product performedBy');
  if (!tx) return next(new AppError('Transaction not found', 404));
  res.status(200).json({ status: 'success', data: { transaction: tx } });
});

exports.updateTransaction = catchAsync(async (req, res, next) => {
  const tx = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('product performedBy');
  if (!tx) return next(new AppError('Transaction not found', 404));
  res.status(200).json({ status: 'success', data: { transaction: tx } });
});

exports.deleteTransaction = catchAsync(async (req, res, next) => {
  const tx = await Inventory.findByIdAndDelete(req.params.id);
  if (!tx) return next(new AppError('Transaction not found', 404));
  res.status(204).json({ status: 'success', data: null });
});

exports.getProductTransactions = catchAsync(async (req, res) => {
  const transactions = await Inventory.find({ product: req.params.productId })
    .sort({ createdAt: -1 })
    .populate('product performedBy');
  res.status(200).json({ status: 'success', results: transactions.length, data: { transactions } });
});

exports.getInventorySummary = catchAsync(async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const lowStock = await Product.countDocuments({ $expr: { $lte: ['$stock', '$minStock'] } });
  const outOfStock = await Product.countDocuments({ stock: 0 });
  res.status(200).json({ status: 'success', data: { totalProducts, lowStock, outOfStock } });
});

exports.getLowStockAlerts = catchAsync(async (req, res) => {
  const products = await Product.findLowStock();
  res.status(200).json({ status: 'success', results: products.length, data: { products } });
});

exports.exportInventory = catchAsync(async (req, res) => {
  const products = await Product.find().select('-__v').populate('supplier');
  res.status(200).json({ status: 'success', data: { items: products } });
});

// Stock operations (no MongoDB transactions/sessions)
exports.receiveStock = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) return next(new AppError('Product not found', 404));
  const qty = Number(quantity || 0);
  if (qty <= 0) return next(new AppError('Quantity must be positive', 400));

  const tx = await Inventory.create({
    product: productId,
    sku: product.sku,
    transactionType: 'receive',
    quantity: qty,
    previousStock: product.stock,
    newStock: product.stock + qty,
    unitPrice: product.price,
    performedBy: null
  });

  product.stock += qty;
  await product.save();

  res.status(200).json({ status: 'success', data: { transaction: tx, product } });
});

exports.issueStock = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) return next(new AppError('Product not found', 404));
  const qty = Number(quantity || 0);
  if (product.stock < qty) return next(new AppError('Insufficient stock', 400));

  const tx = await Inventory.create({
    product: productId,
    sku: product.sku,
    transactionType: 'issue',
    quantity: qty,
    previousStock: product.stock,
    newStock: product.stock - qty,
    unitPrice: product.price,
    performedBy: null
  });

  product.stock -= qty;
  await product.save();

  res.status(200).json({ status: 'success', data: { transaction: tx, product } });
});

exports.adjustStock = catchAsync(async (req, res, next) => {
  const { productId, newStock } = req.body;
  const product = await Product.findById(productId);
  if (!product) return next(new AppError('Product not found', 404));
  const stockLevel = Number(newStock || 0);
  if (stockLevel < 0) return next(new AppError('New stock cannot be negative', 400));

  const tx = await Inventory.create({
    product: productId,
    sku: product.sku,
    transactionType: 'adjust',
    quantity: stockLevel - product.stock,
    previousStock: product.stock,
    newStock: stockLevel,
    unitPrice: product.price,
    performedBy: null
  });

  product.stock = stockLevel;
  await product.save();

  res.status(200).json({ status: 'success', data: { transaction: tx, product } });
});
