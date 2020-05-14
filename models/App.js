const mongoose = require('mongoose');
const {hashIt} = require('../utils/helper')

const MediumSchema = new mongoose.Schema({
  channel: {
    type: String,
    trim: true,
    maxlength: 100
  },
  mkey:  String,
    
});

const AppSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique:[ true, 'App already present'],
    required: [true, 'Please add a title '],
    dropDups: true,
    maxlength: 100
  },
  medium: {
    type: [],
    
  },
  accessKey : String
  
});

AppSchema.pre('save', async function(next) {
//  console.log(this.medium)
//  console.log(this.medium[0].channel)
  this.accessKey = hashIt(this.name.toLowerCase());
  const arr =[];
  arr.push(this.medium.map((ele)=>{
    console.log(ele)
    // console.log(hashIt(this.name.toLowerCase()+"/"+ ele.channel.toLowerCase()))
    const mkey = hashIt(this.name.toLowerCase()+"/"+ ele.channel.toLowerCase());
    const rec = {channel:ele.channel, mkey}
    console.log(rec)
  return  (rec)
  })
  )
  this.medium=arr;
});

// function hashIt(val){
//   return crypto.createHash('md5').update(val).digest('hex');
// }

module.exports = mongoose.model('Apps', AppSchema);
