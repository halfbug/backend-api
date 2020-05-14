const mongoose = require('mongoose');


const SocialSchema = new mongoose.Schema({
  appName: {
    type: String,
    trim: true,
    required: [true, 'Please add a title'],
    dropDups: true,
    maxlength: 100
  },
  detail: {}
});


module.exports = mongoose.model('SocialAccounts', SocialSchema);
