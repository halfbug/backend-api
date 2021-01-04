const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const ObjectId = require('mongoose').Types.ObjectId;

const Pushy = require('pushy');

// @desc      Notify User About Wallet Created
// @route     POST /api/v1/notification/wallet/created
// @access    Private/Authorized User may be administrator
exports.walletCreated = asyncHandler(async (req, res, next) => {

    const { userId, notificationMessage } = req.body;

    // Get device-id of provided User from the User table
    // Use Pushy npm to send the push notification with the provided payload

    const userData = await User.findById(userId);

    if (userData === undefined || userData === null) {
        return res.status(400).json({
            success: false,
            data: 'User not found.'
        });
    }


    // No devices registered yet?
    if (userData.deviceIds.length === 0) {
        return res.status(500).json({
            success: false,
            data: 'Please register the device for the provided User before attempting to send any notification.'
        });
    }

    const api = new Pushy(process.env.PUSHY_SECRET_API_KEY);

    // Set push payload data to deliver to devices
    const data = {
        message: notificationMessage
    };

    // Set sample iOS notification fields
    const options = {
        notification: {
            badge: 1,
            sound: null,
            body: null
        },
    };

    // Send push notification
    api.sendPushNotification(data, userData.deviceIds, options, function (err, id) {
        // Request failed?
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                data: 'Internal Server Error occurred'
            });
        }

        // Push sent successfully
        return res.status(201).json({
            success: true,
            pushId: id,
            data: 'User is successfully notified on his / her Device'
        });
    });
});


// @desc      Notify Sender & Receiver about Instant message sent / received
// @route     POST /api/v1/notification/instant/message
// @access    Private/Authorized User
exports.instantMessageSentReceived = asyncHandler(async (req, res, next) => {

    const { senderId, receiverId, senderMessage, receiverMessage } = req.body;

    // Get device-ids of provided Sender and Receiver from the User table
    // Use Pushy npm to send the push notification with the provided payload

    const userData = await User.find({ $or: [{ '_id': ObjectId(senderId) }, { '_id': ObjectId(receiverId) }] });

    console.log(`User Data ${JSON.stringify(userData)}`);

    if (userData.length === 0) {
        return res.status(400).json({
            success: false,
            data: 'Users not exist'
        });
    }
    const api = new Pushy(process.env.PUSHY_SECRET_API_KEY);

    userData.map((record) => {
        // sender Part
        if (record._id == senderId) {

            console.log(`Sender Part`);

            if (record.deviceIds.length > 0) {
                // Set push payload data to deliver to devices
                const data = {
                    message: senderMessage
                };

                // Set sample iOS notification fields
                const options = {
                    notification: {
                        badge: 1,
                        sound: null,
                        body: null
                    },
                };

                // Send push notification
                api.sendPushNotification(data, record.deviceIds, options, function (err, id) {
                    // Request failed?
                    if (err) {
                        console.log(`Error occurred in sending push`);
                    }
                });
            }
        }

        // receiver Part
        if (record._id == receiverId) {
            console.log(`Receiver Part`);
            if (record.deviceIds.length > 0) {
                // Set push payload data to deliver to devices
                const data = {
                    message: receiverMessage
                };

                // Set sample iOS notification fields
                const options = {
                    notification: {
                        badge: 1,
                        sound: null,
                        body: null
                    },
                };

                // Send push notification
                api.sendPushNotification(data, record.deviceIds, options, function (err, id) {
                    // Request failed?
                    if (err) {
                        console.log(`Error occurred in sending push`);
                    }
                });
            }
        }
    });

    // Push sent successfully
    return res.status(201).json({
        success: true,
        data: 'Sender and Receivers are successfully notified on their Devices'
    });
});

// @desc      Notify Receiver About Consume sents the payment
// @route     POST /api/v1/notification/payment/sent
// @access    Private/Authorized User
exports.paymentSent = asyncHandler(async (req, res, next) => {

    const { userId, notificationMessage } = req.body;

    // Get device-id of provided User from the User table
    // Use Pushy npm to send the push notification with the provided payload

    const userData = await User.findById(userId);

    console.log(`User ${userData.deviceIds}`);

    if (userData === undefined || userData === null) {
        return res.status(400).json({
            success: false,
            data: 'User not found.'
        });
    }

    // No devices registered yet?
    if (userData.deviceIds.length === 0) {
        return res.status(500).json({
            success: false,
            data: 'Please register the device for the provided User before attempting to send any notification.'
        });
    }

    const api = new Pushy(process.env.PUSHY_SECRET_API_KEY);

    // Set push payload data to deliver to devices
    const data = {
        message: notificationMessage
    };

    // Set sample iOS notification fields
    const options = {
        notification: {
            badge: 1,
            sound: null,
            body: null
        },
    };

    // Send push notification
    api.sendPushNotification(data, userData.deviceIds, options, function (err, id) {
        // Request failed?
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                data: 'Internal Server Error occurred'
            });
        }

        // Push sent successfully
        return res.status(201).json({
            success: true,
            pushId: id,
            data: 'Receiver is successfully notified on his / her Device'
        });
    });
});