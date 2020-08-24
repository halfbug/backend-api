const express = require('express');
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole
} = require('../controllers/roles');

const Role = require('../models/Role');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(advancedResults(Role), getRoles)

router.use(protect);
// router.use(authorize('admin'));

router
  .route('/')
  .post(createRole);

router
  .route('/:id')
  .get(getRole) 
  .put(updateRole)
  .delete(deleteRole);

module.exports = router;
