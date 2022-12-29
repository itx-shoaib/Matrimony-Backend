const express = require('express'); //import express

// 1.
const router = express.Router();
// 2.
const UserController = require('../controllers/userssRoute');
// 3.
router.post('/Onlineuser', UserController.OnlineUser);
// 4. 

router.post('/addToFav', UserController.addToFav);
router.post('/findMatch', UserController.findMatch);
router.post('/viewFav', UserController.viewFav);
router.post('/viewRequest', UserController.viewRequest);
router.post('/sentRequest', UserController.sentRequest);
router.post('/nearBy', UserController.nearBy);
router.post('/viewAllRequest', UserController.viewAllRequest);
router.post('/search', UserController.search);
module.exports = router; // export to use in server.js