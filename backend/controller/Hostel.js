

const Hostel = require("../models/HostelModel");

exports.createHostel = async (req, res) => {
    try {
        // Extract data from request body
        const { hostelName, wings } = req.body;

        // Validate input data
        if (!hostelName || !Array.isArray(wings)) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data. Hostel name and wings array are required.",
            });
        }

        // Check if a hostel with the given name already exists
        const existingHostel = await Hostel.findOne({ name: hostelName });
        if (existingHostel) {
            return res.status(400).json({
                success: false,
                message: `Hostel '${hostelName}' already exists.`,
            });
        }

        // Create a new hostel with wings
        const newHostel = await Hostel.create({ name: hostelName, wings : wings });
        // console.log("wings : ", wings)

        return res.status(201).json({
            success: true,
            message: `Hostel '${hostelName}' created successfully.`,
            hostel: newHostel,
        });
    } catch (error) {
        console.error("Error creating hostel:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};