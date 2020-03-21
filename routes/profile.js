const express = require('express');
const {
  getProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile
} = require('../controllers/Profiles');

const Profile = require('../models/Profile');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(advancedResults(Profile), getProfiles)
  .post(createProfile);

router
  .route('/:id')
  .get(getProfile)
  .put(updateProfile)
  .delete(deleteProfile);

module.exports = router;
