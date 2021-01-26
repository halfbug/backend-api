const express = require('express');
const {
    getAgoraSessionChannelToken,
} = require('../controllers/agoraVideoSession');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
    .post('/channel/token', getAgoraSessionChannelToken)

module.exports = router;
