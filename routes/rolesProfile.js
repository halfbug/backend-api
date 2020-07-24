const express = require('express');
const {
    addDoctor,
    getDoctors,
    addPatient,
    getRps,
    getRpById,
    addRp
//   getRole,
//   createRole,
//   updateRole,
//   deleteRole
} = require('../controllers/rolesprofile');

const Role = require('../models/RolesProfile');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
// router.use(authorize('admin'));

// router
//   .route('/doctor')
  // .post(addDoctor)
//    .get(advancedResults(Role), getDoctors)
  
 
router
  .route('/:role')
  .get(advancedResults(Role), getRps)
  .post(addRp) 

router
  .route('/:role/:id')
  .get(getRpById) 

//   .put(updateRole)
//   .delete(deleteRole);

module.exports = router;
