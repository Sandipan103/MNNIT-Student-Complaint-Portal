
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        trim : true,
    },
    lastName : {
        type : String,
        required : true,
        trim : true,
    },
    contactNo : {
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
    additionalDetails : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Profile",
    },
    token : {
        type : String,
    },
})

module.exports = mongoose.model("User" , userSchema);