
const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({

    catagory: {
        categoryType: {
            type: String,
            enum: ['personal', 'common'],
            required: true,
        },
        subCategoryType: {
            type: String,
            required: function() {
                return this.catagory.main === 'personal' || this.catagory.main === 'common';
            },
            enum: function() {
                if (this.catagory.main === 'personal') {
                    return ['electricity', 'civil', 'clining', 'other'];
                } else if (this.catagory.main === 'common') {
                    return ['water', 'bathroom', 'light', 'other'];
                } else {
                    return [];
                }
            }
        }
    },
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User", 
    },
    receivedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Caretaker",
    },
    warden: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Warden",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    image : {
        type : String,
    }
})

module.exports = mongoose.model("Complaint" , complaintSchema);