const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');


// CREATE ACCOUNT
router.post('/signup', userCtrl.signup);

//CONNECT TO ACCOUNT
router.post('/login', userCtrl.login);

// DISPLAY ACCOUNT USER
router.get('/me', userCtrl.getUser);

// MODIFY ACCOUNT USER
router.put('/me', userCtrl.updateUser);

//DELETE ACCOUNT USER
router.delete('/me', userCtrl.deleteUser);


module.exports = router;