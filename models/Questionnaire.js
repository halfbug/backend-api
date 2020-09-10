const mongoose = require('mongoose');

const QuestionnaireSchema = new mongoose.Schema({
  question: {
    type: String,
    trim: true,
    required: [true, 'Please add a title '],
    dropDups: true,
    maxlength: 100
  },
  options: { 
    type: [],
    
  },
  appId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Apps',
    required: [true, 'Please define App Id'],
   
  },
  
});

module.exports = mongoose.model('Questionnaire', QuestionnaireSchema);
