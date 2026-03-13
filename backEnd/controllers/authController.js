const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// Generate JWT Token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from environment variables");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register User
exports.registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, profileImageUrl } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        status: 'error',
        message: "A user with this email already exists" 
      });
    }

    const image = profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6366f1&color=fff`;

    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl: image,
    });

    res.status(201).json({
      status: 'success',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageUrl: user.profileImageUrl
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// Login User
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Use lean() for performance since we don't need Mongoose methods except matchPassword
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        status: 'error',
        message: "Invalid credentials provided" 
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        status: 'error',
        message: "Invalid credentials provided" 
      });
    }

    res.status(200).json({
      status: 'success',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageUrl: user.profileImageUrl
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// Get User Info
exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password").lean();
    if (!user) {
      return res.status(404).json({ 
        status: 'error',
        message: "User context not found" 
      });
    }
    res.status(200).json({
      status: 'success',
      user
    });
  } catch (error) {
    next(error);
  }
};

