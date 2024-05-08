
// required dependency
const cookieParser = require("cookie-parser");
const express = require("express");
const router = express.Router();

const app = express();

app.use(cookieParser)

// importing required controler
// auth controller
const {sendOtp, signup, login, logout, } = require('../controller/Auth');


// profile controler
const {getUserProfileById, updateUserProfileById} = require('../controller/Profile');


// complaint controller
const {createPersonalComplaint, getMyComplaints, getCommonComplaint, markOngoing, markSolved, rejectComplaint, sendMailToCaretaker, sendMailFromChiefWarden} = require('../controller/Complaint');


//careTaker controller
const {loginCareTaker, getAllComplaints} = require("../controller/CareTaker");


// admin controller
const {createHostel, } = require('../controller/Hostel');
const { createCaretaker } = require("../controller/CareTaker");
const  {createWarden,warden,loginWarden } = require("../controller/Warden");

const {loginChiefWarden,chiefWarden,createChiefWarden} = require("../controller/ChiefWarden");



// fileUpload controller
const {imageUpload, } = require('../controller/fileUpload')


// other controller


// auth routing
router.post('/sendOtp' , sendOtp);
router.post('/signup' , signup);
router.post('/login' , login);
router.get('/logout' , logout);



// profile routing
router.get('/getUserProfileById/:userId', getUserProfileById);
router.put('/updateUserProfileById', updateUserProfileById);


// complaint routing
router.post('/createPersonalComplaint', createPersonalComplaint);
router.get('/getMyComplaints/:userId', getMyComplaints);
router.get('/getCommonComplaint/:userId', getCommonComplaint);
router.post('/markOngoing', markOngoing);
router.post('/markSolved', markSolved);
router.post('/rejectComplaint', rejectComplaint);
router.post('/sendMailToCaretaker', sendMailToCaretaker);
router.post('/sendMailFromChiefWarden', sendMailFromChiefWarden);



// careTaker routing
router.post('/loginCareTaker' , loginCareTaker);
router.get('/getAllComplaints/:userId', getAllComplaints);



// admin routing :  creating hostel, caretaker, warden
router.post('/createHostel', createHostel);
router.post('/createCaretaker', createCaretaker);
router.post('/createWarden', createWarden);




// file upload routing
router.post('/imageUpload', imageUpload);


// other routing

// router.get('/caretakerInfo',careTakerInfo);
// router.get('/WardenInfo',WardenInfo);
router.post('/loginWarden',loginWarden)
router.get('/wardenDashboard/:userId',warden);

router.post('/createChiefWarden',createChiefWarden)

router.post('/loginChiefWarden',loginChiefWarden);
router.get('/chiefWardenDashboard',chiefWarden);

// export route
module.exports = router; 
