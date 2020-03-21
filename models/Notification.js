const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title']
  },
  message: {
    type: String,
    required: [true, 'Please add a description']
  },
  types: {
    type: String,
    required: [true, 'Please add number of weeks']
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
 
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});


module.exports = mongoose.model('Notification', NotificationSchema);
