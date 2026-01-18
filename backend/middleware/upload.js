const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary.js");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "propify/properties",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [
            { width: 1600, height: 1200, crop: "limit", quality: "auto", fetch_format: "auto" }
        ],
    },
});

const upload = multer({ storage });

module.exports = upload;
