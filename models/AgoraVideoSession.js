const mongoose = require('mongoose');

const AgoraVideoSessionSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: [true, 'Please add the channel name'],
    },
    appCertificate: {
        type: String,
        required: [true, 'Please add the app certificate'],
    },
    appId: {
        type: String,
        required: [true, 'Please add the app id'],
    },
    sessionToken: {
        type: String,
        required: [true, 'Please add the token'],
    },
    callerUserId: {
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required: [true, 'Please add caller user id'],
    },
    receiverUserId: {
        type: [mongoose.Schema.ObjectId],
        ref:'User',
        required: [true, 'Please add the receiver id at least 1'],
    },
    deletedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AgoraVideoSession', AgoraVideoSessionSchema);
