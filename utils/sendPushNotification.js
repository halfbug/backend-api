
const sendPushNotification = (data, ids, options, api) => {
    api.sendPushNotification(data, ids, options, function (err, id) {
        // Request failed or Success?
        if (err) {
            console.log(`error in sending push notification ${err}`);
        } else {
            console.log(`Notication sent successfully ${id}`);
        }
    });
};

module.exports = sendPushNotification;
