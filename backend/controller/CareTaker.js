

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// model required
const User = require("../models/UserModel");
const Hostel = require("../models/HostelModel");
const Caretaker = require("../models/CaretakerModel");
const Complaint = require("../models/ComplaintModel");

require("dotenv").config(); 


// creating new caretaker for hostel
exports.createCaretaker = async (req, res) => {
  try {
    const { name, contactNo, email, password, hostelName } = req.body;

    const emailAlreadyPresent = await Caretaker.findOne({ email });

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

    // Check if a caretaker is already assigned to this hostel
    if (hostel.careTaker) {
      return res.status(401).json({
        success: false,
        message: `A caretaker is already assigned to this hostel.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create careTaker
    const caretaker = await Caretaker.create({
      name,
      contactNo,
      email,
      password: hashedPassword,
      hostel: hostel._id,
    });

    // update the hostel, adding careTaker
    const updatedHostel = await Hostel.findByIdAndUpdate(
      hostel._id,
      { careTaker: caretaker._id },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: `caretaker created successfully`,
      caretaker
    });
  } catch (error) {
    console.log("caretaker creating error : ", error);
    return res.status(401).json({
      success: false,
      message: `somthing went wrong while creating caretaker`,
    });
  }
};


// login careTaker
exports.loginCareTaker = async (req, res) => {
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
    const caretaker = await Caretaker.findOne({ email });
    if (!caretaker) {
      return res.status(402).json({
        success: false,
        message: `email is not registered`,
      });
    }

    // step-3 : match the password with user hashed password
    const matchPassword = await bcrypt.compare(password, caretaker.password);

    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: `incorrect password`,
      });
    }

    // step-4 : creating payload
    const payload = {
      email: caretaker.email,
      id: caretaker._id,
      //  **  we can add any other detail here **
    };

    // step-5 : generate jwt token
    const tokenc = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: `2h`,
    });
    caretaker.tokenc = tokenc;
    caretaker.password = undefined;
    const options2 = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // after 24 hours
      httpOnly: true,
    };


    // step-6 : save user data in cashe
    // step-7 : login
    res.cookie('tokenc', tokenc, options2).status(200).json({
      success: true,
      tokenc,
      caretaker,
      message: `caretaker logged in successfully`,
    });
  } catch (error) {
    console.log("login error : ", error);
    return res.status(401).json({
      success: false,
      message: `somthing went wrong while login careTaker`,
    });
  }
};


// get all personalcomplaints
exports.getAllComplaints = async (req, res) => {
  const userId = req.params.userId;
  try {
    const complaints = await Complaint.find({ receivedBy: userId }).populate('createdBy', '-password');;
      // Fetch hostel name based on user ID
      const user = await Caretaker.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `User with ID ${userId} not found.`,
        });
      }
      const hostel = await Hostel.findById(user.hostel).select('name');
      // console.log(hostel.name);
    res.json({ 
      success: true, 
      complaints,
      hostelName: hostel.name, // added hostel name also
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "something went wrong while fetching complaints"
    });
  }
};