const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middlewares/validate.js");
const { protect } = require("../middlewares/authMiddleware.js");

const {
  addExpense,
  getAllExpense,
  updateExpense,
  deleteExpense,
  downloadExpenseExcel,
} = require("../controllers/ExpenseController.js");

const expenseValidation = [
  body("category").notEmpty().withMessage("Expense category is required").trim(),
  body("amount").isNumeric().withMessage("Amount must be a valid number"),
  body("date").isISO8601().withMessage("A valid date is required"),
  validate
];

router.post("/add", protect, expenseValidation, addExpense);
router.get("/get", protect, getAllExpense);
router.put("/update/:id", protect, expenseValidation, updateExpense);
router.get("/downloadexcel", protect, downloadExpenseExcel);
router.delete("/delete/:id", protect, deleteExpense);

module.exports = router;

