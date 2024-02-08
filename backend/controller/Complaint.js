
// model required
const User = require("../models/UserModel");
const Complaint = require("../models/ComplaintModel");

// dependency required
require("dotenv").config();

// send otp
exports.createPersonalComplaint = async (req, res) => {
  try {
    // step-1 : fetch data from complaint form
    const {
      categoryType,
      subCategoryType,
      title,
      description,
      additionalDetails,
      createdBy,
      receivedBy,
      warden,
      createdAt,
      image,
    } = req.body;

    // step-2 : fetch userData
    const { userId } = req.user;

    // step-3 : create the complaint
    const complaint = await Complaint.create({
      categoryType: categoryType,
      subCategoryType : subCategoryType,
      title : title,
      description : description,
      additionalDetails : additionalDetails,
      createdBy: userId,
      receivedBy: null, 
      warden: null, 
      createdAt: new Date(),
      image: null, 
    });

    // step-4 : save this in the caretaker received complaint
    // step-5 : save this in the user open complaint

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
