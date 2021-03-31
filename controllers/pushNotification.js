const sendPushNotification = require('../utils/sendPushNotification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Role = require('../models/Role');
const App = require('../models/App');
const ObjectId = require('mongoose').Types.ObjectId;
const Pushy = require('pushy');

// @desc      Notify User About Wallet Created
// @route     POST /api/v1/notification/wallet/created
// @access    Private/Authorized User may be administrator
exports.walletCreated = asyncHandler(async (req, res, next) => {

    const { userId, notificationMessage } = req.body;

    //Validation
    if (!userId || !notificationMessage) {
        return next(new ErrorResponse('userId, notificationMessage and app are mandatory to pass', 400));
    }

    // Get device-id of provided User from the User table
    // Use Pushy npm to send the push notification with the provided payload

    const userData = await User.findById(userId);

    // No devices registered yet?
    if (userData.deviceIds.length === 0) {
        return res.status(500).json({
            success: false,
            data: 'Please register the device for the provided User before attempting to send any notification.'
        });
    }

    if (userData === undefined || userData === null) {
        return res.status(500).json({
            success: false,
            data: 'User not found.'
        });
    }

    const rolesData = await Role.find({ "_id": { $in: userData.roles } });

    if (rolesData.length === 0) {
        return res.status(500).json({
            success: false,
            data: 'Role not found'
        });
    }

    const appIds = [];

    rolesData.forEach((item) => {
        appIds.push(ObjectId(item.appId));
    });

    const appsData = await App.find({ "_id": { $in: appIds } });

    if (appsData.length === 0) {
        return res.status(500).json({
            success: false,
            data: 'Apps not found'
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

    let api = null;

    appsData.forEach((app) => {

        console.log(`app is ${app.name}`);

        if (app.name == 'bigmudi') {
            api = new Pushy(process.env.PUSHY_SECRET_API_KEY_BIG_MUDI);
        }

        if (app.name == 'blockm') {
            api = new Pushy(process.env.PUSHY_SECRET_API_KEY_BLOCK_M);
        }

        if (app.name == 'blocked') {
            api = new Pushy(process.env.PUSHY_SECRET_API_KEY_BLOCK_ED);
        }

        if (app.name == 'blockmed') {
            api = new Pushy(process.env.PUSHY_SECRET_API_KEY_BLOCK_MED);
        }

        if (app.name == 'blockride') {
            api = new Pushy(process.env.PUSHY_SECRET_API_KEY_BLOCK_RIDE);
        }

        // Send push notification
        sendPushNotification(data, userData.deviceIds, options, api);       
    });

    return res.status(200).json({
        success: true,
        // pushId: id,
        data: 'User is successfully notified on his / her Device'
    });
});

// @desc      Notify Customer & Seller about Instant message sent / received.
// @route     POST /api/v1/notification/customer/seller/instant/message
// @access    Private/Authorized User
exports.customerSellerInstantMessageSentReceived = asyncHandler(async (req, res, next) => {

    const { senderId, receiverId, senderNotificationMessage, receiverNotificationMessage } = req.body;

    //Validation
    if (!senderId || !receiverId || !senderNotificationMessage || !receiverNotificationMessage) {
        return next(new ErrorResponse(`senderId, receiverId, senderNotificationMessage and notificationMessage are mandatory to pass`, 400));
    }

    // Get device-ids of provided Sender and Receiver from the User table
    // Use Pushy npm to send the push notification with the provided payload

    const userData = await User.find({ $or: [{ '_id': ObjectId(senderId) }, { '_id': ObjectId(receiverId) }] });

    console.log(`User Data ${JSON.stringify(userData)}`);

    if (userData.length === 0) {
        return res.status(500).json({
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

    const api = new Pushy(process.env.PUSHY_SECRET_API_KEY_BIG_MUDI);

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
        }, api);
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
        }, api);
    }

    // Push sent successfully
    return res.status(200).json({
        success: true,
        data: 'Sender and Receivers are successfully notified on their Devices'
    });
});

// @desc      Notify Receiver About Consumer sents the payment
// @route     POST /api/v1/notification/customer/seller/payment/sent
// @access    Private/Authorized User
exports.customerSellerPaymentSent = asyncHandler(async (req, res, next) => {

    const { sellerId, notificationMessage } = req.body;

    //Validation
    if (!sellerId || !notificationMessage) {
        return next(new ErrorResponse('sellerId and notificationMessage are mandatory to pass', 400));
    }

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
        return res.status(500).json({
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

    const api = new Pushy(process.env.PUSHY_SECRET_API_KEY_BIG_MUDI);

    // Send push notification
    await sendPushNotification(data, userData.deviceIds, options, api);

    return res.status(200).json({
        success: true,
        data: 'Seller is successfully notified on his / her Device'
    });
});

// @desc      Notify Customers about the Re-fill of Stock
// @route     POST /api/v1/notification/customer/stock/refill
// @access    Private/Admin User
exports.customerRefillStockNotification = asyncHandler(async (req, res, next) => {

    const { notificationMessage } = req.body;

    //Validation
    if (!notificationMessage) {
        return next(new ErrorResponse('notificationMessage is mandatory to pass', 400));
    }

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

        const api = new Pushy(process.env.PUSHY_SECRET_API_KEY_BIG_MUDI);

        // Send push notification
        await sendPushNotification(data, allDeviceIds, options, api);
    }

    console.log('sending final response');

    // Push sent successfully
    return res.status(200).json({
        success: true,
        data: 'Customers are successfully notified on their Devices'
    });
});

// @desc      Notify Seller about purchase made by the Customer
// @route     POST /api/v1/notification/customer/purchase/made
// @access    Private/Authorized User
exports.customerPurchaseMadeNotification = asyncHandler(async (req, res, next) => {

    // customer id to fetch the customer name
    const { sellerId, notificationMessage } = req.body;

    //Validation
    if (!sellerId || !notificationMessage) {
        return next(new ErrorResponse('sellerId and notificationMessage are mandatory to pass', 400));
    }

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
        return res.status(500).json({
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

    const api = new Pushy(process.env.PUSHY_SECRET_API_KEY_BIG_MUDI);

    // Send push notification
    await sendPushNotification(data, sellerData.deviceIds, options, api);

    // Push sent successfully
    return res.status(200).json({
        success: true,
        data: 'Seller is successfully notified on their Devices'
    });
});

// @desc      Notify Patient about the Payment Receive
// @route     POST /api/v1/notification/patient/payment/receive
// @access    Admin User
exports.patientPaymentReceiveNotification = asyncHandler(async (req, res, next) => {
    // customer id to fetch the customer name
    const { patientId, notificationMessage } = req.body;

    //Validation
    if (!patientId || !notificationMessage) {
        return next(new ErrorResponse('patientId and notificationMessage are  mandatory to pass', 400));
    }

    // Get device-id of provided User from the User table
    // Use Pushy npm to send the push notification with the provided payload

    const roleData = await Role.findOne({ "name": "patient" });

    if (!roleData) {
        return res.status(500).json({
            success: false,
            data: 'Patient role does not exist'
        });
    }

    const patientData = await User.findOne({
        $and: [{ _id: ObjectId(patientId) }, { "roles": { $in: ObjectId(roleData._id) } }]
    });

    if (!patientData) {
        return res.status(500).json({
            success: false,
            data: 'Patient does not exist.'
        });
    }

    if (!patientData.deviceIds.length === 0) {
        return res.status(500).json({
            success: false,
            data: 'Please register the device for the provided Patient before attempting to send any notification.'
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

    const api = new Pushy(process.env.PUSHY_SECRET_API_KEY_BLOCK_MED);

    // Send push notification
    await sendPushNotification(data, patientData.deviceIds, options, api);

    // Push sent successfully
    return res.status(200).json({
        success: true,
        data: 'Patient is successfully notified on their Devices'
    });
});

// @desc      Notify User about the Free Course on Google Class Room
// @route     POST /api/v1/notification/free/course
// @access    Admin User
exports.freeCourseNotification = asyncHandler(async (req, res, next) => {
    const { notificationMessage } = req.body;

    if (!notificationMessage) {
        return next(new ErrorResponse('notificationMessage is mandatory to pass', 400));
    }

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
        return res.status(500).json({
            success: false,
            data: 'Users are not found.'
        });
    }

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
        const api = new Pushy(process.env.PUSHY_SECRET_API_KEY_BLOCK_ED);
        await sendPushNotification(data, allDeviceIds, options, api);
    }

    console.log('sending final response');

    // Push sent successfully
    return res.status(200).json({
        success: true,
        data: 'Students are successfully notified on their Devices'
    });
});

// @desc      Notify Teacher & Student about Instant message sent / received
// @route     POST /api/v1/notification/teacher/student/instant/message
// @access    Private/Authorized User
exports.teacherStudentInstantMessageSentReceived = asyncHandler(async (req, res, next) => {

    const { senderId, receiverId, senderNotificationMessage, receiverNotificationMessage } = req.body;

    //Validation
    if (!senderId || !receiverId || !senderNotificationMessage || !receiverNotificationMessage) {
        return next(new ErrorResponse(`senderId, receiverId, senderNotificationMessage and notificationMessage are mandatory to pass`, 400));
    }

    // Get device-ids of provided Sender and Receiver from the User table
    // Use Pushy npm to send the push notification with the provided payload

    const userData = await User.find({ $or: [{ '_id': ObjectId(senderId) }, { '_id': ObjectId(receiverId) }] });

    if (userData.length === 0) {
        return res.status(500).json({
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

    const api = new Pushy(process.env.PUSHY_SECRET_API_KEY_BLOCK_ED);

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
        }, api);
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
        }, api);
    }

    // Push sent successfully
    return res.status(200).json({
        success: true,
        data: 'Sender and Receivers are successfully notified on their Devices'
    });
});

// @desc      Notify Patient sends the Instant message to the Doctor or vice versa
// @route     POST /api/v1/notification/doctor/patient/instant/message
// @access    Private/Authorized User
exports.doctorPatientInstantMessageSentReceived = asyncHandler(async (req, res, next) => {

    const { senderId, receiverId, senderNotificationMessage, receiverNotificationMessage } = req.body;

    //Validation
    if (!senderId || !receiverId || !senderNotificationMessage || !receiverNotificationMessage) {
        return next(new ErrorResponse(`senderId, receiverId, senderNotificationMessage and notificationMessage are mandatory to pass`, 400));
    }

    // Get device-ids of provided Sender and Receiver from the User table
    // Use Pushy npm to send the push notification with the provided payload

    const userData = await User.find({ $or: [{ '_id': ObjectId(senderId) }, { '_id': ObjectId(receiverId) }] });

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

    const api = new Pushy(process.env.PUSHY_SECRET_API_KEY_BLOCK_MED);

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
        }, api);
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
        }, api);
    }

    // Push sent successfully
    return res.status(200).json({
        success: true,
        data: 'Sender and Receivers are successfully notified on their Devices'
    });
});