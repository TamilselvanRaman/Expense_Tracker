const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types } = require("mongoose");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("User ID:", userId);
    const userObjectId = new Types.ObjectId(String(userId));

    // Total Income
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: { _id: null, totalIncome: { $sum: { $toDouble: "$amount" } } },
      },
    ]);

    // Total Expense
    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: { _id: null, totalExpense: { $sum: { $toDouble: "$amount" } } },
      },
    ]);

    // Last 60 days income
    const last60DaysIncome = await Income.aggregate([
      {
        $match: {
          userId: userObjectId,
          createdAt: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalIncome: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);
    const last60DaysIncomeTotal = last60DaysIncome.reduce(
      (acc, curr) => acc + curr.totalIncome,
      0
    );

    // Last 30 days expense
    const last30DaysExpense = await Expense.aggregate([
      {
        $match: {
          userId: userObjectId,
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalExpense: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);
    const last30DaysExpenseTotal = last30DaysExpense.reduce(
      (acc, curr) => acc + curr.totalExpense,
      0
    );

    // Get last 5 transactions (combined)
    const incomeTrans = await Income.find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .limit(5);
    const expenseTrans = await Expense.find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentTransactions = [...incomeTrans, ...expenseTrans]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      totalBalance:
        (totalIncome[0]?.totalIncome || 0) -
        (totalExpense[0]?.totalExpense || 0),
      totalIncome: totalIncome[0]?.totalIncome || 0,
      totalExpense: totalExpense[0]?.totalExpense || 0,
      last60DaysIncomeTotal: {
        totalIncome: last60DaysIncomeTotal,
        transactions: last60DaysIncome,
      },
      last30DaysExpenseTotal: {
        totalExpense: last30DaysExpenseTotal,
        transactions: last30DaysExpense,
      },
      recentTransactions,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
