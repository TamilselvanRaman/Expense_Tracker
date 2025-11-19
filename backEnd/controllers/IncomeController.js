const User = require("../models/User.js");
const Income = require("../models/Income.js");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// Add Income source code here
exports.addIncome = async (req, res) => {
  const userId = req.user._id;

  try {
    const { icon, source, amount, date } = req.body;

    // Validate the data
    if (!date || !source || !amount) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Optional: Validate amount is a number
    if (isNaN(amount)) {
      return res.status(400).json({ message: "Amount must be a number" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });

    await newIncome.save();

    res.status(201).json({ message: "Income added successfully", newIncome });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all Income source
exports.getAllIncome = async (req, res) => {
  const userId = req.user._id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    res.status(200).json({ message: "Income fetched successfully", income });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Income source code here
exports.deleteIncome = async (req, res) => {
  const userId = req.user._id;
  const incomeId = req.params.id;

  try {
    const income = await Income.findOneAndDelete({ _id: incomeId, userId });

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Income source code here
exports.updateIncome = async (req, res) => {
  const userId = req.user._id;
  const incomeId = req.params.id;

  try {
    const { icon, source, amount, date } = req.body;

    // Validate the data
    if (!date || !source || !amount) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Optional: Validate amount is a number
    if (isNaN(amount)) {
      return res.status(400).json({ message: "Amount must be a number" });
    }

    const updatedIncome = await Income.findOneAndUpdate(
      { _id: incomeId, userId },
      { icon, source, amount, date: new Date(date) },
      { new: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    res
      .status(200)
      .json({ message: "Income updated successfully", updatedIncome });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Download Income Excel source code here
exports.downloadIncomExcel = async (req, res) => {
  const userId = req.user._id;
  const incomeId = req.params.id;

  try {
    const income = await Income.find({userId }).sort({ date: -1 });
   
    //Perpare the data for Excel
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date.toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Income");
    const filePath = path.join(__dirname, "../uploads/income.xlsx");
    XLSX.writeFile(workbook, filePath);

    res.download(filePath, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ message: "Error downloading file" });
      } else {
        // Optionally delete the file after download
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
    });
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
