const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  token: {
    type: String,
    trim: true,
    required: [true, 'Please add a token'],
    maxlength: 100
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please define user']
  },

  appId: {
    type: mongoose.Schema.ObjectId,
    ref: 'App',
    required: [true, 'Please define app']
  },

  action: {
    type: [],
    required: [true, 'Please define the actions']
  },

  balance: {
    type: Number,
    required: [true, 'Please set the balance']
  },

  balanceCurrency: {
    type: String,
    required: [true, 'Please set the balance currency']
  },

});

// Prevent user from creating multiple
WalletSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Wallet', WalletSchema);
