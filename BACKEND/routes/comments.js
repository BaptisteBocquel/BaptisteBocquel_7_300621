const express = require('express');
const router = express.Router();
const commentsCtrl = require('../controllers/comments');

router.post('/:messageId/comment', commentsCtrl.createComment);

router.get('/:messageId/comment', commentsCtrl.getComments);

module.exports = router;