const express = require("express");
const router = express.Router();
const {
  addIncome,
  getAllIncome,
  updateIncome,
  deleteIncome,
  downloadIncomExcel,
} = require("../controllers/IncomeController.js");

const { protect } = require("../middlewares/authMiddleware.js");

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncome);
router.put("/update/:id", protect, updateIncome);
router.get("/downloadexcel", protect, downloadIncomExcel);
router.delete("/delete/:id", protect, deleteIncome);

module.exports = router;
