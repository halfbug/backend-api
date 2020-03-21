const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Role = require('../models/Role');

// @desc      Get all Roles
// @route     GET /api/v1/Roles
// @access    Private/Admin
exports.getRoles = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single Role
// @route     GET /api/v1/Roles/:id
// @access    Private/Admin
exports.getRole = asyncHandler(async (req, res, next) => {
  const Role = await Role.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: Role
  });
});

// @desc      Create Role
// @route     POST /api/v1/Roles
// @access    Private/Admin
exports.createRole = asyncHandler(async (req, res, next) => {
  const Role = await Role.create(req.body);

  res.status(201).json({
    success: true,
    data: Role
  });
});

// @desc      Update Role
// @route     PUT /api/v1/Roles/:id
// @access    Private/Admin
exports.updateRole = asyncHandler(async (req, res, next) => {
  const Role = await Role.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: Role
  });
});

// @desc      Delete Role
// @route     DELETE /api/v1/Roles/:id
// @access    Private/Admin
exports.deleteRole = asyncHandler(async (req, res, next) => {
  await Role.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});
