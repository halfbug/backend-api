const crypto = require('crypto');
const { default: axios } = require('axios');

// @desc do hashing.
exports.hashIt = (val) => {
  return crypto.createHash('md5').update(val.toLowerCase()).digest('hex');
}

module.exports.addUserToChatDb = async (user) => {
  let url = `${process.env.MESSAGING_CHAT_SERVER_URL_LIVE}/api/v1/user/add/chat/db`;
  axios.post(url,
    {
      "userId": user.id,
      "name": user.email,
      "email": user.email,
      "phone": user.phone,
      "qrCode": user.id
    })
    .then(async function (response) {
      console.log(`Logging the Add User to Chat DB API Call Success Response`)
      return;
    }).catch(function (err) {
      console.log(`Logging the Add User to Chat DB API Call Error Response`)
      return;
    });
};

module.exports.updateLoginStatusOnChatServer = async (userId) => {

  //## Updating User login status on the Chat DB as well
  let url = `${process.env.MESSAGING_CHAT_SERVER_URL_LIVE}/api/v1/login/status/update?userId=${userId}`;
  axios.post(url)
    .then(async function (response) {
      console.log(`Logging the Update Login Status API Call Success Response`)
      return;
    }).catch(function (err) {
      console.log(`Logging the Update Login Status API Call Error Response`)
      return;
    });
};

module.exports.updateLogoutStatusOnChatServer = async (userId) => {
  // ## Updating User Logout status on the Chat DB as well
  let url = `${process.env.MESSAGING_CHAT_SERVER_URL_LIVE}/api/v1/logout/status/update?userId=${userId}`;
  axios.post(url)
    .then(async function (response) {
      console.log(`Logging the Update Logout Status API Call Success Response`)
      return;
    }).catch(function (err) {
      console.log(`Logging the Update Logout Status API Call Error Response`)
      return;
    });
};