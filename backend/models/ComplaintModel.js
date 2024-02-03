
const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true,
    },
    description : {
        type : String,
        required : true,
        trim : true,
    },
    additionalDetails : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Profile",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User", 
    },
    receivedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "HostelCaretaker",
    },
    warden: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "ChiefWarden",
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Complaint" , complaintSchema);