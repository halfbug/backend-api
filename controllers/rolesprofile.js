const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const RolesProfile = require('../models/RolesProfile');
const Role = require('../models/Role');
const User = require('../models/User.js')
const path = require('path');
const slugify = require('slugify');

// @desc      Create Doctor
// @route     POST /api/v1/rp/doctor
// @access    Private/Admin
exports.addDoctor = asyncHandler(async (req, res, next) => {
     console.log(req.url)

     //get userid
     if (!req.user) {
      return next(new ErrorResponse(`User Not Found`, 404));
    }
     req.body.userId=req.user.id;

    //  const rp= await RolesProfile.findOne({userId : req.user.id})
    //  console.log(rp)
    //  if (rp ) {
    //   return next(new ErrorResponse(`User's doctor profile already present`, 400));
    // }

    //get role id
    const name = req.url.replace(/\//g, "")
    console.log(name)
    const role = await Role.findOne({name});
    if (!role) {
      return next(new ErrorResponse(`Role Not Found`, 404));
    }
    req.body.roleId=role._id
    // req.body.documents=[]
 
    const rp= await RolesProfile.findOne({userId : req.user.id, roleId : role._id })
    console.log(rp)
    if (rp ) {
     return next(new ErrorResponse(`User's ${name} profile already present`, 400));
   }
 
    //save to database
   let rolepro = await RolesProfile.create(req.body);
 
   //save files
    
    // console.log(req.files.medicalDoc)
    const docs = req.files.medicalDoc;
    let docsarr =[];
    docs.map(async (doc)=>{
      // Check filesize
            if (doc.size > process.env.MAX_FILE_UPLOAD) {
              return next(
                new ErrorResponse(
                  `Please upload an file less than ${process.env.MAX_FILE_UPLOAD}`,
                  400
                )
              );
            }
            console.log(path.parse(doc.name).name)

      // Create custom filename
          doc.name = `${rolepro._id}_${slugify(path.parse(doc.name).name, { lower: true })}${path.parse(doc.name).ext}`;

          doc.mv(`${process.env.FILE_UPLOAD_PATH}/${doc.name}`, async err => {
                if (err) {
                  console.error(err);
                  return next(new ErrorResponse(`Problem with Document upload`, 500));
                }
            });
            
            docsarr.push(doc.name);
            // await rolepro.documents.push(doc.name)
            
            
    });
// console.log(docsarr)
// console.log(rolepro._id)
// try{
      rolepro = await RolesProfile.findByIdAndUpdate(rolepro._id, 
        {
          "$push": {"documents": docsarr}
        },{new: true, safe: true, upsert: true }
        )
//   } catch(err) {console.log(err)};
await rolepro.save()
    res.status(201).json({
      success: true,
      data: rolepro
    });
  });
  

  // @desc      Get All Doctor
// @route     GET /api/v1/rp/doctor
// @access    Private/Admin
exports.getDoctors = asyncHandler(async (req, res, next) => {
  console.log(req.url)
  console.log("inside url ")
    //get role id
    const name = req.url.replace(/\//g, "")
    console.log(name)
    const role = await Role.findOne({name});
    if (!role) {
      return next(new ErrorResponse(`${name} Not Found`, 404));
    }
    
    const profiles = await RolesProfile.find({roleId : role._id})
    
    res.status(201).json({
      success: true,
      data: profiles
    });
});


// @desc      Create Patient
// @route     POST /api/v1/rp/patient
// @access    Private/Admin
exports.addPatient = asyncHandler(async (req, res, next) => {
  console.log(req.url)
  const name = req.url.replace(/\//g, "")

  //get userid
  if (!req.user) {
   return next(new ErrorResponse(`User Not Found`, 404));
 }
  req.body.userId=req.user.id;

  
 //get role id
 console.log(name)
 const role = await Role.findOne({name});
 if (!role) {
   return next(new ErrorResponse(`Role Not Found`, 404));
 }
 req.body.roleId=role._id


 const rp= await RolesProfile.findOne({userId : req.user.id, roleId : role._id })
  console.log(rp)
  if (rp ) {
   return next(new ErrorResponse(`User's ${name} profile already present`, 400));
 }

 // req.body.documents=[]
 //save to database
let rolepro = await RolesProfile.create(req.body);

res.status(201).json({
  success: true,
  data: rolepro
});
});

// @desc      Get All roleprofiles by role
// @route     GET /api/v1/rp/:role
// @access    Private/Admin
exports.getRps = asyncHandler(async (req, res, next) => {
   console.log("inside rps")
    //get role id
    const name = req.params.role
    console.log(name)
    const role = await Role.findOne({name});
    if (!role) {
      return next(new ErrorResponse(`${name} Not Found`, 404));
    }
    
    const profiles = await RolesProfile.find({roleId : role._id})
    .populate({
      path: 'userId',
    select: 'email isOnline phone',
    model: 'User'
    }).populate (
      {
        path : 'userId._id',
        select: 'firstName lastName',
        model: 'Profile'
      }
    )
    .exec();
    
    console.log(profiles)
    
    res.status(201).json({
      success: true,
      data: profiles
    });
});

// @desc      Get All roleprofile by role and id
// @route     GET /api/v1/rp/:role/:id
// @access    Private/Admin
exports.getRpById = asyncHandler(async (req, res, next) => {
   
  //get role id
  const name = req.params.role
  console.log(name)
  const role = await Role.findOne({name});
  if (!role) {
    return next(new ErrorResponse(`${name} Not Found`, 404));
  }
  const userId = req.params.id 
  const profiles = await RolesProfile.find({roleId : role._id, userId })
  res.status(201).json({
    success: true,
    data: profiles
  });
});

// @desc      Create Role profile
// @route     POST /api/v1/rp/patient
// @access    Private/Admin
exports.addRp = asyncHandler(async (req, res, next) => {
  console.log(req.url)
   const name = req.params.role
    console.log(name)
    
    const role = await Role.findOne({name});
    if (!role) {
      return next(new ErrorResponse(`${name} Not Found`, 404));
    }
    req.body.roleId=role._id

  //get userid
  if (!req.user) {
   return next(new ErrorResponse(`User Not Found`, 404));
 }
 
  req.body.userId=req.user.id;

  
 //get role id


 const rp= await RolesProfile.findOne({userId : req.user.id, roleId : role._id })
  console.log(rp)
  if (rp ) {
   return next(new ErrorResponse(`User's ${name} profile already present`, 400));
 }
const values = {};
 Object.keys(req.body).forEach((key, i) => {
  try { values[key]=JSON.parse(req.body[key]) } catch(e) { values[key] = req.body[key] }
  
 });
 // req.body.documents=[]
 //save to database
let rolepro = await RolesProfile.create(values);
let documents =[];
//save documents
//save files''
console.log(req.files)
  if(req.files)  
  Object.keys(req.files).forEach((key, i) => {
      const file = req.files[key]
      console.log("----------------")
      console.log(key)
      console.log(file)
      if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
          new ErrorResponse(
            `Please upload an file less than ${process.env.MAX_FILE_UPLOAD}`,
            400
          )
        );
      }
      console.log(path.parse(file.name).name)
       // Create custom filename
       file.name = `${rolepro._id}_${slugify(path.parse(file.name).name, { lower: true })}${path.parse(file.name).ext}`;

       file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
             if (err) {
               console.error(err);
               return next(new ErrorResponse(`Problem with Document upload`, 500));
             }
         });
  
         documents.push({type : key , file : file.name});
      
    })
    console.log(rolepro._id)
// try{
      rolepro = await RolesProfile.findByIdAndUpdate(rolepro._id, 
        {
          "$push": {"documents": documents}
        },{new: true, safe: true, upsert: true }
        )
console.log(documents)
        await rolepro.save();

res.status(201).json({
  success: true,
  data: rolepro
}); 
});
