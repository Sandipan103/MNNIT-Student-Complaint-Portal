// model required
const User = require("../models/UserModel");
const Hostel = require("../models/HostelModel");
const Complaint = require("../models/ComplaintModel");
const Caretaker = require("../models/CaretakerModel");
const Warden = require("../models/WardenModel")
const ChiefWarden = require("../models/ChiefWardenModel")

// required for sending mail for verification otp to user mail id 
const mailSender = require("../utils/mailsender");

// dependency required
require("dotenv").config();


// create personal complaint
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
      upvotes:[userId],
      hostel : hostelId,
      createdAt: new Date(),
      image: image,
    });

    // step-4 : save this in the caretaker received complaint
    await Caretaker.findByIdAndUpdate(
      hostel.careTaker,
      { $push: { complaints: complaint._id } },
      { new: true }
    );
    await Warden.findByIdAndUpdate(
      hostel.warden,
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

exports.getMyComplaints = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).select("-password").populate({
      path: 'pendingComplaints ongoingComplaints solvedComplaints',
      populate: {
        path: 'createdBy receivedBy warden',
        select: '-password',
      },
    });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    const { pendingComplaints, ongoingComplaints, solvedComplaints } = user;
    const complaints = {
      pending: pendingComplaints,
      ongoing: ongoingComplaints,
      solved: solvedComplaints,
    };
    res.json({ 
      success: true, 
      complaints 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Something went wrong while fetching my complaints" 
    });
  }
};

exports.getCommonComplaint = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found`,
      });
    }

    // console.log("user :: ", user);

    const hostelId = user.hostel;

    const hostel = await Hostel.findById(hostelId);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: `Hostel not found`,
      });
    }

    const complaints = await Complaint.find({ hostel: hostelId });

    res.status(200).json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.log("error occured while fetching all common complaint : ", error);
    return res.status(401).json({
      success: false,
      message: `common complaint not found`,
    });
  }
};

exports.markOngoing = async (req, res) => {
  try {
    const { complaintId, } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { currentStatus: 'ongoing' },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `complaint not found`,
      });
    }

    const user = await User.findById(complaint.createdBy);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found for the complaint`,
      });
    }

    user.pendingComplaints.pull(complaintId);
    user.ongoingComplaints.push(complaintId);
    await user.save();

    res.status(200).json({
      success: true,
      message: `complaint marked as ongoing successfully`,
      complaint,
    });
  } catch (error) {
    console.log("error occured while marking complaint as ongoing : ", error);
    return res.status(401).json({
      success: false,
      message: `complaint not marked as ongoing`,
    });
  }
};

exports.markSolved = async (req, res) => {
  try {
    const { complaintId, } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { currentStatus: 'solved' },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `complaint not found`,
      });
    }

    const user = await User.findById(complaint.createdBy);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found for the complaint`,
      });
    }

    user.ongoingComplaints.pull(complaintId);
    user.solvedComplaints.push(complaintId);
    await user.save();

    res.status(200).json({
      success: true,
      message: `complaint marked as solved successfully`,
      complaint,
    });
  } catch (error) {
    console.log("error occured while marking complaint as solved : ", error);
    return res.status(401).json({
      success: false,
      message: `complaint not marked as solved`,
    });
  }
};


exports.rejectComplaint = async (req, res) => {
  try {
    const { complaintId, } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { currentStatus: 'rejected' },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `complaint not found`,
      });
    }

    const user = await User.findById(complaint.createdBy);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found for the complaint`,
      });
    }

    user.pendingComplaints.pull(complaintId);
    await user.save();
    const title =  'Complaint Rejected: ' + complaint.title;
    const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #cc0000;">Your Complaint Has Been Rejected</h2>
      <p style="color: #666;">We regret to inform you that your complaint has been rejected by the authorities.</p>
      <h3 style="color: #333;">Complaint Details:</h3>
      <ul style="list-style-type: none; padding: 0;">
        <li><strong>Category:</strong> ${complaint.category.categoryType}</li>
        <li><strong>Subcategory:</strong> ${complaint.category.subCategoryType}</li>
        <li><strong>Title:</strong> ${complaint.title}</li>
        <li><strong>Description:</strong> ${complaint.description}</li>
      </ul>
      <p style="color: #666;">If you have any further inquiries, please contact the hostel management team.</p>
    </div>
  `;

    const mailResponse = await mailSender(user.email, title, body);

    res.status(200).json({
      success: true,
      message: `complaint marked as rejected successfully`,
      mailResponse,
    });
  } catch (error) {
    console.log("error occured while marking complaint as rejected : ", error);
    return res.status(401).json({
      success: false,
      message: `complaint not marked as rejected`,
    });
  }
};

exports.sendMailToCaretaker = async (req, res) => {
  try {
    const { userId, } = req.body;

    const warden = await Warden.findById(userId).populate('hostel');
    const caretaker = await Caretaker.findById(warden.hostel.careTaker);
    // console.log('caretaker : ', caretaker);
    // const email = caretaker.email;
    const email = 'shorya.2022ca099@mnnit.ac.in';
    const title = 'Action Required: Pending Complaints'
    const body = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #333;">Attention ${caretaker.name},</h2>
    <p style="color: #666;">This is a reminder to address pending complaints in your hostel.</p>
    <p style="color: #666;">Please take necessary actions to resolve the following complaints:</p>
    <ul style="list-style-type: none; padding: 0;">
      <li style="margin-bottom: 10px;">
        <strong>Complaint ID:</strong> #984322578343<br>
        <strong>Description:</strong> Fan is not working<br>
        <strong>Status:</strong> Pending
      </li>
      <li style="margin-bottom: 10px;">
        <strong>Complaint ID:</strong> #562197213214<br>
        <strong>Description:</strong> door broken <br>
        <strong>Status:</strong> Pending
      </li>
      <li style="margin-bottom: 10px;">
        <strong>Complaint ID:</strong> #3985459177373<br>
        <strong>Description:</strong> Window is broken <br>
        <strong>Status:</strong> Pending
      </li>
    </ul>
    <p style="color: #666;">Your prompt attention to these matters is greatly appreciated.</p>
    <p style="color: #666;">Best regards,<br>Hostel Management Team</p>
  </div>
`;
    const mailResponse = await mailSender(email, title, body);
    console.log('mailResponse : ' , mailResponse)
    return res.status(200).json({
      success: true,
      message: `mail send successfully`,
      mailResponse
    });
    
  } catch (error) {
    console.log("error occured while marking complaint as rejected : ", error);
    return res.status(401).json({
      success: false,
      message: `complaint not marked as rejected`,
    });
  }
};

