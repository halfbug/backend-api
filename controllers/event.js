const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Event = require('../models/Event');

// @desc      Get all Events
// @route     GET /api/v1/Events
// @access    Private/Admin
exports.getEvents = asyncHandler(async (req, res, next) => {
//  res.status(200).json({Mes:"done"});
   res.status(200).json(res.advancedResults);
});

// @desc      Get single Event
// @route     GET /api/v1/Events/:id
// @access    Private/Admin
exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: event
  });
});

// @desc      Create Event
// @route     POST /api/v1/Events
// @access    Private/Admin
exports.createEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.create(req.body);

  res.status(201).json({
    success: true,
    data: event
  });
});

// @desc      Update Event
// @route     PUT /api/v1/Events/:id
// @access    Private/Admin
exports.updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: event
  });
});

// @desc      Delete Event
// @route     DELETE /api/v1/Events/:id
// @access    Private/Admin
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  await Event.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});


