const Income = require("../models/Income.js");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// Add Income
exports.addIncome = async (req, res, next) => {
  try {
    const { icon, source, amount, date } = req.body;

    const newIncome = new Income({
      userId: req.user._id,
      icon: icon || "💰",
      source,
      amount: parseFloat(amount),
      date: new Date(date),
    });

    await newIncome.save();

    res.status(201).json({ 
      status: 'success',
      message: "Income source registered successfully", 
      income: newIncome 
    });
  } catch (error) {
    next(error);
  }
};

// Get all Income
exports.getAllIncome = async (req, res, next) => {
  try {
    const income = await Income.find({ userId: req.user._id }).sort({ date: -1 }).lean();
    res.status(200).json({ 
        status: 'success',
        count: income.length,
        income 
    });
  } catch (error) {
    next(error);
  }
};

// Delete Income
exports.deleteIncome = async (req, res, next) => {
  try {
    const income = await Income.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!income) {
      return res.status(404).json({ 
        status: 'error',
        message: "Income record not found" 
      });
    }

    res.status(200).json({ 
        status: 'success',
        message: "Income record deleted successfully" 
    });
  } catch (error) {
    next(error);
  }
};

// Update Income
exports.updateIncome = async (req, res, next) => {
  try {
    const { icon, source, amount, date } = req.body;

    const updatedIncome = await Income.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { 
          icon: icon || "💰", 
          source, 
          amount: parseFloat(amount), 
          date: new Date(date) 
      },
      { new: true, runValidators: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({ 
        status: 'error',
        message: "Income record not found" 
      });
    }

    res.status(200).json({ 
        status: 'success',
        message: "Income record updated successfully", 
        income: updatedIncome 
    });
  } catch (error) {
    next(error);
  }
};

// Download Income Excel
exports.downloadIncomExcel = async (req, res, next) => {
  try {
    const income = await Income.find({ userId: req.user._id }).sort({ date: -1 }).lean();
    
    if (income.length === 0) {
        return res.status(404).json({
            status: 'error',
            message: "No income records available for export"
        });
    }

    const data = income.map((item, index) => ({
      "Ref ID": index + 1,
      Source: item.source,
      Amount: item.amount,
      Date: item.date.toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "IncomeSummary");
    
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const fileName = `Income_Report_${Date.now()}.xlsx`;
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

