const express = require('express');
const {
  getProductCategories,
  getProductCategory,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory
} = require('../controllers/productCategory');

const ProductCategory = require('../models/ProductCategory');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(advancedResults(ProductCategory), getProductCategories);

router.use(protect);

router
  .route('/')
  .post(createProductCategory);
 
router
  .route('/:id')
  .get(getProductCategory) 
  .put(updateProductCategory)
  .delete(deleteProductCategory);

module.exports = router;
