const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// Generate JWT Token - FIXED VERSION
const generateToken = (id) => {
  // Verify JWT_SECRET is available
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

//Register User
exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  //Validate: check for missing fields
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  // Set a default profile image if not provided or it's empty
  const image = profileImageUrl || "https://www.gravatar.com/avatar/?d=mp";

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl: image,
    });

    res.status(201).json({
      _id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

//Login User
// In authController.js - loginUser function
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    
    // DEBUG: Log the token details
    console.log("Generated token:", token);
    console.log("Token length:", token.length);
    console.log("Token parts:", token.split('.').length);

    res.status(200).json({
      _id: user._id,
      user,
      token: token,
      debug: {
        tokenLength: token.length,
        tokenParts: token.split('.').length
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Get User Info
exports.getUserInfo = async (req, res) => {
  const userId = req.user._id; // Assuming you have middleware to set req.user

  try {
    const user = await User.findById(userId).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
