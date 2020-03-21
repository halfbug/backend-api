const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxlength: 100
  },
  appId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Apps',
    required: [true, 'Please define App Id'],
    // default : "03jlksdoifwlkejrlwkejr"
  },
 
  createdAt: {
    type: Date,
    default: Date.now
  },
 
});

// Prevent user from submitting more than one review per bootcamp

module.exports = mongoose.model('Role', RoleSchema);
