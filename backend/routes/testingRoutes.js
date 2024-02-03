
// required dependency
const express = require("express");
const router = express.Router();


// importing required controler
// auth controller
const {sendOtp, signup} = require('../controller/Auth');

// other controller


// auth routing
router.post('/sendOtp' , sendOtp);
router.post('/signup' , signup);
router.post('/login' , login);


// other routing




// export route
module.exports = router; 
