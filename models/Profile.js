const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const ProfileSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please add a Firstname']
    },
    lastName: {
      type: String,
      //required: [true, 'Please add a Firstname']
    },
    gender: {
      type: String,
      required: [true, 'Please give gender'],
      enum : ['Male','Female','Other']
    },
    dob: {
      type: Date,
      //default: Date.now
      required: [true, 'Please give dob'],
    },
    
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS'
      ]
    },
    maritalStatus: {
      type: String,
      maxlength: [20, 'Phone number can not be longer than 20 characters']
    },
    
    address: {
      type: String,
      required: [true, 'Please add an address']
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    },
    careers: {
      // Array of strings
      type: [String],
      
    },
    
    photo: {
      type: String,
      default: 'no-photo.jpg'
    },
    ownCar: {
      type: Boolean,
      default: false
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create bootcamp slug from the name
// ProfileSchema.pre('save', function(next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// Geocode & create location field
// ProfileSchema.pre('save', async function(next) {
//   console.log("inside ----------->")
//   const loc = await geocoder.geocode(this.address);
//   this.location = {
//     type: 'Point',
//     coordinates: [loc[0].longitude, loc[0].latitude],
//     formattedAddress: loc[0].formattedAddress,
//     street: loc[0].streetName,
//     city: loc[0].city,
//     state: loc[0].stateCode,
//     zipcode: loc[0].zipcode,
//     country: loc[0].countryCode
//   };

//   // Do not save address in DB
//   this.address = undefined;
//   next();
// });

// Cascade delete courses when a bootcamp is deleted
// ProfileSchema.pre('remove', async function(next) {
//   // console.log(`Courses being removed from bootcamp ${this._id}`);
//   // await this.model('Course').deleteMany({ bootcamp: this._id });
//   next();
// });

// Reverse populate with virtuals
// ProfileSchema.virtual('courses', {
//   ref: 'Course',
//   localField: '_id',
//   foreignField: 'bootcamp',
//   justOne: false
// });

module.exports = mongoose.model('Profile', ProfileSchema);
