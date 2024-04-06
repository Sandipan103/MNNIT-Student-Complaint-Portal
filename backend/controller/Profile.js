

// model required
const User = require("../models/UserModel");
const Hostel = require("../models/HostelModel");
const Warden = require("../models/WardenModel");
const Caretaker = require("../models/CaretakerModel");



// dependency required

exports.getUserProfileById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).select("-password").populate('hostel');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "user not found" 
      });
    }
    res.json({ 
      success: true, 
      user 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "something went wrong while fetching user profile detail" 
    });
  }
};

exports.updateUserProfileById = async (req, res, next) => {
  const {
    userId,
    firstName,
    lastName,
    gender,
    dateOfBirth,
    contactNo,
    regNo,
    hostelName,
  } = req.body;

  const hostel = await Hostel.findOne({name : hostelName});

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: `Hostel not found`,
      });
    }

  const updatedData = {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    contactNo,
    regNo,
    hostel : hostel._id,
  };

  

  try {
    const user = await User.findByIdAndUpdate(userId, updatedData,
      {new: true,}
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "user not found" 
      });
    }

    res.json({ 
      success: true, 
      user, 
      message: "profile updated successfully" 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "something went wrong while updating user profile detail"
    });
  }
};



