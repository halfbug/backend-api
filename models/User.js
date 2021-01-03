const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const OTPGenerator = require('../utils/otpgenerator')
const Role = require('./Role')
const { hashIt } = require('../utils/helper')

const UserSchema = new mongoose.Schema({

  email: {
    type: String,
    // required: [true, 'Please add an email'],
    unique: [true, 'User already present'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ],
    sparse: true
  },
  phone: {
    type: String,
    required: [true, 'Please add <phone> number'],
    unique: [true, 'Phone number already present'],
    // match: [
    //   /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/,
    //   'Please add a valid phone number'
    // ]
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'blocked'],
    default: 'pending'
  },
  password: {
    type: String,
    // required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  TowFactorAuthExpire: Date,
  roles:
    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roles' }],

  appsInUse: [{ type: String }],

  deviceId: String,
  otp: {
    type: Number,
    maxlength: [6, 'OTP  can not be longer than 6 characters'],
    minlength: [6, 'OTP  can not be smaller  than 6 characters'],

  },
  qrcode: String,
  selfie: String,
  createdAt: {
    type: Date,
    default: Date.now

  },
  preferredLanguage: String,
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: 0
  },
  socialAcc: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SocialAccounts' }],
  questionnaireResponses: [],
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  isKycDocVerified: {
    type: Boolean,
    default: 0
  },
  isKycDocSubmitted: {
    type: Boolean,
    default: 0
  },
  deviceIds:
    [{ type: String }],
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  // if (!this.isModified('password')) {
  //   next();
  // }

  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

  }

  //generate otp
  console.log(this.otp)
  this.otp = await OTPGenerator();
  console.log("########pre save#######")
  console.log(this.otp)
  // this.qrcode = hashIt(this.phone+this.email)

});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Regenerate OTP
UserSchema.methods.getRegeneratedOTP = function () {
  // Generate otp
  const newOTP = OTPGenerator();

  this.otp = newOTP;


  return newOTP;
};

module.exports = mongoose.model('User', UserSchema);
