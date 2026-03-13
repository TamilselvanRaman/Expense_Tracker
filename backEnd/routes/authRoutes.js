const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { protect } = require("../middlewares/authMiddleware.js");
const upload = require("../middlewares/uploadMiddelware.js");
const validate = require("../middlewares/validate.js");
const User = require("../models/User.js");

const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/authController.js");

// Validation Rules
const registerValidation = [
  body("fullName").notEmpty().withMessage("Full name is required").trim(),
  body("email").isEmail().withMessage("Professional email is required").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
  validate
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  validate
];

// User routes
router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.get("/getUser", protect, getUserInfo);

// ✅ Image Upload Route (Restricted)
router.post("/uploadImage", protect, upload, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: "error", message: "No file uploaded" });
  }

  // Generate full image URL
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  res.status(200).json({
    status: "success",
    imageUrl,
    message: "Image uploaded successfully",
  });
});

module.exports = router;

