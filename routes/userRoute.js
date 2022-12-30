const express = require('express'); //import express

// 1.
const router = express.Router();
// 2.
const UserController = require('../controllers/userRoute');
// 3.
router.get('/getProfile', UserController.get);
router.post('/createProfile', UserController.createProfile);
router.post("/verify", UserController.confirmEmail)
router.post("/otpverify", UserController.otpVerification)
router.post("/userUpdate", UserController.update)
router.post("/Profilelogin", UserController.Profilelogin)
router.post("/blockUser", UserController.blockUser)
router.post("/changeLoginStatus", UserController.changeLoginStatus)
router.post("/showBlockedUsers", UserController.showBlockedUsers)

// 4. 
module.exports = router; // export to use in server.js