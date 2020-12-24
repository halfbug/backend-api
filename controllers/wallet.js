const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const ObjectId = require('mongoose').Types.ObjectId; 

// @desc      Get wallet details of user in array
// @route     GET /api/v1/user/wallet
// @access    Private/Authorized User
exports.getUserWallet = asyncHandler(async (req, res, next) => {
    console.log(`request ${req.user._id}`)
    const userData = await User.findOne({'_id': ObjectId(req.user._id)});
    console.log(userData);
    if (userData.isKycDocVerified) {
        const userWallet = await Wallet.findOne({ 'userId': ObjectId(userData._id) });
        console.log(`Date ${userWallet}`);
        if(!userWallet) {
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
exports.createUserWallet = asyncHandler(async (req, res, next) => {
    console.log(`${req.body}`);
    const userWallet = await Wallet.create(req.body);

    res.status(201).json({
        success: true,
        data: userWallet
    });
});