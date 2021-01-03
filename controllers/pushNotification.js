const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const ObjectId = require('mongoose').Types.ObjectId;

const Pushy = require('pushy');

// @desc      Get wallet details of user in array
// @route     GET /api/v1/user/wallet
// @access    Private/Authorized User
exports.getUserWallet = asyncHandler(async (req, res, next) => {
    console.log(`request ${req.user._id}`)
    const userData = await User.findOne({ '_id': ObjectId(req.user._id) });
    console.log(userData);
    if (userData.isKycDocVerified) {
        const userWallet = await Wallet.findOne({ 'userId': ObjectId(userData._id) });
        console.log(`Date ${userWallet}`);
        if (!userWallet) {
            res.status(200).json({
                success: 'User does not have the Wallet yet',
                data: userWallet
            });
        } else {
            res.status(200).json({
                success: 'Successfully fetched the User Wallet',
                data: userWallet
            });
        }
    }
    else {
        // 'User not authorized to access the wallets details. Need to attach KYC documents'
        res.status(401).json({
            success: false,
            data: []
        });
    }
});

// sad6796af.cua4gain@gmail.com

// @desc      Create user wallet (a temporary API as requirements are not clear)
// @route     POST /api/v1/user/wallet
// @access    Private/Authorized User
exports.notifyUserAboutWalletCreated = asyncHandler(async (req, res, next) => {

    console.log(`${req.body}`);

    const { userId, notificationMessage } = req.body;

    // Get device-id of provided User from the User table
    // Use Pushy npm to send the push notification with the provided payload

    const userData = await User.findById(userId);

    console.log(`User ${userData.deviceIds}`);

    // No devices registered yet?
    if (userData.deviceIds.length === 0) {
        return res.status(500).json({
            success: false,
            data: 'Please register the device for the provided User before attempting to send any notification.'
        });
    }

    const api = new Pushy(process.env.PUSHY_SECRET_API_KEY);

    // Set push payload data to deliver to devices
    var data = {
        message: notificationMessage
    };

    // Set sample iOS notification fields
    var options = {
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
            data: 'User is successfully notified on its Device'
        });
    });
});