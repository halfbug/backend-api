const sendPushNotification = require('../utils/sendPushNotification');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Role = require('../models/Role');
const ObjectId = require('mongoose').Types.ObjectId;

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
    await sendPushNotification(data, userData.deviceIds, options);

    return res.status(201).json({
        success: true,
        // pushId: id,
        data: 'User is successfully notified on his / her Device'
    });
});


// @desc      Notify Sender & Receiver about Instant message sent / received
// @route     POST /api/v1/notification/consumer/seller/instant/message
// @access    Private/Authorized User
exports.consumerSellerInstantMessageSentReceived = asyncHandler(async (req, res, next) => {

    const { senderId, receiverId, senderNotificationMessage, receiverNotificationMessage } = req.body;

    // Get device-ids of provided Sender and Receiver from the User table
    // Use Pushy npm to send the push notification with the provided payload

    const userData = await User.find({ $or: [{ '_id': ObjectId(senderId) }, { '_id': ObjectId(receiverId) }] });

    console.log(`User Data ${JSON.stringify(userData)}`);

    if (userData.length === 0) {
        return res.status(400).json({
            success: false,
            data: 'Users does not exist'
        });
    }

    const allSenderIds = [];
    const allReceiverIds = [];

    userData.map((record) => {
        // sender Part
        if (record._id == senderId) {
            console.log(`Sender Part`);
            if (record.deviceIds.length > 0) {
                record.deviceIds.forEach((id) => {
                    allSenderIds.push(id);
                });
            }
        }

        // receiver Part
        if (record._id == receiverId) {
            console.log(`Receiver Part`);
            if (record.deviceIds.length > 0) {
                record.deviceIds.forEach((id) => {
                    allReceiverIds.push(id);
                });
            }
        }
    });

    if (allSenderIds.length > 0) {
        // Send push notification to Senders
        await sendPushNotification({
            message: senderNotificationMessage
        }, allSenderIds, {
            notification: {
                badge: 1,
                sound: null,
                body: null
            },
        });
    }

    if (allReceiverIds.length > 0) {
        // Send push notification to Receivers
        await sendPushNotification({
            message: receiverNotificationMessage
        }, allReceiverIds, {
            notification: {
                badge: 1,
                sound: null,
                body: null
            },
        });
    }

    // Push sent successfully
    return res.status(201).json({
        success: true,
        data: 'Sender and Receivers are successfully notified on their Devices'
    });
});

// @desc      Notify Receiver About Consumer sents the payment
// @route     POST /api/v1/notification/consumer/seller/payment/sent
// @access    Private/Authorized User
exports.consumerSellerPaymentSent = asyncHandler(async (req, res, next) => {

    const { sellerId, notificationMessage } = req.body;

    const roleData = await Role.findOne({ "name": "seller" });

    if (!roleData) {
        return res.status(500).json({
            success: false,
            data: 'Seller Role does not exist'
        });
    }

    // Get device-id of provided User from the User table
    // Use Pushy npm to send the push notification with the provided payload

    const userData = await User.findOne({
        $and: [{ "_id": ObjectId(sellerId) }, { "roles": { $in: ObjectId(roleData._id) } }]
    });

    if (userData === undefined || userData === null) {
        return res.status(400).json({
            success: false,
            data: 'User not found or User is not a seller.'
        });
    }

    // No devices registered yet?
    if (userData.deviceIds.length === 0) {
        return res.status(500).json({
            success: false,
            data: 'Please register the device for the provided User before attempting to send any notification.'
        });
    }

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
    await sendPushNotification(data, userData.deviceIds, options);

    return res.status(201).json({
        success: true,
        data: 'Seller is successfully notified on his / her Device'
    });
});

// @desc      Notify Customers about the Re-fill of Stock
// @route     POST /api/v1/notification/customer/stock/refill
// @access    Private/Authorized User
exports.customerRefillStockNotification = asyncHandler(async (req, res, next) => {

    const { notificationMessage } = req.body;

    // Get device-id of provided User from the User table
    // Use Pushy npm to send the push notification with the provided payload

    // first fetch objectId of consumer role then 
    // use find query with where in clause
    // to find the accurate User

    const roleData = await Role.findOne({ "name": "customer" });

    if (!roleData) {
        return res.status(500).json({
            success: false,
            data: 'Customer role does not exist'
        });
    }

    const userData = await User.find({ "roles": { $in: ObjectId(roleData._id) } });

    if (userData.length === 0) {
        return res.status(500).json({
            success: false,
            data: 'Customers does not exist'
        });
    }

    allDeviceIds = [];

    userData.forEach((item) => {
        if (item.deviceIds.length > 0) {
            item.deviceIds.forEach((deviceId) => {
                allDeviceIds.push(deviceId);
            });
        } else { console.log(`Device Id not exist for this user ${item.email}`); }
    });

    console.log(`allDeviceIds.length ${allDeviceIds.length}`);

    if (allDeviceIds.length > 0) {

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
        await sendPushNotification(data, allDeviceIds, options);
    }

    console.log('sending final response');

    // Push sent successfully
    return res.status(201).json({
        success: true,
        data: 'Customers are successfully notified on their Devices'
    });
});

