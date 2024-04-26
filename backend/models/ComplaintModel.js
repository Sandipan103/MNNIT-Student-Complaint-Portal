
const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({

    category: {
        categoryType: {
            type: String,
            enum: ['personal', 'common'],
            required: true,
        },
        subCategoryType: {
            type: String,
            required: function() {
                return this.category.categoryType === 'personal' || this.category.categoryType === 'common';
            },
            validate: {
                validator: function() {
                    // Define your validation logic here
                    if (this.category.categoryType === 'personal') {
                        return ['electricity', 'civil', 'cleaning', 'other'].includes(this.category.subCategoryType);
                    } else if (this.category.categoryType === 'common') {
                        return ['water', 'bathroom', 'light', 'other'].includes(this.category.subCategoryType);
                    } else {
                        return false;
                    }
                },
                
            }
            
        }
    },
    currentStatus : {
        type : String,
        enum: ['pending', 'ongoing', 'solved', 'rejected'],
        required: true,
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
        // required: true,
        ref: "Caretaker",
    },
    warden: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "Warden",
    },
    hostel : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Hostel",
    },
    upvotes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    comments: [{ 
        comment: String, 
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        } 
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    image : {
        type : String,
    }
})

module.exports = mongoose.model("Complaint" , complaintSchema);