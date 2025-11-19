import React, { useEffect, useState } from "react";
import DashboardLayout from "../Layouts/DashboardLayout";
import { useUserAuth } from "../Hooks/useUserAuth";
import axiosInstance from "../Utils/axiosInstance";
import { API_ENDPOINTS } from "../Utils/API_Paths";
import InfoCard from "../Cards/InfoCard";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import { addThousandsSeparator } from "../Utils/helper";

function Home() {
  const { loading } = useUserAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsFetching(true);
      const response = await axiosInstance.get(
        API_ENDPOINTS.DASHBOARD.GET_DATA
      );

      if (response.data && response.data.success) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchDashboardData();
    }
  }, [loading]);

  // Recent transactions component
  const RecentTransactions = () => {
    if (!dashboardData?.recentTransactions?.length) {
      return (
        <p className="text-gray-500 text-center py-4">No recent transactions</p>
      );
    }

    return (
      <div className="space-y-3">
        {dashboardData.recentTransactions
          .slice(0, 5)
          .map((transaction, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {transaction.icon || (transaction.source ? "💵" : "💰")}
                </span>
                <div>
                  <p className="font-medium">
                    {transaction.source || transaction.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(
                      transaction.createdAt || transaction.date
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span
                className={`font-semibold ${
                  transaction.source ? "text-green-600" : "text-red-600"
                }`}
              >
                {transaction.source ? "+" : "-"}$
                {addThousandsSeparator(transaction.amount)}
              </span>
            </div>
          ))}
      </div>
    );
  };

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto max-w-6xl">
        {loading || isFetching ? (
          <div className="text-center">Loading dashboard data...</div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <InfoCard
                icon={<LuWalletMinimal className="text-2xl" />}
                label="Total Balance"
                value={`$${addThousandsSeparator(
                  dashboardData?.totalBalance || 0
                )}`}
                color="bg-blue-500"
              />
              <InfoCard
                icon={<LuHandCoins className="text-2xl" />}
                label="Total Income"
                value={`$${addThousandsSeparator(
                  dashboardData?.totalIncome || 0
                )}`}
                color="bg-green-500"
              />
              <InfoCard
                icon={<IoMdCard className="text-2xl" />}
                label="Total Expense"
                value={`$${addThousandsSeparator(
                  dashboardData?.totalExpense || 0
                )}`}
                color="bg-red-500"
              />
            </div>

            {/* Charts and Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent 60 Days Income */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Recent Income (60 Days)
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  $
                  {addThousandsSeparator(
                    dashboardData?.last60DaysIncomeTotal?.totalIncome || 0
                  )}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {dashboardData?.last60DaysIncomeTotal?.transactions?.length ||
                    0}{" "}
                  transactions
                </p>
              </div>

              {/* Recent 30 Days Expense */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Recent Expense (30 Days)
                </h3>
                <p className="text-2xl font-bold text-red-600">
                  $
                  {addThousandsSeparator(
                    dashboardData?.last30DaysExpenseTotal?.totalExpense || 0
                  )}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {dashboardData?.last30DaysExpenseTotal?.transactions
                    ?.length || 0}{" "}
                  transactions
                </p>
              </div>

              {/* Recent Transactions */}
              <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Recent Transactions
                </h3>
                <RecentTransactions />
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Home;
