const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');
const messageCtrl = require('../controllers/message');


// CREATE MESSAGE
router.post('/new', multer, messageCtrl.createMessage);

// DISPLAY MESSAGES
router.get('/', messageCtrl.getMessages);

router.delete('/:messageId/delete', messageCtrl.deleteMessage);

module.exports = router;