const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Toys', 'Gadgets', 'Accessories', 'Props']
  },
  material: {
    type: String,
    required: true,
    enum: ['PLA', 'PETG', 'ABS', 'TPU', 'Resin']
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);