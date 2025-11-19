import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layouts/DashboardLayout";
import { useUserAuth } from "../Hooks/useUserAuth";
import axiosInstance from "../Utils/axiosInstance";
import { API_ENDPOINTS } from "../Utils/API_Paths";
import { addThousandsSeparator } from "../Utils/helper";

function Income() {
  const { loading } = useUserAuth();
  const [incomes, setIncomes] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    icon: "💼",
    source: "",
    amount: "",
    date: "",
  });

  // Fetch all incomes
  const fetchIncomes = async () => {
    try {
      setIsFetching(true);
      const response = await axiosInstance.get(API_ENDPOINTS.INCOME.GET_ALL);
      if (response.data) {
        setIncomes(response.data.income || []);
      }
    } catch (err) {
      console.error("Error fetching incomes:", err);
    } finally {
      setIsFetching(false);
    }
  };

  // Add new income
  const addIncome = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.INCOME.ADD,
        formData
      );
      if (response.data) {
        setShowAddForm(false);
        setFormData({ icon: "💼", source: "", amount: "", date: "" });
        fetchIncomes(); // Refresh the list
      }
    } catch (err) {
      console.error("Error adding income:", err);
    }
  };

  // Delete income
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(`${API_ENDPOINTS.INCOME.DELETE}/${id}`);
      fetchIncomes(); // Refresh the list
    } catch (err) {
      console.error("Error deleting income:", err);
    }
  };

  // Download Excel
  const downloadExcel = async () => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.INCOME.DOWNLOAD_EXCEL,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income.xlsx");
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
      <div className="my-5 mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Income Management</h1>
          <div className="space-x-2">
            <button
              onClick={downloadExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Download Excel
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Income
            </button>
          </div>
        </div>

        {/* Add Income Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Income</h2>
            <form
              onSubmit={addIncome}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
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

              <div>
                <label className="block text-sm font-medium mb-2">Source</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g., Company Name, Client, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div className="md:col-span-2 flex space-x-2">
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Income
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Incomes List */}
        {loading || isFetching ? (
          <p className="text-center">Loading incomes...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {incomes.length === 0 ? (
              <p className="text-center p-8 text-gray-500">
                No incomes found. Add your first income source!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Icon
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {incomes.map((income) => (
                      <tr key={income._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-2xl">{income.icon}</td>
                        <td className="px-6 py-4 font-medium">
                          {income.source}
                        </td>
                        <td className="px-6 py-4 text-green-600 font-semibold">
                          +${addThousandsSeparator(income.amount)}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(income.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => deleteIncome(income._id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
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
