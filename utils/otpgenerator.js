

const OTPGenerator = ()=>{
return Math.floor(1000 + Math.random() * 9000) // for four
//Math.floor(100000 + Math.random() * 900000) // for six
} 
  
  module.exports = OTPGenerator;
  