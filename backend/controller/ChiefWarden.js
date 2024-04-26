const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

app.use(cookieParser)
// model required
const User = require("../models/UserModel");
const Hostel = require("../models/HostelModel");
const ChiefWarden = require("../models/ChiefWardenModel");
const Complaint = require("../models/ComplaintModel");

require("dotenv").config();
//


exports.chiefWarden = async (req, res) => {
  // const token = req.cookies.tokencw;
  console.log("tokencw : ",req)
  // if(token){
    try {
      const hostels = await Hostel.find();
      // Calculate the date three days ago
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      // Query to find complaints created three days ago or earlier
      const complaints = await Complaint.find({
        //   warden: userId, 
          // createdAt: { $lte: threeDaysAgo },
          currentStatus: 'pending'
      }).populate('createdBy', '-password').populate('hostel', 'name');;

      // Send the complaints as a response 
      // console.log(complaints); 
      res.json({ complaints ,hostels});
      console.log("complaint sent from chief warden")
  } catch (error) {  
      // Handle errors 
      console.error(error);  
      res.status(500).json({ error: 'Internal server error' });
  }
  // }
  
};




// login warden
exports.loginChiefWarden = async(req, res) => {
  try {
    // step-1 : fetch data
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: `all fields are required`,
      });
    }

    // step-2 : find emial is registered or not
    const chiefWarden = await ChiefWarden.findOne({ email });
    if (!chiefWarden) {
      return res.status(402).json({
        success: false,
        message: `email is not registered`,
      });
    }

    // step-3 : match the password with user hashed password
    const matchPassword = await bcrypt.compare(password, chiefWarden.password);

    if(!matchPassword)  {
      return res.status(400).json({
        success: false,
        message: `incorrect password`,
      });
    }

    // step-4 : creating payload
    const payload = {
      email: chiefWarden.email,
      id: chiefWarden._id,
      //  **  we can add any other detail here **
    };

    // step-5 : generate jwt token
    const tokencw = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: `2h`,
    });
    chiefWarden.tokencw = tokencw;
    chiefWarden.password = undefined;
    const options2 = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // after 24 hours
      httpOnly: true,
    };
    

    // step-6 : save user data in cashe
    // step-7 : login
    res.cookie('tokencw', tokencw, options2).status(200).json({
      success: true,
      tokencw,
      chiefWarden,
      message: `chiefWarden logged in successfully`,
    });
  } catch (error) {
    console.log("login error : ", error);
    return res.status(401).json({
      success: false,
      message: `somthing went wrong while login warden`,
    });
  }
};




exports.createChiefWarden = async (req, res) => {
  try {
    const { name, contactNo, email, password, hostelsManaged:[h1,h2] } = req.body;

console.log("Hostel names extracted from request:", h1, h2);

const emailAlreadyPresent = await ChiefWarden.findOne({ email });

if (emailAlreadyPresent) {
  return res.status(401).json({
    success: false,
    message: `Email already registered`,
  });
}

const hostel1 = await Hostel.findOne({ name: h1 });
const hostel2 = await Hostel.findOne({ name: h2 });

console.log("Hostels found in database:", hostel1, hostel2);

if (!hostel1 || !hostel2) {
  return res.status(404).json({
    success: false,
    message: `One or more hostels not found.`,
  });
}

const hashedPassword = await bcrypt.hash(password, 10);

//  create warden
const chiefWarden = await ChiefWarden.create({
    name,
    email,
    password: hashedPassword,
    hostelsManaged: [hostel1._id, hostel2._id],
});

return res.status(200).json({
  success: true,
  message: `Chief Warden created successfully`,
  chiefWarden
});

  } catch (error) {
    console.log("ChiefWarden creating error : ", error);
    return res.status(401).json({
      success: false,
      message: ` errorsomthing went wrong while creating Warden`,
    });
  }
};




