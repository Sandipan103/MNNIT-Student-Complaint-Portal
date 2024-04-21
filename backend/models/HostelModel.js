

const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    careTaker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Caretaker",
        required:false,
    },
    warden: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warden",
        required:false,
    },
    wings: [{
        wingNo: { type: String },
        roomNo : [{ type: String, }]
    }]
});

module.exports = mongoose.model('Hostel', hostelSchema);

