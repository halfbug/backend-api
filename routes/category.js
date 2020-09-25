const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/category');

const Category = require('../models/Category');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(advancedResults(Category), getCategories);

router.use(protect);

router
  .route('/')
  .post(createCategory);
 
router
  .route('/:id')
  .get(getCategory) 
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
