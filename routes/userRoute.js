const express = require('express'); //import express

// 1.
const router = express.Router();
// 2.
const UserController = require('../controllers/userRoute');
// 3.
router.get('/getProfile', UserController.getProfile);
router.post('/createProfile', UserController.createProfile);
// 4. 
module.exports = router; // export to use in server.js