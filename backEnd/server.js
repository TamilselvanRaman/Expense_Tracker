// server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const connectDB = require("./config/db.js");
const authRouter = require("./routes/authRoutes.js");
const incomeRoutes = require("./routes/incomeRoutes.js");
const expenseRoutes = require("./routes/expenseRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");

// Connect to DB
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // allow frontend
    credentials: true, // only if cookies are used (optional)
  })
);

app.use(express.json());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
