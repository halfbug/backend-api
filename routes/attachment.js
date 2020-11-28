const express = require('express');
const {
  upload,
  view,
} = require('../controllers/attachment');

const router = express.Router({ mergeParams: true });

// router.use(protect);
// router.use(authorize('admin'));

router.post('/upload', upload);
router.get('/view/:id', view);

module.exports = router;
