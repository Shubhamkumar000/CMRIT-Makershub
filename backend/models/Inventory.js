import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  fee: {
    type: Number,
    required: true
  },
  cmritFee: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  available: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['3d-printing', 'laser-cutting', 'cnc', 'electronics', 'general'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['available', 'maintenance', 'unavailable'],
    default: 'available'
  }
}, {
  timestamps: true
});

// Index for faster queries
inventorySchema.index({ category: 1 });
inventorySchema.index({ status: 1 });
inventorySchema.index({ available: 1 });

export default mongoose.model('Inventory', inventorySchema);
