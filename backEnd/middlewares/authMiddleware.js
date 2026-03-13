const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

/**
 * Protect middleware to ensure requests are authenticated
 */
const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 'error',
        message: "Authentication required. Please provide a valid Bearer token."
      });
    }

    token = token.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      throw new Error("Critical security configuration missing: JWT_SECRET");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // lean() for performance, excluding password for security
    const user = await User.findById(decoded.id).select("-password").lean();

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: "Credentials revoked or user no longer exists."
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: 'error',
        message: "Your session has expired. Please re-authenticate."
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: 'error',
        message: "Invalid security token provided."
      });
    }

    next(error);
  }
};

module.exports = { protect };

