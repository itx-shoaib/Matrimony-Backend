const express = require('express'); //import express

// 1.
const router = express.Router();
// 2.
const UserController = require('../controllers/userssRoute');
// 3.
router.post('/Onlineuser', UserController.OnlineUser);
// 4. 
module.exports = router; // export to use in server.js