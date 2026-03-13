import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layouts/DashboardLayout";
import { useUserAuth } from "../Hooks/useUserAuth";
import axiosInstance from "../Utils/axiosInstance";
import { API_ENDPOINTS } from "../Utils/API_Paths";
import { addThousandsSeparator } from "../Utils/helper";
import { LuPlus, LuDownload, LuTrash2, LuWalletMinimal } from "react-icons/lu";

function Income() {
  const { loading } = useUserAuth();
  const [incomes, setIncomes] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    icon: "💼",
    source: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
  });

  const fetchIncomes = async () => {
    try {
      setIsFetching(true);
      const response = await axiosInstance.get(API_ENDPOINTS.INCOME.GET_ALL);
      if (response.data && response.data.status === 'success') {
        setIncomes(response.data.data.income || []);
      }
    } catch (err) {
      console.error("Error fetching incomes:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const addIncome = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.INCOME.ADD,
        formData
      );
      if (response.data && response.data.status === 'success') {
        setShowAddForm(false);
        setFormData({ icon: "💼", source: "", amount: "", date: new Date().toISOString().split('T')[0] });
        fetchIncomes();
      }
    } catch (err) {
      console.error("Error adding income:", err);
    }
  };

  const deleteIncome = async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_ENDPOINTS.INCOME.DELETE}/${id}`);
      if (response.data && response.data.status === 'success') {
        fetchIncomes();
      }
    } catch (err) {
      console.error("Error deleting income:", err);
    }
  };

  const downloadExcel = async () => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.INCOME.DOWNLOAD_EXCEL,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `income_report_${new Date().toLocaleDateString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading Excel:", err);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchIncomes();
    }
  }, [loading]);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Income Portfolio</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage and monitor your revenue streams.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={downloadExcel}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-slate-700 px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
            >
              <LuDownload className="text-lg" />
              <span className="hidden sm:inline">Export Report</span>
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              <LuPlus className="text-lg" />
              <span>Record Income</span>
            </button>
          </div>
        </div>

        {/* Add Form with Premium Styling */}
        {showAddForm && (
          <div className="card-premium mb-8 ring-2 ring-indigo-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <LuPlus />
              </span>
              New Income Entry
            </h2>
            <form onSubmit={addIncome} className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm outline-none"
                  required
                >
                  <option value="💼">💼 Salary</option>
                  <option value="💻">💻 Freelance</option>
                  <option value="📈">📈 Investments</option>
                  <option value="🏠">🏠 Rental</option>
                  <option value="🛒">🛒 Business</option>
                  <option value="🎁">🎁 Bonus</option>
                  <option value="💰">💰 Other</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Source / Client</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm outline-none"
                  placeholder="e.g. Acme Corp"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amount (USD)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm outline-none font-semibold text-emerald-600"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Posting Date</label>
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
                  Commit Entry
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
            {incomes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <LuWalletMinimal className="text-5xl mb-3 opacity-20" />
                <p className="font-semibold text-slate-900">Portfolio Empty</p>
                <p className="text-sm mt-1">Start recording your income sources.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Asset</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Origin</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Valuation</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Execution Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {incomes.map((income) => (
                      <tr key={income._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center text-xl">
                            {income.icon}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 text-sm">{income.source}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">Verified Entry</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                            +${addThousandsSeparator(income.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">
                          {new Date(income.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => deleteIncome(income._id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Purge Entry"
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

export default Income;