// @desc      Notify Seller about purchase made by the Customer
// @route     POST /api/v1/notification/customer/purchase/made
// @access    Private/Authorized User
exports.customerPurchaseMadeNotification = asyncHandler(async (req, res, next) => {

    // customer id to fetch the customer name
    const { sellerId, customerName, notificationMessage } = req.body;

    // Get device-id of provided User from the User table
    // Use Pushy npm to send the push notification with the provided payload

    const roleData = await Role.findOne({ "name": "seller" });

    if (!roleData) {
        return res.status(500).json({
            success: false,
            data: 'Seller role does not exist'
        });
    }

    const sellerData = await User.findOne({
        $and: [{ _id: ObjectId(sellerId) }, { "roles": { $in: ObjectId(roleData._id) } }]
    });

    if (!sellerData) {
        return res.status(400).json({
            success: false,
            data: 'Seller does not exist.'
        });
    }

    if (!sellerData.deviceIds.length === 0) {
        return res.status(500).json({
            success: false,
            data: 'Please register the device for the provided Seller before attempting to send any notification.'
        });
    }
    
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
    await sendPushNotification(data, sellerData.deviceIds, options);

    // Push sent successfully
    return res.status(201).json({
        success: true,
        data: 'Seller is successfully notified on their Devices'
    });
});

// Query Required from Pieter
// @desc      Notify Patient about the Payment Receive
// @route     POST /api/v1/notification/patient/payment-receive
// @access    Private/Authorized User
exports.patientPaymentReceiveNotification = asyncHandler(async (req, res, next) => {

    // customer id to fetch the customer name
    const { sellerId, customerId, notificationMessage } = req.body;

    // Get device-id of provided User from the User table
    // Use Pushy npm to send the push notification with the provided payload

    // first fetch objectId of consumer role then 
    // use find query with where in clause
    // to find the accurate User

    const customerProfile = await Profile.find({ userId: ObjectId(customerId) });

    if (!customerProfile) {
        return res.status(400).json({
            success: false,
            data: 'Customer not found.'
        });
    }

    // first fetch objectId of consumer role then 
    // use find query with where in clause
    // to find the accurate User

    const seller = await User.find(sellerId);

    if (!seller) {
        return res.status(400).json({
            success: false,
            data: 'Seller not found.'
        });
    }

    if (!seller.deviceIds.length === 0) {
        return res.status(500).json({
            success: false,
            data: 'Please register the device for the provided Seller before attempting to send any notification.'
        });
    }
    // Push sent successfully
    return res.status(201).json({
        success: true,
        pushId: id,
        data: 'Seller is successfully notified on their Devices'
    });
});


// Ed 18 
// @desc      Notify User about the Free Course on Google Class Room
// @route     POST /api/v1/notification/free/course
// @access    Private/Authorized User
exports.freeCourseNotification = asyncHandler(async (req, res, next) => {
    const { notificationMessage } = req.body;

    // Get device-id of provided User from the User table
    // Use Pushy npm to send the push notification with the provided payload

    // first fetch objectId of student role then 
    // use find query to fetch all student deviceIds

    const roleData = await Role.findOne({ "name": "student" });

    if (!roleData) {
        return res.status(500).json({
            success: false,
            data: 'Student role is not defined'
        });
    }
    const userData = await User.find({ "roles": { $in: ObjectId(roleData._id) } });

    if (userData.length === 0) {
        return res.status(400).json({
            success: false,
            data: 'Users are not found.'
        });
    }

    console.log(`User Data ${JSON.stringify(userData)}`);

    const allDeviceIds = [];

    userData.forEach((item) => {
        console.log(`Iterating on each User ${item.email}`);

        // No devices registered yet?
        if (item.deviceIds.length > 0) {

            console.log(`device ids are available`);

            item.deviceIds.forEach((deviceId) => {
                console.log(`Iterating on the device id of each User`);
                allDeviceIds.push(deviceId);
            });
        }
        else {
            console.log(`device ids are not available`);
        }
    });

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

    if (allDeviceIds.length > 0) {
        // Send push notification
        await sendPushNotification(data, allDeviceIds, options);
    }

    console.log('sending final response');

    // Push sent successfully
    return res.status(201).json({
        success: true,
        data: 'Students are successfully notified on their Devices'
    });
});
