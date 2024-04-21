
const cloudinary = require("cloudinary").v2;


const isFileTypeSupported = (fileType, supportedTypes) => {
    return supportedTypes.includes(fileType);
}

const uploadFileToCloudinary = async(file, folder, quality) => {
    const options = { folder };
    if (quality) {
        options.quality = quality;
    }
    options.resource_type = "auto"
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// image Uploader Handler 
exports.imageUpload = async (req, res) => {
    try {

        const { name } = req.body;
        console.log(name);

        // Fetch file 
        const imageFile = req.files.imageFile;
        console.log(imageFile);

        const supportedTypes = ["png", "jpg", "jpeg"];
        const fileType = imageFile.name.split('.')[1].toLowerCase();

        // Check file type is supported or not 
        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File type not supported"
            })
        }

        // Upload to Cloudinary
        const response = await uploadFileToCloudinary(imageFile, "FileApp");
        console.log(response);


        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            uploadData : response.secure_url,
        })

    }
    catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: "Something went wrong"
        })
    }
}