// model required
const User = require("../models/UserModel");
const Hostel = require("../models/HostelModel");
const Complaint = require("../models/ComplaintModel");
const Caretaker = require("../models/CaretakerModel");
const Warden = require("../models/WardenModel")

// dependency required
require("dotenv").config();

// send otp
exports.createPersonalComplaint = async (req, res) => {
  try {
    // step-1 : fetch data from complaint form
    const {
      userId,
      categoryType,
      subCategoryType,
      title,
      currentStatus,
      description,
      image,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found`,
      });
    }

    // console.log("user :: ", user);

    // Step 3: Get the hostelId from the user document
    const hostelId = user.hostel;

    // Step 4: Find the hostel document by hostelId
    const hostel = await Hostel.findById(hostelId);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: `Hostel not found`,
      });
    }

    // step-3 : create the complaint
    const complaint = await Complaint.create({
      category: {
        categoryType: categoryType,
        subCategoryType: subCategoryType,
      },
      currentStatus : 'pending',
      title: title,
      description: description,
      createdBy: userId,
      receivedBy: hostel.careTaker,
      warden: hostel.warden,
      createdAt: new Date(),
      image: null,
    });

    // step-4 : save this in the caretaker received complaint
    await Caretaker.findByIdAndUpdate(
      hostel.careTaker,
      { $push: { complaints: complaint._id } },
      { new: true }
    );

    // Step 5: Save the complaint ID in the user's pending complaints array
    await User.findByIdAndUpdate(
      userId,
      { $push: { pendingComplaints: complaint._id } },
      { new: true }
    );

    // *** after 7 days it will saved into the warden received complaint portal ***

    // step-4 : return response
    res.status(200).json({
      success: true,
      message: `complaint created successfully`,
      complaint,
    });
  } catch (error) {
    console.log("error occured while creating new complaint : ", error);
    return res.status(401).json({
      success: false,
      message: `complaint not created`,
    });
  }
};
