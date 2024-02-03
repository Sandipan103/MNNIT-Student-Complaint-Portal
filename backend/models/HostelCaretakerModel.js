
const mongoose = require('mongoose');

const hostelCaretakerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    contactNo : {
        type : String,
    },
    additionalDetails : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Profile",
    },
    hostel: {
        type: String,
        required: true,
        trim: true,
    },
    complaints: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint'
    }]
});

module.exports = mongoose.model('HostelCaretaker', hostelCaretakerSchema);