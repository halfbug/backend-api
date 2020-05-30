const express = require('express');
const {
dfEventQuery,
dfTextQuery
} = require('../controllers/dialogflow');


const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.use(protect);
// router.use(authorize('admin'));

router
  .route('/text')
  .post(dfTextQuery);

  router
  .route('/event')
  .post(dfEventQuery);



module.exports = router;
