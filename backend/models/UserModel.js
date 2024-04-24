
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        trim : true,
    },
    lastName : {
        type : String,
        trim : true,
    },
    gender : {
        type : String,
    },
    dateOfBirth : {
        type : String,
    },
    image : {
        type : String,
    },
    contactNo : {
        type : String,
    },
    regNo : {
        type : String,
    },
    hostel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel'
    },
    roomNo : {
        type : String,
    },
    email : {
        type : String,
        required : true,
        trim : true,
    },
    password : {
        type : String,
        required : true,
    },
    pendingComplaints: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint'
    }],
    ongoingComplaints: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint'
    }],
    solvedComplaints: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint'
    }],
    token : {
        type : String,
    },
})

module.exports = mongoose.model("User" , userSchema);