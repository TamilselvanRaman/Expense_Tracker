const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  icon: {
    type: String,
    default: "", 
  },
  source: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Income", incomeSchema);
