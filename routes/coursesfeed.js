const express = require('express');
const {
  getCourses,
 
} = require('../controllers/coursesfeed');



const router = express.Router({ mergeParams: true });

// const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getCourses);

// router.use(protect);
// router.use(authorize('admin'));

module.exports = router;
