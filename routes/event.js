const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  
} = require('../controllers/event');

const Event = require('../models/Event');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
// router.use(authorize('admin'));

router
  .route('/')
  .get(advancedResults(Event), getEvents)
  .post(createEvent);

  

router
  .route('/:id')
  .get(getEvent)
  .put(updateEvent)
  .delete(deleteEvent);



module.exports = router;
