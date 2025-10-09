const mongoose = require('mongoose');
const crypto = require('crypto'); // Use built-in crypto for UUID generation

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Grains', 'Beverages', 'Snacks', 'Household'],
      message: 'Please select a valid category'
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  minStock: {
    type: Number,
    min: [0, 'Minimum stock cannot be negative'],
    default: 10
  },
  uom: {
    type: String,
    required: [true, 'Unit of measurement is required'],
    enum: {
      values: ['kg', 'g', 'litre', 'ml', 'pack', 'piece', 'dozen', 'bundle'],
      message: 'Please select a valid unit of measurement'
    }
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  location: {
    type: String,
    trim: true,
    maxlength: [50, 'Location cannot exceed 50 characters']
  },
  supplier: {
    name: {
      type: String,
      trim: true
    },
    contact: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive', 'discontinued'],
      message: 'Please select a valid status'
    },
    default: 'active'
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  expiryDate: {
    type: Date
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'Out of Stock';
  if (this.stock <= this.minStock) return 'Low Stock';
  return 'In Stock';
});

// Virtual for profit margin
productSchema.virtual('profitMargin').get(function() {
  if (!this.costPrice || this.costPrice === 0) return null;
  return ((this.price - this.costPrice) / this.costPrice * 100).toFixed(2);
});

// Only non-unique indexes (unique indexes are handled by schema)
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Pre-save middleware to generate SKU if not provided (enhanced for uniqueness)
productSchema.pre('save', function(next) {
  if (!this.sku) {
    const categoryPrefix = this.category.substring(0, 3).toUpperCase();
    this.sku = `${categoryPrefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  next();
});

// Static method to find low stock products
productSchema.statics.findLowStock = function() {
  return this.find({
    $expr: {
      $lte: ['$stock', '$minStock']
    }
  });
};

// Enhanced instance method to update stock (supports session and user)
productSchema.methods.updateStock = function(quantity, operation = 'add', session = null, userId = null) {
  if (operation === 'add') {
    this.stock += quantity;
  } else if (operation === 'subtract') {
    if (this.stock < quantity) {
      throw new Error('Insufficient stock');
    }
    this.stock -= quantity;
  }
  return this.save({ session });
};

module.exports = mongoose.model('Product', productSchema);










