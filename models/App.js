const mongoose = require('mongoose');

const AppSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxlength: 100
  },
  medium: {
    type: String,
    
  },
  
});


module.exports = mongoose.model('Apps', AppSchema);
