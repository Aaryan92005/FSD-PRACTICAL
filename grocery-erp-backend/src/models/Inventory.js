const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product reference is required']
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    uppercase: true
  },
  transactionType: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: {
      values: ['receive', 'issue', 'adjust', 'return', 'damage', 'expiry'],
      message: 'Please select a valid transaction type'
    }
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  previousStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    min: [0, 'Unit price cannot be negative']
  },
  totalValue: {
    type: Number,
    min: [0, 'Total value cannot be negative']
  },
  reference: {
    type: String,
    trim: true,
    maxlength: [100, 'Reference cannot exceed 100 characters']
  },
  reason: {
    type: String,
    trim: true,
    maxlength: [200, 'Reason cannot exceed 200 characters']
  },
  supplier: {
    name: {
      type: String,
      trim: true
    },
    contact: {
      type: String,
      trim: true
    }
  },
  customer: {
    name: {
      type: String,
      trim: true
    },
    contact: {
      type: String,
      trim: true
    }
  },
  orderNumber: {
    type: String,
    trim: true
  },
  batchNumber: {
    type: String,
    trim: true
  },
  expiryDate: {
    type: Date
  },
  location: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'completed', 'cancelled'],
      message: 'Please select a valid status'
    },
    default: 'completed'
  }
}, {
  timestamps: true
});

// Indexes for better query performance (avoiding duplicate indexes)
inventorySchema.index({ product: 1, createdAt: -1 });
inventorySchema.index({ transactionType: 1 });
inventorySchema.index({ createdAt: -1 });
inventorySchema.index({ performedBy: 1 });

// Pre-save middleware to calculate total value
inventorySchema.pre('save', function(next) {
  if (this.unitPrice && this.quantity) {
    this.totalValue = this.unitPrice * this.quantity;
  }
  next();
});

// Static method to get inventory summary
inventorySchema.statics.getInventorySummary = async function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: '$transactionType',
        totalQuantity: { $sum: '$quantity' },
        totalValue: { $sum: '$totalValue' },
        count: { $sum: 1 }
      }
    }
  ];
  
  return this.aggregate(pipeline);
};

// Static method to get low stock alerts
inventorySchema.statics.getLowStockAlerts = async function() {
  const pipeline = [
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'productInfo'
      }
    },
    {
      $unwind: '$productInfo'
    },
    {
      $group: {
        _id: '$product',
        currentStock: { $last: '$newStock' },
        productInfo: { $last: '$productInfo' }
      }
    },
    {
      $match: {
        $expr: {
          $lte: ['$currentStock', '$productInfo.minStock']
        }
      }
    }
  ];
  
  return this.aggregate(pipeline);
};

module.exports = mongoose.model('Inventory', inventorySchema);







