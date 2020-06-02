// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
var twilio = require('twilio');
const sendSMS = async option => {

const accountSid =  process.env.ACCOUNT_SID;
const authToken =  process.env.AUTH_TOKEN;

// const client = new twilio(accountSid, authToken);
// console.log("sending sms--->>") 

// client.messages
//   .create({
//      body: option.message,
//      from:  process.env.SMS_NUMBER,
//      to: option.phone
//    })
//   .then(message =>{
//        console.log(message.sid)
      
//     })
//     .catch(error=> console.log(JSON.stringify(error)));
      
};

module.exports = sendSMS;
