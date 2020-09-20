const mongoose = require('mongoose');

const ProductCategory = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a category name'],
    maxlength: 100
  },
  appId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Apps',
    required: [true, 'Please define App Id'],
    
  },
 
  createdAt: {
    type: Date,
    default: Date.now
  },
 
});



module.exports = mongoose.model('ProductCategory', ProductCategory);
