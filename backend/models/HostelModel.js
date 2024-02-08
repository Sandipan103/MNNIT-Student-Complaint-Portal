

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
    },
    warden: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warden",
    },
});

module.exports = mongoose.model('Hostel', hostelSchema);

