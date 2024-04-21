

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// model required
const User = require("../models/UserModel");
const Hostel = require("../models/HostelModel");
const Warden = require("../models/WardenModel");
const Complaint = require("../models/ComplaintModel");

require("dotenv").config();
//


exports.warden = async (req, res) => {
  const userId = req.params.userId;
  // console.log(userId);
  try {
      // Calculate the date three days ago
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      // Query to find complaints created three days ago or earlier
      const complaints = await Complaint.find({
          warden: userId, 
          // createdAt: { $lte: threeDaysAgo },
          currentStatus: 'pending'
      }).populate('createdBy', '-password');

      // Send the complaints as a response 
      // console.log(complaints); 
      res.json({ complaints });
      console.log("complaint sent from warden")
  } catch (error) {  
      // Handle errors 
      console.error(error);  
      res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createWarden= async (req, res) => {
  try {
    const { name, contactNo, email, password, hostelName } = req.body;

    const emailAlreadyPresent = await Warden.findOne({ email });

    if (emailAlreadyPresent) {
      return res.status(401).json({
        success: false,
        message: `email already registered`,
      });
    }

    const hostel = await Hostel.findOne({ name: hostelName });

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: `Hostel '${hostelName}' not found.`,
      });
    }

    // // Check if a warden is already assigned to this hostel
    if (hostel.warden) { 
      return res.status(401).json({
        success: false,
        message: `A warden is already assigned to this hostel.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //  create warden
    const warden = await Warden.create({
        name,
        contactNo,
        email,
        password: hashedPassword,
        hostel: hostel._id,
    });

    // update the hostel, adding warden
    const updatedHostel = await Hostel.findByIdAndUpdate(
      hostel._id,
      { warden : warden._id },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: `Warden created successfully`,
      warden
    });
  } catch (error) {
    console.log("Warden creating error : ", error);
    return res.status(401).json({
      success: false,
      message: ` errorsomthing went wrong while creating Warden`,
    });
  }
};




// login warden
exports.loginWarden = async(req, res) => {
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
    const warden = await Warden.findOne({ email });
    if (!warden) {
      return res.status(402).json({
        success: false,
        message: `email is not registered`,
      });
    }

    // step-3 : match the password with user hashed password
    const matchPassword = await bcrypt.compare(password, warden.password);

    if(!matchPassword)  {
      return res.status(400).json({
        success: false,
        message: `incorrect password`,
      });
    }

    // step-4 : creating payload
    const payload = {
      email: warden.email,
      id: warden._id,
      //  **  we can add any other detail here **
    };

    // step-5 : generate jwt token
    const tokenw = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: `2h`,
    });
    warden.tokenw = tokenw;
    warden.password = undefined;
    const options2 = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // after 24 hours
      httpOnly: true,
    };
    

    // step-6 : save user data in cashe
    // step-7 : login
    res.cookie('tokenw', tokenw, options2).status(200).json({
      success: true,
      tokenw,
      warden,
      message: `warden logged in successfully`,
    });
  } catch (error) {
    console.log("login error : ", error);
    return res.status(401).json({
      success: false,
      message: `somthing went wrong while login warden`,
    });
  }
};
