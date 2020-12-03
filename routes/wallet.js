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
  .post('/', createUserWallet);

module.exports = router;
