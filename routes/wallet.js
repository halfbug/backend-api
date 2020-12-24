const express = require('express');
const {
  getUserWallet,
  createUserWallet
} = require('../controllers/wallet');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('user'));

router
  .get('/', getUserWallet)
  // .post('/', createUserWallet); // this api is not required now as wallet will be explicitly create once user's kyc doc is verified

module.exports = router;
