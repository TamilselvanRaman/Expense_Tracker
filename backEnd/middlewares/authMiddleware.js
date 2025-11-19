// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    console.log("Received Authorization header:", token);

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }

    // Check if token format is correct
    if (!token.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, invalid token format. Use: Bearer <token>",
      });
    }

    // Extract token
    token = token.split(" ")[1];

    // Check if token is not empty after extraction
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token is empty",
      });
    }

    console.log("Extracted token:", token);
    console.log("Token length:", token.length);
    console.log("Token parts:", token.split(".").length);

    // Validate token structure (should have 3 parts)
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, malformed token (invalid structure)",
      });
    }

    // Verify JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.name, error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Not authorized, invalid token signature",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token expired",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error in authentication",
    });
  }
};

module.exports = { protect };
