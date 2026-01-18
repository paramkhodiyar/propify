const express = require("express");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/images", upload.array("images", 10), (req, res) => {
    try {
        const urls = req.files.map(file => file.path);
        res.json({ success: true, urls });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Upload failed please try again" });
    }
});

router.post("/avatar", upload.single("avatar"), (req, res) => {
    try {
        const url = req.file.path;
        res.json({ success: true, url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Avatar upload failed" });
    }
});

module.exports = router;
