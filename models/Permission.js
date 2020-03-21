const mongoose = require('mongoose');

const PermisionSchema = new mongoose.Schema({
  permision: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxlength: 100
  },
  
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },

  roleId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Role',
    required: true
  }
});

// Prevent user from submitting more than one review per bootcamp
PermisionSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
PermisionSchema.statics.getAverageRating = async function(bootcampId) {
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
PermisionSchema.post('save', function() {
  this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageCost before remove
PermisionSchema.pre('remove', function() {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', PermisionSchema);
