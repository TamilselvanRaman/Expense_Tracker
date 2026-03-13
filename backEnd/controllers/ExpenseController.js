const Expense = require("../models/Expense.js");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// Add Expense
exports.addExpense = async (req, res, next) => {
  try {
    const { icon, category, amount, date } = req.body;

    const newExpense = new Expense({
      userId: req.user._id,
      icon: icon || "💰",
      category,
      amount: parseFloat(amount),
      date: new Date(date),
    });

    await newExpense.save();

    res.status(201).json({
      status: 'success',
      message: "Expense record created successfully",
      expense: newExpense,
    });
  } catch (error) {
    next(error);
  }
};

// Get all Expenses
exports.getAllExpense = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 }).lean();

    res.status(200).json({
      status: 'success',
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Expense
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!expense) {
      return res.status(404).json({
        status: 'error',
        message: "Expense record not found",
      });
    }

    res.status(200).json({
      status: 'success',
      message: "Expense record deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update Expense
exports.updateExpense = async (req, res, next) => {
  try {
    const { icon, category, amount, date } = req.body;

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
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
        status: 'error',
        message: "Expense record not found",
      });
    }

    res.status(200).json({
      status: 'success',
      message: "Expense record updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    next(error);
  }
};

// Download Expense Excel
exports.downloadExpenseExcel = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 }).lean();

    if (expenses.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: "No expense records available for export",
      });
    }

    const data = expenses.map((item, index) => ({
      "Ref ID": index + 1,
      Category: item.category,
      Amount: item.amount,
      Date: item.date.toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ExpenseReport");

    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const fileName = `Expense_Report_${Date.now()}.xlsx`;
    const filePath = path.join(uploadsDir, fileName);
    XLSX.writeFile(workbook, filePath);

    res.download(filePath, fileName, (err) => {
      if (err) {
        if (!res.headersSent) res.status(500).json({ message: "Export failed" });
      }
      fs.unlink(filePath, (err) => {
        if (err) console.error("Cleanup error:", err);
      });
    });
  } catch (error) {
    next(error);
  }
};

