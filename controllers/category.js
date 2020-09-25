const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Category = require('../models/Category');

// @desc      Get all Categorys
// @route     GET /api/v1/Categorys
// @access    Private/Admin
exports.getCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single Category
// @route     GET /api/v1/Categorys/:id
// @access    Private/Admin
exports.getCategory = asyncHandler(async (req, res, next) => {
  const pcategory = await Category.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: pcategory
  });
});

// @desc      Create Category
// @route     POST /api/v1/Categorys
// @access    Private/Admin
exports.createCategory = asyncHandler(async (req, res, next) => {
  console.log(req.body.name)
  const pcategory = await Category.create(req.body);

  res.status(201).json({
    success: true,
    data: pcategory
  });
});

// @desc      Update Category
// @route     PUT /api/v1/Categorys/:id
// @access    Private/Admin
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const pcategory = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: pcategory
  });
});

// @desc      Delete Category
// @route     DELETE /api/v1/Categorys/:id
// @access    Private/Admin
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});
