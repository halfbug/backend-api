const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  
} = require('../controllers/product');

const Product = require('../models/Product');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
// router.use(authorize('admin'));

router
  .route('/')
  .get(advancedResults(Product), getProducts)
  .post(createProduct);

  

router
  .route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);



module.exports = router;
