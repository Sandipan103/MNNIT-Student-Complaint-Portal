

const mongoose = require('mongoose');

const chiefWardenSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    hostelsManaged: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel'
    }],
    complaints: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint'
    }]
});

module.exports = mongoose.model('ChiefWarden', chiefWardenSchema);
