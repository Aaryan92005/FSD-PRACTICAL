const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const Inventory = require('../models/Inventory');
const mongoose = require('mongoose');
const { Parser } = require('json2csv');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

exports.getProductBySKU = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ sku: req.params.sku.toUpperCase() });
  if (!product) {
    return next(new AppError('No product found with that SKU', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

exports.getProductByBarcode = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ barcode: req.params.barcode });
  if (!product) {
    return next(new AppError('No product found with that barcode', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct
    }
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getLowStockProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findLowStock();
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

exports.getProductsByCategory = catchAsync(async (req, res, next) => {
  const products = await Product.find({ category: req.params.category });
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

// Use validateSearch in routes
exports.searchProducts = catchAsync(async (req, res, next) => {
  const { q } = req.query;
  if (!q) {
    return next(new AppError('Search query is required', 400));
  }

  const products = await Product.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { sku: { $regex: q, $options: 'i' } },
      { barcode: { $regex: q, $options: 'i' } }
    ]
  });

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

exports.updateProductStock = catchAsync(async (req, res, next) => {
  const { quantity, operation } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }

    await product.updateStock(quantity, operation); // no session, no user

    // Create inventory transaction
    const delta = operation === 'add' ? quantity : -quantity;
    await Inventory.create({
      product: product._id,
      sku: product.sku,
      transactionType: operation === 'add' ? 'receive' : 'issue',
      quantity: Math.abs(delta),
      previousStock: product.stock - delta,
      newStock: product.stock,
      unitPrice: product.price,
      performedBy: null
    });

    const updatedProduct = await Product.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        product: updatedProduct
      }
    });
  } catch (error) {
    throw error;
  }
});

exports.getProductStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        totalProducts: { $sum: 1 },
        totalStock: { $sum: '$stock' },
        totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
        averagePrice: { $avg: '$price' }
      }
    },
    {
      $sort: { totalProducts: -1 }
    }
  ]);

  const lowStockCount = await Product.countDocuments({
    $expr: { $lte: ['$stock', '$minStock'] }
  });

  const outOfStockCount = await Product.countDocuments({ stock: 0 });

  res.status(200).json({
    status: 'success',
    data: {
      stats,
      lowStockCount,
      outOfStockCount
    }
  });
});

exports.bulkUpdateProducts = catchAsync(async (req, res, next) => {
  const { products } = req.body;

  if (!Array.isArray(products)) {
    return next(new AppError('Products must be an array', 400));
  }

  const updatePromises = products.map(async (product) => {
    return await Product.findByIdAndUpdate(
      product.id,
      product.updates,
      { new: true, runValidators: true }
    );
  });

  const updatedProducts = await Promise.all(updatePromises);

  res.status(200).json({
    status: 'success',
    results: updatedProducts.length,
    data: {
      products: updatedProducts.filter(Boolean)
    }
  });
});

// CSV Export using json2csv
exports.exportProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find().select('-__v');

  const fields = [
    { value: 'sku', label: 'SKU' },
    { value: 'name', label: 'Name' },
    { value: 'category', label: 'Category' },
    { value: 'price', label: 'Price' },
    { value: 'stock', label: 'Stock' },
    { value: 'minStock', label: 'Min Stock' },
    { value: 'uom', label: 'UOM' },
    { value: 'barcode', label: 'Barcode' },
    { value: 'location', label: 'Location' },
    { value: 'status', label: 'Status' },
    { value: 'createdAt', label: 'Created At' }
  ];

  const csvData = new Parser({ fields }).parse(products);

  res.header('Content-Type', 'text/csv');
  res.attachment('products.csv');
  res.status(200).send(csvData);
});

