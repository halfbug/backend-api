const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const App = require('../models/Profile');

// @desc      Get all Propfiles
// @route     GET /api/v1/Propfiles
// @access    Private/Admin
exports.getProfiles = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single Propfile
// @route     GET /api/v1/Propfiles/:id
// @access    Private/Admin
exports.getProfile = asyncHandler(async (req, res, next) => {
  const Propfile = await Propfile.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: Propfile
  });
});

// @desc      Create Propfile
// @route     POST /api/v1/Propfiles
// @access    Private/Admin
exports.createProfile = asyncHandler(async (req, res, next) => {
  const Propfile = await Propfile.create(req.body);

  res.status(201).json({
    success: true,
    data: Propfile
  });
});

// @desc      Update Propfile
// @route     PUT /api/v1/Propfiles/:id
// @access    Private/Admin
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const Propfile = await Propfile.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: Propfile
  });
});

// @desc      Delete Propfile
// @route     DELETE /api/v1/Propfiles/:id
// @access    Private/Admin
exports.deleteProfile = asyncHandler(async (req, res, next) => {
  await Propfile.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});
