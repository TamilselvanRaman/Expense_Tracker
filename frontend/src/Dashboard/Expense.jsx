import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layouts/DashboardLayout";
import { useUserAuth } from "../Hooks/useUserAuth";
import axiosInstance from "../Utils/axiosInstance";
import { API_ENDPOINTS } from "../Utils/API_Paths";
import { addThousandsSeparator } from "../Utils/helper";
import { LuPlus, LuDownload, LuTrash2, LuShoppingBag } from "react-icons/lu";

function Expense() {
  const { loading } = useUserAuth();
  const [expenses, setExpenses] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    icon: "💰",
    category: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
  });

  const fetchExpenses = async () => {
    try {
      setIsFetching(true);
      const response = await axiosInstance.get(API_ENDPOINTS.EXPENSE.GET_ALL);
      if (response.data && response.data.status === 'success') {
        setExpenses(response.data.data.expenses || []);
      }
    } catch (err) {
      console.error("Error fetching expenses:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.EXPENSE.ADD,
        formData
      );
      if (response.data && response.data.status === 'success') {
        setShowAddForm(false);
        setFormData({ icon: "💰", category: "", amount: "", date: new Date().toISOString().split('T')[0] });
        fetchExpenses();
      }
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_ENDPOINTS.EXPENSE.DELETE}/${id}`);
      if (response.data && response.data.status === 'success') {
        fetchExpenses();
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  const downloadExcel = async () => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.EXPENSE.DOWNLOAD_EXCEL,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `expense_report_${new Date().toLocaleDateString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading Excel:", err);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchExpenses();
    }
  }, [loading]);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Expense Ledger</h1>
            <p className="text-slate-500 mt-1 font-medium">Track and analyze your expenditure patterns.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={downloadExcel}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-slate-700 px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
            >
              <LuDownload className="text-lg" />
              <span className="hidden sm:inline">Export History</span>
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              <LuPlus className="text-lg" />
              <span>Log Expense</span>
            </button>
          </div>
        </div>

        {/* Add Form with Premium Styling */}
        {showAddForm && (
          <div className="card-premium mb-8 ring-2 ring-indigo-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <LuPlus />
              </span>
              New Expenditure Entry
            </h2>
            <form onSubmit={addExpense} className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Benefit Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm outline-none"
                  required
                >
                  <option value="💰">💰 General</option>
                  <option value="🍔">🍔 Food</option>
                  <option value="🚗">🚗 Transportation</option>
                  <option value="🏠">🏠 Rent</option>
                  <option value="💡">💡 Utilities</option>
                  <option value="🎬">🎬 Entertainment</option>
                  <option value="🏥">🏥 Healthcare</option>
                  <option value="🛍️">🛍️ Shopping</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expenditure Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm outline-none"
                  placeholder="e.g. Groceries"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cost (USD)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm outline-none font-semibold text-rose-600"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Transaction Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm outline-none"
                  required
                />
              </div>

              <div className="md:col-span-4 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg"
                >
                  Log Transaction
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List View with Table Polish */}
        {loading || isFetching ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="card-premium overflow-hidden !p-0">
            {expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <LuShoppingBag className="text-5xl mb-3 opacity-20" />
                <p className="font-semibold text-slate-900">Ledger Clear</p>
                <p className="text-sm mt-1">No expenditures recorded for this period.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Classification</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Settlement Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {expenses.map((expense) => (
                      <tr key={expense._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center text-xl">
                            {expense.icon}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 text-sm">{expense.category}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">Commercial Outflow</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-lg">
                            -${addThousandsSeparator(expense.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">
                          {new Date(expense.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => deleteExpense(expense._id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Record"
                          >
                            <LuTrash2 className="text-lg" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Expense;
