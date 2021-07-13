const express = require('express');
const router = express.Router();
const commentsCtrl = require('../controllers/comments');

router.post('/:messageId/comment', commentsCtrl.createComment);

module.exports = router;