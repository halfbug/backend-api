const crypto = require('crypto');

// @desc do hashing.
exports.hashIt=(val)=>{
    return crypto.createHash('md5').update(val.toLowerCase()).digest('hex');
  }