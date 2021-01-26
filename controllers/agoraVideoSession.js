const randomstring = require("randomstring");
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { agoraCustomTokenGenerator } = require('../utils/agoraVideoSession/customTokenGenerator');
const AgoraVideoSession = require('../models/agoraVideoSession');

// @desc      Get agora channel & token
// @route     GET /api/v1/agora/channel/token
// @access    Private/Admin
exports.getAgoraSessionChannelToken = asyncHandler(async (req, res, next) => {

  if (!req.body) {
    return next(new ErrorResponse('Please provide the required fields (appId, callerUserId. receiverUserId)  ', 400));
  }

  const { appId, appCertificate, callerUserId, receiverUserId } = req.body;

  if (appId === null || callerUserId === null || receiverUserId.length === 0) {
    return next(new ErrorResponse('Please provide the required fields (appId, callerUserId. receiverUserId)  ', 400));
  }

  try {
    // Generate Channel Name
    const channelName = randomstring.generate(12);

    console.log(`Channel Name ${channelName}`);

    // Generate Token
    const sessionToken = agoraCustomTokenGenerator(appId, appCertificate, channelName, callerUserId);

    console.log(`sessionToken ${sessionToken}`);

    req.body.channelName = channelName;
    req.body.sessionToken = sessionToken;
    req.body.deletedAt = null;

    // Save in database
    await AgoraVideoSession.create(req.body);

    console.log(`Agora Session info is successfully saved`);

    // Save these stuff
    res.status(200).json({
      success: true,
      data: {
        appId,
        appCertificate,
        channelName,
        token: sessionToken
      }
    });
  }
  catch (err) {
    console.log(`Server Error occurred in generating Channel Name and Token ${JSON.stringify(err.message)}`);
    return next(new ErrorResponse(err.message, 500));
  }
});
