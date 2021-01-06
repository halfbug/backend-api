const express = require('express');
const { protect } = require('../middleware/auth');
const {
  upload,
  view,
  uploadKycDocs
} = require('../controllers/attachment');

const router = express.Router({ mergeParams: true });

router.use(protect);
// router.use(authorize('admin'));

router.post('/upload', upload);
router.post('/upload/kyc', uploadKycDocs); // multiple docs can be uploaded
router.get('/view/:id', view);

module.exports = router;
