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

// Prevent user from submitting more than one review per bootcamp
WalletSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
WalletSchema.statics.getAverageRating = async function(bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
WalletSchema.post('save', function() {
  this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageCost before remove
WalletSchema.pre('remove', function() {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Wallet', WalletSchema);
