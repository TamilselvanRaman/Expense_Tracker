const express = require("express");
const router = express.Router();
const {
  addExpense,
  getAllExpense,
  updateExpense,
  deleteExpense,
  downloadExpenseExcel,
} = require("../controllers/ExpenseController.js");

const { protect } = require("../middlewares/authMiddleware.js");

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpense);
router.put("/update/:id", protect,  updateExpense);
router.get("/downloadexcel", protect, downloadExpenseExcel);
router.delete("/delete/:id", protect, deleteExpense);

module.exports = router;
