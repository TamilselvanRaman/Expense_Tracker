import React, { useEffect, useState } from "react";
import DashboardLayout from "../Layouts/DashboardLayout";
import { useUserAuth } from "../Hooks/useUserAuth";
import axiosInstance from "../Utils/axiosInstance";
import { API_ENDPOINTS } from "../Utils/API_Paths";
import InfoCard from "../Cards/InfoCard";
import { LuHandCoins, LuWalletMinimal, LuTrendingUp } from "react-icons/lu";
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

      if (response.data && response.data.status === 'success') {
        setDashboardData(response.data.data);
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

  const RecentTransactions = () => {
    if (!dashboardData?.recentTransactions?.length) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <LuWalletMinimal className="text-4xl mb-2 opacity-20" />
          <p className="text-sm font-medium">No recent transactions to display</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {dashboardData.recentTransactions.map((transaction, index) => (
          <div
            key={transaction._id || index}
            className="flex justify-between items-center p-4 bg-slate-50/50 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-xl border border-slate-100">
                {transaction.icon || (transaction.source ? "💼" : "🛍️")}
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">
                  {transaction.source || transaction.category}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {new Date(transaction.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`text-sm font-bold ${
                  transaction.source ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {transaction.source ? "+" : "-"}${addThousandsSeparator(transaction.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Financial Overview</h1>
          <p className="text-slate-500 mt-1 font-medium">Track and manage your finances with ease.</p>
        </header>

        {loading || isFetching ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoCard
                icon={<LuWalletMinimal />}
                label="Available Balance"
                value={`$${addThousandsSeparator(dashboardData?.balances?.available || 0)}`}
                color="bg-indigo-600"
              />
              <InfoCard
                icon={<LuHandCoins />}
                label="Total Income"
                value={`$${addThousandsSeparator(dashboardData?.balances?.totalIncome || 0)}`}
                color="bg-emerald-500"
              />
              <InfoCard
                icon={<IoMdCard />}
                label="Total Expense"
                value={`$${addThousandsSeparator(dashboardData?.balances?.totalExpense || 0)}`}
                color="bg-rose-500"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Analytics Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Income Snapshot */}
                  <div className="card-premium h-fit">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-900">Income Insight</h3>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Last 60 Days</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-slate-900">
                          ${addThousandsSeparator(dashboardData?.balances?.totalIncome || 0)}
                        </p>
                        <p className="text-xs font-medium text-slate-500 mt-1">
                          Total earnings tracked
                        </p>
                      </div>
                      <LuTrendingUp className="text-4xl text-emerald-500/20 mb-1" />
                    </div>
                  </div>

                  {/* Expense Snapshot */}
                  <div className="card-premium h-fit">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-900">Expense Insight</h3>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full uppercase">Last 30 Days</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-slate-900">
                          ${addThousandsSeparator(dashboardData?.balances?.totalExpense || 0)}
                        </p>
                        <p className="text-xs font-medium text-slate-500 mt-1">
                          Total spendings tracked
                        </p>
                      </div>
                      <IoMdCard className="text-4xl text-rose-500/20 mb-1" />
                    </div>
                  </div>
                </div>

                {/* Analytical Placeholder/Chart would go here */}
                <div className="card-premium min-h-[320px] flex items-center justify-center border-dashed">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <LuTrendingUp className="text-2xl text-slate-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Advanced Analytics</p>
                    <p className="text-xs text-slate-500 mt-1">Data visualization features coming in v2.0</p>
                  </div>
                </div>
              </div>

              {/* Sidebar: Recent Activity */}
              <div className="lg:col-span-1">
                <div className="card-premium h-full">
                  <header className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Activity</h3>
                    <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase">View All</button>
                  </header>
                  <RecentTransactions />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Home;
