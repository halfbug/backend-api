const express = require('express');
const {
  getSocialAccounts,
  getSocialAccount,
  createSocialAccount,
  updateSocialAccount,
  deleteSocialAccount
} = require('../controllers/socialAccounts');

const SocialAccount = require('../models/SocialAccounts');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// router.use(protect);
// router.use(authorize('admin'));

router
  .route('/')
  .get(advancedResults(SocialAccount), getSocialAccounts)
  .post(createSocialAccount);

router
  .route('/:id')
  .get(getSocialAccount) 
  .put(updateSocialAccount)
  .delete(deleteSocialAccount);

module.exports = router;
