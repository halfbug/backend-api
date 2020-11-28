const express = require('express');
const {
  upload,
  download,
} = require('../controllers/attachment');

const router = express.Router({ mergeParams: true });

// router.use(protect);
// router.use(authorize('admin'));

router.post('/upload', upload);
router.get('/download', download);

module.exports = router;
