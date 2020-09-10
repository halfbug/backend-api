const express = require('express');
const {
  getAllQuestionnaires,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getNextQuestion,
  saveAnswer
} = require('../controllers/questionnaire');

const Questionnaire = require('../models/Questionnaire');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
// router.use(authorize('admin'));

router
  .route('/')
  .get(advancedResults(Questionnaire), getAllQuestionnaires)
  .post(createQuestion);

  router
  .route('/question')
  .get(getNextQuestion)
  .post(saveAnswer)

router
  .route('/:id')
  .get(getQuestion)
  .put(updateQuestion)
  .delete(deleteQuestion);

  
  



module.exports = router;
