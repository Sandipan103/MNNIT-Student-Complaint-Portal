

const bcrypt = require("bcrypt");


// model required
const User = require("../models/UserModel");
const Hostel = require("../models/HostelModel");
const Caretaker = require("../models/CaretakerModel");
const Complaint = require("../models/ComplaintModel");


//
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

    const existingCaretaker = await Caretaker.findOne({ hostel: hostel._id });

    if (existingCaretaker) {
      return res.status(401).json({
        success: false,
        message: `A caretaker is already assigned to this hostel.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // step-7 : create user
    const caretaker = await Caretaker.create({
        name,
        contactNo,
        email,
        password: hashedPassword,
        hostel: hostel._id,
    });

    hostel.careTaker = caretaker._id;
    await hostel.save();
    
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
