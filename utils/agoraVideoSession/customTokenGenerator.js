const RtcTokenBuilder = require('./rTCTokenBuilder').RtcTokenBuilder;

module.exports.agoraCustomTokenGenerator = (appID, appCertificate, channelName, uid) => {
    const expirationTimeInSeconds = 3600

    const currentTimestamp = Math.floor(Date.now() / 1000)

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

    // Build token with uid
    const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, null, privilegeExpiredTs);
    console.log("Token With Integer Number Uid: " + token);
    return token;
};