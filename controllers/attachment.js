const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');
const slugify = require('slugify');
// const User = require('../models/User');


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'attachments/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });

// const upload = multer({ storage });


// @desc      upload attachment
// @route     POST /api/v1/attachment/upload
// @access    Public
exports.upload = asyncHandler(async (req, res, next) => {
  console.log(req.files)
  if (req.files) {
    console.log('file is uploaded');
    Object.keys(req.files).forEach((key, i) => {
      const file = req.files[key]
      console.log("----------------")
      console.log(key)
      console.log(file)
      // if (path.parse(file.name).ext > process.env.MAX_FILE_UPLOAD) {
      //   return next(
      //     new ErrorResponse(
      //       `Please upload an file less than ${process.env.MAX_FILE_UPLOAD}`,
      //       400
      //     )
      //   );
      // }
      // if (file.size > process.env.MAX_FILE_UPLOAD) {
      //   return next(
      //     new ErrorResponse(
      //       `Please upload an file less than ${process.env.MAX_FILE_UPLOAD}`,
      //       400
      //     )
      //   );
      // }
      console.log(path.parse(file.name).name)
      // Create custom filename
      file.name = `${slugify(path.parse(file.name).name, { lower: true })}${path.parse(file.name).ext}`;

      file.mv(`${process.env.ATTACHMENT_UPLOD_PATH}/${file.name}`, async err => {
        if (err) {
          console.error(err);
          return next(new ErrorResponse(`Problem with Document upload`, 500));
        }
      });
      console.log('call the db model to insert the data now');

    });
  }
  else {
    console.log('file is not uploaded')
  }

  // const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: "KYC-Document is uploaded successfully. Will notify you once it is verified"
  });
});

// @desc      download attachment
// @route     POST /api/v1/attachment/download
// @access    Public
exports.download = asyncHandler(async (req, res, next) => {
  console.log(req.body)
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});
