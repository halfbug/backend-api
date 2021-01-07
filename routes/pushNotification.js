const express = require('express');
const {
  walletCreated,
  instantMessageSentReceived,
  paymentSent,
  refillStockNotification,
  purchaseMadeNotification
} = require('../controllers/pushNotification');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .post('/wallet/created', walletCreated)

router
  .post('/instant/message', instantMessageSentReceived)

router
  .post('/payment/sent', paymentSent)

router
  .post('/refill/stock', refillStockNotification)

router
  .post('/purchase/made', purchaseMadeNotification)

module.exports = router;
