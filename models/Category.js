const mongoose = require('mongoose');

const Category = new mongoose.Schema({
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
  parentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    default: null,
  },
  type : {
    type: String,
    enum : ['Product','Questionnaire','Course'],
    required:  [true, 'Please provide Category type [Product, Questioner, Course]'],
    default: "Product"

  },
  createdAt: {
    type: Date,
    default: Date.now
  },
 
});



module.exports = mongoose.model('ProductCategory', Category);
