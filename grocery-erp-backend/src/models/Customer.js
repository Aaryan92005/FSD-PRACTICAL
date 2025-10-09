const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true
  },
  phone: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: [0, 'Total spent cannot be negative']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive', 'vip'],
      message: 'Please select a valid status'
    },
    default: 'active'
  }
}, {
  timestamps: true
});

// Only non-unique indexes (unique indexes are handled by schema)
customerSchema.index({ status: 1 });

// Static method to get stats
customerSchema.statics.getStats = async function() {
  return {
    total: await this.countDocuments(),
    active: await this.countDocuments({ status: 'active' }),
    vip: await this.countDocuments({ status: 'vip' })
  };
};

module.exports = mongoose.model('Customer', customerSchema);