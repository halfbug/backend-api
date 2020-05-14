const express = require('express');
const {
  getApps,
  getApp,
  createApp,
  updateApp,
  deleteApp,
  getAppKey
} = require('../controllers/apps');

const App = require('../models/App');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
// router.use(authorize('admin'));

router
  .route('/')
  .get(advancedResults(App), getApps)
  .post(createApp);

  router.route('/:name/:medium?').get(getAppKey);

router
  .route('/:id')
  .get(getApp)
  .put(updateApp)
  .delete(deleteApp);



module.exports = router;
