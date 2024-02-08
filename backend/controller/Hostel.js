

const Hostel = require("../models/HostelModel");

exports.createHostel = async(req, res) => {
    try {
        const { hostelName } = req.body;

        // Check if a hostel with the given name already exists
        const existingHostel = await Hostel.findOne({ name: hostelName });

        if (existingHostel) {
            return res.status(400).json({
                success: false,
                message: `Hostel '${hostelName}' already exists.`,
            });
        }

        // Create a new hostel
        const newHostel = await Hostel.create({ name: hostelName });

        return res.status(201).json({
            success: true,
            message: `Hostel '${hostelName}' created successfully.`,
            hostel: newHostel,
        });
    } catch (error) {
        console.log("Error creating hostel:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};