exports.sendMailFromChiefWarden = async (req, res) => {
  try {
    const { selectedHostel, } = req.body;
    const hostel = await Hostel.findOne({ name: selectedHostel }).populate('careTaker').populate('warden');

    // console.log('hostel : ', hostel);
    // console.log('caretaker : ', hostel.careTaker.name);
    // console.log('warden : ', hostel.warden.name);
    // const email = caretaker.email;
    const email = 'shorya.2022ca099@mnnit.ac.in';
    const title = 'Action Required: Pending Complaints'
    const body = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Attention ${hostel.careTaker.name},</h2>
        <p style="color: #666;">This is a reminder to address pending complaints in your hostel.</p>
        <p style="color: #666;">Please take necessary actions to resolve the following complaints:</p>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 10px;">
            <strong>Complaint ID:</strong> #984322578343<br>
            <strong>Description:</strong> Fan is not working<br>
            <strong>Status:</strong> Pending
          </li>
          <li style="margin-bottom: 10px;">
            <strong>Complaint ID:</strong> #562197213214<br>
            <strong>Description:</strong> door broken <br>
            <strong>Status:</strong> Pending
          </li>
          <li style="margin-bottom: 10px;">
            <strong>Complaint ID:</strong> #3985459177373<br>
            <strong>Description:</strong> Window is broken <br>
            <strong>Status:</strong> Pending
          </li>
        </ul>
        <p style="color: #666;">Your prompt attention to these matters is greatly appreciated.</p>
        <p style="color: #666;">Best regards,<br>Hostel Management Team</p>
      </div>
    `;
    const mailResponse = await mailSender(email, title, body);
    // console.log('mailResponse : ' , mailResponse)

    const email2 = 'sandipan.2022ca092@mnnit.ac.in';
    const title2 = 'Action Required: Pending Complaints'
    const body2 = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Attention ${hostel.warden.name},</h2>
        <p style="color: #666;">This is a reminder to address pending complaints in your hostel.</p>
        <p style="color: #666;">Please take necessary actions to resolve the following complaints:</p>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 10px;">
            <strong>Complaint ID:</strong> #984322578343<br>
            <strong>Description:</strong> Fan is not working<br>
            <strong>Status:</strong> Pending
          </li>
          <li style="margin-bottom: 10px;">
            <strong>Complaint ID:</strong> #562197213214<br>
            <strong>Description:</strong> door broken <br>
            <strong>Status:</strong> Pending
          </li>
          <li style="margin-bottom: 10px;">
            <strong>Complaint ID:</strong> #3985459177373<br>
            <strong>Description:</strong> Window is broken <br>
            <strong>Status:</strong> Pending
          </li>
        </ul>
        <p style="color: #666;">Your prompt attention to these matters is greatly appreciated.</p>
        <p style="color: #666;">Best regards,<br>Hostel Management Team</p>
      </div>
    `;
    const mailResponse2 = await mailSender(email2, title2, body2);

    return res.status(200).json({
      success: true,
      message: `mail send successfully`,
      mailResponse,
      mailResponse2,
    });
    
  } catch (error) {
    console.log("error occured while sending mail : ", error);
    return res.status(401).json({
      success: false,
      message: `complaint not marked as rejected`,
    });
  }
};