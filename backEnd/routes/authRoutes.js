const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware.js");
const upload = require("../middlewares/uploadMiddelware.js");
const User = require("../models/User.js");

const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/authController.js");

// User routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);

// ✅ Image Upload Route
router.post("/uploadImage", upload, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Generate full image URL
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  res.status(200).json({
    imageUrl,
    message: "Image uploaded successfully",
  });
});



module.exports = router;
