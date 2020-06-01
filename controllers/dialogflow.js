const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Apps = require('../models/App');
const dialogflow = require('dialogflow');
const uuid = require('uuid');

// @desc      Get text from dialog flow
// @route     GET /api/v1/df/text
// @access    Private/Admin
exports.dfTextQuery = asyncHandler(async (req, res, next) => {
//  res.status(200).json({Mes:"done"});

// if(!App){
//     return next(new ErrorResponse('App Not Found', 401));
//   }

// A unique identifier for the given session
const sessionId = uuid.v4();
 
// Create a new session

// const sessionClient = new dialogflow.SessionsClient();
const sessionClient = new dialogflow.SessionsClient({
    keyFilename: require("path").join('config/Hope Accelerated-49fe05f89795.json')
});
const sessionPath = sessionClient.sessionPath(process.env.DIALOGFLOW_PROJECTID, sessionId);

// The text query request.
const request = {
  session: sessionPath,
  queryInput: {
    text: {
      // The query to send to the dialogflow agent
      text: req.body.text,
      // The language used by the client (en-US)
      languageCode: 'en-US',
    },
  },
};

// Send request and log result
const responses = await sessionClient.detectIntent(request);
console.log('Detected intent');
const result = responses[0].queryResult;
console.log(`  Query: ${result.queryText}`);
console.log(`  Response: ${result.fulfillmentText}`);
if (result.intent) {
  console.log(`  Intent: ${result.intent.displayName}`);
} else {
  console.log(`  No intent matched.`);
}

  
res.status(200).json(result);
});



// @desc      Get all Appss
// @route     GET /api/v1/df/event
// @access    Private/Admin

exports.dfEventQuery = asyncHandler(async (req, res, next) => {
    //  res.status(200).json({Mes:"done"});
    
    // if(!App){
    //     return next(new ErrorResponse('App Not Found', 401));
    //   }
      
    res.status(200).json( {'do': 'event query'});
    });
    
    // curl -H "Content-Type: application/json; charset=utf-8"  -H "Authorization: Bearer ya29.c.Ko8BzQdxOJ9YVmInYhjQNbVN98CK79BfjK9TnFgyDDcWDvEPyc8LF7G6l_iD2Nf-IUaSuSzE3iw0kQ3jBgmbHAnYPcKgfqVdnSRvX2Okf5diLdbDgqDY6LU_KUk1YAHPT92_JYuj2m3iTQ7___s-zo9lAepf6pIFTaZrs9GPTqmm8FzFylniZihcAXW_uZ-H6i0"  -d "{\"queryInput\":{\"text\":{\"text\":\"Cough\",\"languageCode\":\"en\"}},\"queryParams\":{\"timeZone\":\"Asia/Karachi\"}}" "https://dialogflow.clients6.google.com/v2/projects/hope-accelerated/locations/global/agent/sessions/36ac590f-ec76-bf8d-7fe5-92b51b6e1caf:detectIntent"