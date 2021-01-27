const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { hashIt } = require('../utils/helper')
// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { email, password, phone, roleId, appsChannelKey, socialAcc } = req.body;

  // Validate emil & password
  if (!roleId || !appsChannelKey) {
    return next(new ErrorResponse('Role Id and appsChannelKey is mandatory  ', 400));
  }
  // Create user
  const user = await User.create(
    req.body

  );
  user.roles.push(roleId);
  user.appsInUse.push(appsChannelKey);
  await user.save();

  req.body.profile.gender = req.body.profile.gender.toLowerCase();
  const uprofile = await Profile.create({
    ...req.body.profile, userId: user._id
  });
  const message = `OTP - Hopeaccelerated has been successfully generated. Your pin is : ${user.otp}`;
  try {
    await sendSMS({
      phone,
      message
    });

    if (email)
      await sendEmail({
        email: user.email,
        subject: 'OTP - Hopeaccelerated',
        message
      });

    res.status(200).json({
      success: true,
      message: 'OTP has been sent to mobile and email',
      data: { ...user._doc, profile: uprofile }
    });
  } catch (err) {
    console.log(JSON.stringify(err));
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc      vserify OTP
// @route     POST /api/v1/auth/votp
// @access    Public
exports.votp = asyncHandler(async (req, res, next) => {
  const { email, phone, otp } = req.body;

  // Validate emil & password
  if ((!email || !phone) && !otp) {
    return next(new ErrorResponse('Please provide an email/phone and otp', 400));
  }

  // Check for user
  const user = email ? await User.findOne({ email }) : await User.findOne({ phone });

  if (!user) {
    return next(new ErrorResponse('Email not found', 401));
  }
  if (parseInt(user.otp) === 0 && user.status !== "pending") {
    return next(new ErrorResponse('User already verified', 401));
  }
  // Check if password matches
  // console.log(user)
  const isMatch = parseInt(user.otp) === parseInt(otp);
  // console.log(isMatch)
  if (!isMatch) {
    return next(new ErrorResponse('OTP didnt match', 401));
  }


  await User.findByIdAndUpdate(user.id, { status: "active", otp: 0, qrcode: hashIt(email + phone) }, {
    new: true,
    runValidators: true
  });

  sendTokenResponse(user, 200, res);
});


// @desc      regenerate OTP
// @route     POST /api/v1/auth/regenotp
// @access    Public
exports.regenotp = asyncHandler(async (req, res, next) => {
  const { email, phone } = req.body;

  // Validate emil & password
  if (!phone) {
    return next(new ErrorResponse('Please provide an email and phone number', 400));
  }

  // Check for user
  let user = await User.findOne({ phone });

  if (!user) {
    return next(new ErrorResponse('Email or phone not found', 401));
  }



  if (parseInt(user.otp) === 0 && user.status !== "pending") {
    return next(new ErrorResponse('User already verified', 401));
  }

  // Re Generate the OPT

  let notp = await user.getRegeneratedOTP();
  user = await user.save();


  const message = `OTP - Hopeaccelerated has been successfully generated. Your pin is : ${notp}`;

  try {

    if (phone)
      await sendSMS({
        phone,
        message
      });

    if (!email === null)
      await sendEmail({
        email: user.email,
        subject: 'OTP - Hopeaccelerated',
        message
      });



    // const {status, email, createdAt, phone} = user

    res.status(200).json({
      success: true,
      message: 'OTP has been sent to mobile and email',
      data: user
    });


  } catch (err) {
    console.log(JSON.stringify(err));

    return next(new ErrorResponse(err.message, 500));
  }
});


// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const profile = await Profile.findOne({ userId: user.id })
  res.status(200).json({
    success: true,
    data: { user, profile }
  });
});

// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password r incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});


// @desc      Login user by phone
// @route     POST /api/v1/auth/plogin
// @access    Public
exports.plogin = asyncHandler(async (req, res, next) => {
  const { phone } = req.body;

  // Validate emil & password
  if (!phone) {
    return next(new ErrorResponse('Please provide phone number', 400));
  }

  // Check for user
  let user = await User.findOne({ phone }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid phone number', 401));
  }

  // Re Generate the OPT
  //  console.log(user)
  const notp = await user.getRegeneratedOTP();
  user = await user.save();

  console.log(notp)
  const message = `OTP-Hopeaccelerated has been successfully generated. Your pin is : ${notp}`;

  console.log(user)
  try {

    await sendSMS({
      phone,
      message
    });

    await sendEmail({
      email: user.email,
      subject: 'OTP - Hopeaccelerated',
      message
    });



    // const {status, email, createdAt, phone} = user

    res.status(200).json({
      success: true,
      message: 'OTP has been sent to mobile and email',
    });


  } catch (err) {
    console.log(JSON.stringify(err));

    return next(new ErrorResponse('Email could not be sent', 500));
  }

});


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};

