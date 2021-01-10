const express = require('express');
const {
  walletCreated,
  customerSellerInstantMessageSentReceived,
  teacherStudentInstantMessageSentReceived,
  customerSellerPaymentSent,
  customerRefillStockNotification,
  customerPurchaseMadeNotification,
  patientPaymentReceiveNotification,
  freeCourseNotification  
} = require('../controllers/pushNotification');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .post('/wallet/created', walletCreated)

router
  .post('/customer/seller/instant/message', customerSellerInstantMessageSentReceived)

router
  .post('/customer/seller/payment/sent', customerSellerPaymentSent)

router
  .post('/customer/refill/stock', customerRefillStockNotification)

router
  .post('/customer/purchase/made', customerPurchaseMadeNotification)

router
  .post('/patient/payment/receive', patientPaymentReceiveNotification)

  router
  .post('/teacher/student/instant/message', teacherStudentInstantMessageSentReceived)

router
  .post('/student/free/course', freeCourseNotification)

module.exports = router;
