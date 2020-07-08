const express = require('express');
const {
    getAppointments,
    auth2callback,
    setAppointment
} = require('../controllers/calendar');


const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

// router.use(protect);
// router.use(authorize('admin'));

router
  .route('/')
  .get(getAppointments);

  router
  .route('/appointment')
  .post(setAppointment);

router
.route ('/auth2callback') 
.get(auth2callback)
//   router
//   .route('/event')
//   .post(dfEventQuery);



module.exports = router;
