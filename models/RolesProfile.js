const mongoose=require('mongoose');
Schema=mongoose.Schema;
const RoleProfileSchema=new Schema(
    { type : Schema.Types.Mixed}, 
    {strict: false});
module.exports = mongoose.model('RolesProfile',RoleProfileSchema);