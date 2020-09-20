const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const ProductCategory = require('../models/ProductCategory');

// @desc      Get all ProductCategorys
// @route     GET /api/v1/ProductCategorys
// @access    Private/Admin
exports.getProductCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single ProductCategory
// @route     GET /api/v1/ProductCategorys/:id
// @access    Private/Admin
exports.getProductCategory = asyncHandler(async (req, res, next) => {
  const pcategory = await ProductCategory.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: pcategory
  });
});

// @desc      Create ProductCategory
// @route     POST /api/v1/ProductCategorys
// @access    Private/Admin
exports.createProductCategory = asyncHandler(async (req, res, next) => {
  console.log(req.body.name)
  const pcategory = await ProductCategory.create(req.body);

  res.status(201).json({
    success: true,
    data: pcategory
  });
});

// @desc      Update ProductCategory
// @route     PUT /api/v1/ProductCategorys/:id
// @access    Private/Admin
exports.updateProductCategory = asyncHandler(async (req, res, next) => {
  const pcategory = await ProductCategory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: pcategory
  });
});

// @desc      Delete ProductCategory
// @route     DELETE /api/v1/ProductCategorys/:id
// @access    Private/Admin
exports.deleteProductCategory = asyncHandler(async (req, res, next) => {
  await ProductCategory.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});
