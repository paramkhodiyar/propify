const express = require("express");
const upload = require("../middleware/upload.js");

const router = express.Router();

router.post("/upload-test", upload.single("image"), (req, res) => {
    res.json({
        success: true,
        url: req.file.path,
    });
});

module.exports = router;

