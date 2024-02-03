

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    gender : {
        type : String,
    },
    dateOfBirth : {
        type : String,
    },
    bio : {
        type : String,
        trim : true,
    },
    image : {
        type : String,
    },
})

module.exports = mongoose.model("Profile" , profileSchema);