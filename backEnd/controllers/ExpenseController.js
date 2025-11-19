// controllers/ExpenseController.js
const Expense = require("../models/Expense.js");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// Add Expense
exports.addExpense = async (req, res) => {
  try {
    const userId = req.user._id;
    const { icon, category, amount, date } = req.body;

    // Validation
    if (!date || !category || !amount) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields: date, category, and amount",
      });
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    const newExpense = new Expense({
      userId,
      icon: icon || "💰",
      category,
      amount: parseFloat(amount),
      date: new Date(date),
    });

    await newExpense.save();

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense: newExpense,
    });
  } catch (error) {
    console.error("Add expense error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all Expenses
exports.getAllExpense = async (req, res) => {
  try {
    const userId = req.user._id;
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      message: "Expenses fetched successfully",
      expenses,
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    const userId = req.user._id;
    const expenseId = req.params.id;

    const expense = await Expense.findOneAndDelete({ _id: expenseId, userId });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update Expense
exports.updateExpense = async (req, res) => {
  try {
    const userId = req.user._id;
    const expenseId = req.params.id;
    const { icon, category, amount, date } = req.body;

    if (!date || !category || !amount) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: expenseId, userId },
      {
        icon: icon || "💰",
        category,
        amount: parseFloat(amount),
        date: new Date(date),
      },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Download Expense Excel
exports.downloadExpenseExcel = async (req, res) => {
  try {
    const userId = req.user._id;
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    if (expenses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No expenses found to download",
      });
    }

    const data = expenses.map((item, index) => ({
      "S.No": index + 1,
      Category: item.category,
      Amount: item.amount,
      Date: item.date.toLocaleDateString(),
      Icon: item.icon,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, `expenses-${Date.now()}.xlsx`);
    XLSX.writeFile(workbook, filePath);

    res.download(filePath, "Expenses.xlsx", (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({
          success: false,
          message: "Error downloading file",
        });
      }
      // Clean up file after download
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    });
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
