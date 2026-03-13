// server.js - Hardened Corporate Architecture

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db.js");

// Route Imports
const authRouter = require("./routes/authRoutes.js");
const incomeRoutes = require("./routes/incomeRoutes.js");
const expenseRoutes = require("./routes/expenseRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");

const app = express();

// Security Middleware: Helmet (Sets various HTTP headers)
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate Limiting: Prevent brute force and DoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, 
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Database Connection
connectDB();

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Parsing Middleware
app.use(express.json({ limit: '10kb' })); // Body limit to prevent large payload attacks

// Static File Serving (Carefully configured)
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
        res.set("Cross-Origin-Resource-Policy", "cross-origin");
    }
}));

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Resource not found'
  });
});

// Global Error Handler (Prevents stack trace leakage in prod)
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message
  });
});

// Port Configuration
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Expenzo Secure Server operating on port ${PORT}`);
});

