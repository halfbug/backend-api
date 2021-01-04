const express = require('express');
const {
  walletCreated,
  instantMessageSentReceived
} = require('../controllers/pushNotification');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .post('/wallet/created', walletCreated)

router
  .post('/instant/message', instantMessageSentReceived)

module.exports = router;
