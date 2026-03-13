const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types } = require("mongoose");

exports.getDashboardData = async (req, res, next) => {
  try {
    const userObjectId = new Types.ObjectId(req.user._id);

    // Parallel execution for stats
    const [incomeStats, expenseStats] = await Promise.all([
      Income.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: { _id: null, total: { $sum: "$amount" } },
        },
      ]),
      Expense.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: { _id: null, total: { $sum: "$amount" } },
        },
      ])
    ]);

    const totalIncome = incomeStats[0]?.total || 0;
    const totalExpense = expenseStats[0]?.total || 0;

    // Last 60 days analytics
    const sixtiesDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const last60DaysIncome = await Income.aggregate([
      {
        $match: {
          userId: userObjectId,
          date: { $gte: sixtiesDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } }
    ]);

    // Last 30 days analytics
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const last30DaysExpense = await Expense.aggregate([
      {
        $match: {
          userId: userObjectId,
          date: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } }
    ]);

    // Combined recent activity
    const [recentIncome, recentExpense] = await Promise.all([
      Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5).lean(),
      Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5).lean()
    ]);

    const recentTransactions = [...recentIncome, ...recentExpense]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    res.status(200).json({
      status: 'success',
      data: {
        balances: {
          available: totalIncome - totalExpense,
          totalIncome,
          totalExpense,
        },
        analytics: {
          last60DaysIncome,
          last30DaysExpense,
        },
        recentTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

