const express = require('express'); //import express

const router = express.Router();
const subAdminController = require('../controllers/subAdmin');

router.post('/subAdminCreate',subAdminController.subAdminCreate);
router.get('./subAdminShow',subAdminController.subAdminShow);
router.put('/subAdminUpdate',subAdminController.subAdminUpdate);


module.exports = router;