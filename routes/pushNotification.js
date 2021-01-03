const express = require('express');
const {
  notifyUserAboutWalletCreated
} = require('../controllers/pushNotification');

const router = express.Router({ mergeParams: true });

// const { protect, authorize } = require('../middleware/auth');

// router.use(protect);
// router.use(authorize('user'));

router
  .post('/wallet/created', notifyUserAboutWalletCreated)

module.exports = router;
