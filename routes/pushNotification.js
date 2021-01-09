const express = require('express');
const {
  walletCreated,
  consumerSellerInstantMessageSentReceived,
  consumerSellerPaymentSent,
  refillStockNotification,
  purchaseMadeNotification,
  freeCourseNotification
} = require('../controllers/pushNotification');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .post('/wallet/created', walletCreated)

router
  .post('/consumer/seller/instant/message', consumerSellerInstantMessageSentReceived)

router
  .post('/consumer/seller/payment/sent', consumerSellerPaymentSent)

router
  .post('/refill/stock', refillStockNotification)

router
  .post('/purchase/made', purchaseMadeNotification)

router
  .post('/free/course', freeCourseNotification)

module.exports = router;
