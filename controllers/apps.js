const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Apps = require('../models/App');

// @desc      Get all Appss
// @route     GET /api/v1/Appss
// @access    Private/Admin
exports.getApps = asyncHandler(async (req, res, next) => {
//  res.status(200).json({Mes:"done"});
   res.status(200).json(res.advancedResults);
});

// @desc      Get single Apps
// @route     GET /api/v1/Appss/:id
// @access    Private/Admin
exports.getApp = asyncHandler(async (req, res, next) => {
  const App = await Apps.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: App
  });
});

// @desc      Create Apps
// @route     POST /api/v1/Appss
// @access    Private/Admin
exports.createApp = asyncHandler(async (req, res, next) => {
  const App = await Apps.create(req.body);

  res.status(201).json({
    success: true,
    data: App
  });
});

// @desc      Update Apps
// @route     PUT /api/v1/Appss/:id
// @access    Private/Admin
exports.updateApp = asyncHandler(async (req, res, next) => {
  const App = await Apps.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: App
  });
});

// @desc      Delete Apps
// @route     DELETE /api/v1/Appss/:id
// @access    Private/Admin
exports.deleteApp = asyncHandler(async (req, res, next) => {
  await Apps.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});
