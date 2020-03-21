const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const App = require('../models/Profile');

// @desc      Get all Profiles
// @route     GET /api/v1/Profiles
// @access    Private/Admin
exports.getProfiles = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single Profile
// @route     GET /api/v1/Profiles/:id
// @access    Private/Admin
exports.getProfile = asyncHandler(async (req, res, next) => {
  const Profile = await Profile.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: Profile
  });
});

// @desc      Create Profile
// @route     POST /api/v1/Profiles
// @access    Private/Admin
exports.createProfile = asyncHandler(async (req, res, next) => {
  const Profile = await Profile.create(req.body);

  res.status(201).json({
    success: true,
    data: Profile
  });
});

// @desc      Update Profile
// @route     PUT /api/v1/Profiles/:id
// @access    Private/Admin
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const Profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: Profile
  });
});

// @desc      Delete Profile
// @route     DELETE /api/v1/Profiles/:id
// @access    Private/Admin
exports.deleteProfile = asyncHandler(async (req, res, next) => {
  await Profile.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});
