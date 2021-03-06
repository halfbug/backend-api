const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');
const { attachmentsRelatedTo } = require('../contstants/attachment');
const Attachment = require('../models/Attachment');
const User = require('../models/User');

// @desc      upload attachment
// @route     POST /api/v1/attachment/upload
// @access    Protected
exports.upload = asyncHandler(async (req, res, next) => {
  if (req.files) {
    console.log('file is attached');
    let record = {};
    Object.keys(req.files).forEach((key, i) => {
      const file = req.files[key];
      if (path.parse(file.name).ext > process.env.MAX_FILE_UPLOAD) {
        return next(
          new ErrorResponse(
            `Please upload an file less than ${process.env.MAX_FILE_UPLOAD}`,
            400
          )
        );
      }
      if (!attachmentsRelatedTo.kycDoc.includes(req.body.relatedTo)) {
        return next(
          new ErrorResponse(
            `Uploaded attachment is not related to any KYC document`,
            400
          )
        );
      }
      // Create custom filename
      const extension = path.parse(file.name).ext;
      const customName = `${Date.now()}_${path.parse(file.name).name.split('.')[0]}`;
      file.name = `${slugify(path.parse(file.name).name, { lower: true })}${extension}`;
      file.mv(`.${process.env.ATTACHMENT_UPLOD_PATH}/${customName}${extension}`, async err => {
        if (err) {
          console.error(err);
          return next(new ErrorResponse(`Problem with Document upload`, 500));
        }
      });
      record.userId = req.user._id;
      record.originalName = file.name.split('.')[0];
      record.customName = customName;
      record.extension = extension;
      record.mimeType = file.mimetype;
      record.size = file.size;
      record.relativePath = process.env.ATTACHMENT_UPLOD_PATH;
      record.relatedTo = req.body.relatedTo;

      Attachment.create(record);
    });
    const result = await User.findByIdAndUpdate(req.user._id, { isKycDocSubmitted: true }, {
      new: false,
      runValidators: true
    });
  }
  else {
    console.log('file is not attached')
    res.status(400).json({
      success: true,
      data: "KYC-Document(s) are not attached. Please attached them first"
    });
  }
  res.status(200).json({
    success: true,
    data: "KYC-Document is uploaded successfully. Will notify you once it is verified"
  });
});

// @desc      upload kyc attachments
// @route     POST /api/v1/attachment/upload/kyc
// @access    Protected
exports.uploadKycDocs = asyncHandler(async (req, res, next) => {

  if (req.files) {
    console.log(`file is attached`);
    let record = {};
    if (Array.isArray(req.files.file)) {
      req.files.file.forEach((key) => {
        if (path.parse(key.name).ext > process.env.MAX_FILE_UPLOAD) {
          return next(
            new ErrorResponse(
              `Please upload file less than ${process.env.MAX_FILE_UPLOAD}`,
              400
            )
          );
        }

        // Create custom filename
        const extension = path.parse(key.name).ext;
        const customName = `${Date.now()}_${path.parse(key.name).name.split('.')[0]}`;
        key.name = `${slugify(path.parse(key.name).name, { lower: true })}${extension}`;
        key.mv(`.${process.env.ATTACHMENT_UPLOD_PATH}/${customName}${extension}`, async err => {
          if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with uploaded Document`, 500));
          }
        });
        record.userId = req.user._id;
        record.originalName = key.name.split('.')[0];
        record.customName = customName;
        record.extension = extension;
        record.mimeType = key.mimetype;
        record.size = key.size;
        record.relativePath = process.env.ATTACHMENT_UPLOD_PATH;
        record.relatedTo = attachmentsRelatedTo.kycDoc[0];

        Attachment.create(record);

      });
    }
    else {
      Object.keys(req.files).forEach((key, i) => {
        const file = req.files[key]
        if (path.parse(file.name).ext > process.env.MAX_FILE_UPLOAD) {
          return next(
            new ErrorResponse(
              `Please upload file less than ${process.env.MAX_FILE_UPLOAD}`,
              400
            )
          );
        }
        // Create custom filename
        const extension = path.parse(file.name).ext;
        const customName = `${Date.now()}_${path.parse(file.name).name.split('.')[0]}`;
        file.name = `${slugify(path.parse(file.name).name, { lower: true })}${extension}`;
        file.mv(`.${process.env.ATTACHMENT_UPLOD_PATH}/${customName}${extension}`, async err => {
          if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with Document upload`, 500));
          }
        });
        record.userId = req.user._id;
        record.originalName = file.name.split('.')[0];
        record.customName = customName;
        record.extension = extension;
        record.mimeType = file.mimetype;
        record.size = file.size;
        record.relativePath = process.env.ATTACHMENT_UPLOD_PATH;
        record.relatedTo = attachmentsRelatedTo.kycDoc[0];

        Attachment.create(record);
      });
    }

    await User.findByIdAndUpdate(req.user._id, { isKycDocSubmitted: true }, {
      new: false,
      runValidators: true
    });
  }
  else {
    console.log('file is not attached')
    res.status(400).json({
      success: false,
      data: "KYC-Document(s) are not attached. Please attached them first"
    });
  }
  res.status(200).json({
    success: true,
    data: "KYC-Document(s) are uploaded successfully. Will notify you once it is verified"
  });
});

// @desc      view attachment
// @route     GET /api/v1/view/download
// @access    Protected
exports.view = asyncHandler(async (req, res, next) => {

  let attachment = await Attachment.findById(req.params.id);

  // const { file, mimeType } = await Image.download(id, res);
  // res.header('content-type', mimeType);
  // // res.send(file);

  if (attachment == false || attachment == undefined || attachment == null || attachment == "") {
    res.status(404).json({
      success: false,
      data: "NULL"
    });
  }

  const {
    customName, relativePath, extension, mimeType,
  } = attachment;

  console.log(`${process.cwd()}${relativePath}/${customName}${extension}`);

  const file = fs.readFileSync(`${process.cwd()}${relativePath}/${customName}${extension}`);

  res.header('content-type', mimeType);
  res.send(file);
});
