const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Questionnaire = require('../models/Questionnaire');
const User = require('../models/User');

// @desc      Get all Appss
// @route     GET /api/v1/Appss
// @access    Private/Admin
exports.getAllQuestionnaires = asyncHandler(async (req, res, next) => {
//  res.status(200).json({Mes:"done"});
   res.status(200).json(res.advancedResults);
});

// @desc      Get single Apps
// @route     GET /api/v1/Appss/:id
// @access    Private/Admin
exports.getQuestion = asyncHandler(async (req, res, next) => {
  const questionnaire = await Questionnaire.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: questionnaire
  });
});

// @desc      Create Apps
// @route     POST /api/v1/Appss
// @access    Private/Admin
exports.createQuestion = asyncHandler(async (req, res, next) => {
  const question= await Questionnaire.create(req.body);

  res.status(201).json({
    success: true,
    data: question
  });
});

// @desc      Update Apps
// @route     PUT /api/v1/Appss/:id
// @access    Private/Admin
exports.updateQuestion = asyncHandler(async (req, res, next) => {
  const question = await Questionnaire.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: question
  });
});

// @desc      Delete Apps
// @route     DELETE /api/v1/Appss/:id
// @access    Private/Admin
exports.deleteQuestion = asyncHandler(async (req, res, next) => {
  await Questionnaire.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});


// @desc      Get App key
// @route     GET /api/v1/Apps/:name/:medium
// @access    Private/Admin
exports.getNextQuestion = asyncHandler(async (req, res, next) => {
 
  const appId = req.body.appId && null 
  const user = await User.findById(req.user.id);
  
  const alreadyAnswered = user.questionnaireResponses.map((ques)=>ques.id)
  let question = null;
  if(appId)
  question = await Questionnaire.findOne( { $and: [{ _id : { $not: { $in :alreadyAnswered} }}, {appId } ] });
  else
  question = await Questionnaire.findOne( { _id : { $not: { $in : alreadyAnswered } }});
  

  res.status(200).json({
    success: true,
    data: question
  });
});

// @desc      Get App key
// @route     GET /api/v1/Apps/:name/:medium
// @access    Private/Admin
exports.saveAnswer = asyncHandler(async (req, res, next) => {

 const user = await User.findById(req.user.id);
 
  const answers = []

  answers.push({id: req.body.questionId, selectedOption : req.body.selectedOption})
 
    saveAns = await User.findByIdAndUpdate(req.user.id, 
        {
          "$push": {"questionnaireResponses": answers}
        },{new: true, safe: true, upsert: true }
        )
        console.log(answers)
          
    res.status(200).json({
      success: true,
      data: saveAns
    });
  });
