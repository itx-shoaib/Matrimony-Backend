const express = require('express'); //import express

// 1.
const router = express.Router();
// 2.
const AdminController = require('../controllers/adminRoute');
// 3.
router.get('/getallusers', AdminController.AllUser);
router.get('/deleteuser/:id', AdminController.DeleteUser);
// 4. 
module.exports = router; // export to use in server.js