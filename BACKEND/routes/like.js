const express = require('express');
const router = express.Router();
const likeCtrl = require('../controllers/like');

router.post('/:messageId/vote/like', likeCtrl.like);

router.post('/:messageId/vote/dislike', likeCtrl.dislike);

module.exports = router;