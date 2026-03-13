const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middlewares/validate.js");
const { protect } = require("../middlewares/authMiddleware.js");

const {
  addIncome,
  getAllIncome,
  updateIncome,
  deleteIncome,
  downloadIncomExcel,
} = require("../controllers/IncomeController.js");

const incomeValidation = [
  body("source").notEmpty().withMessage("Income source is required").trim(),
  body("amount").isNumeric().withMessage("Amount must be a valid number"),
  body("date").isISO8601().withMessage("A valid date is required"),
  validate
];

router.post("/add", protect, incomeValidation, addIncome);
router.get("/get", protect, getAllIncome);
router.put("/update/:id", protect, incomeValidation, updateIncome);
router.get("/downloadexcel", protect, downloadIncomExcel);
router.delete("/delete/:id", protect, deleteIncome);

module.exports = router;

