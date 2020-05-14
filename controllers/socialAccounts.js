const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const SocialAccount = require('../models/SocialAccounts');

// @desc      Get all SocialAccounts
// @route     GET /api/v1/SocialAccounts
// @access    Private/Admin
exports.getSocialAccounts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single SocialAccount
// @route     GET /api/v1/SocialAccounts/:id
// @access    Private/Admin
exports.getSocialAccount = asyncHandler(async (req, res, next) => {
  const social = await SocialAccount.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: social
  });
});

// @desc      Create SocialAccount
// @route     POST /api/v1/SocialAccounts
// @access    Private/Admin
exports.createSocialAccount = asyncHandler(async (req, res, next) => {
  console.log(req.body.name)
  const social = await SocialAccount.create(req.body);

  res.status(201).json({
    success: true,
    data: social
  });
});

// @desc      Update SocialAccount
// @route     PUT /api/v1/SocialAccounts/:id
// @access    Private/Admin
exports.updateSocialAccount = asyncHandler(async (req, res, next) => {
  const social = await SocialAccount.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: social
  });
});

// @desc      Delete SocialAccount
// @route     DELETE /api/v1/SocialAccounts/:id
// @access    Private/Admin
exports.deleteSocialAccount = asyncHandler(async (req, res, next) => {
  await SocialAccount.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});
