import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function DailyLog() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    earned: "",
    food: "",
    transport: "",
    medical: "",
    other: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const totalExpense =
    Number(formData.food || 0) +
    Number(formData.transport || 0) +
    Number(formData.medical || 0) +
    Number(formData.other || 0);

  const handleSubmit = async () => {
    try{
      await API.post("/log-income", {
        amount: Number(formData.earned),
      });

      await API.post("/log-expense", {
        food: Number(formData.food),
        transport: Number(formData.transport),
        medical: Number(formData.medical),
        other: Number(formData.other),
      });

      navigate("/");

    }
    catch(error){
      console.log(error);
      alert("Failed to save data");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold text-white mb-2">
          Daily Log
        </h1>

        <p className="text-gray-300 mb-6">
          Track today's income and expenses.
        </p>

        <div className="space-y-4">

          <input
            type="number"
            name="earned"
            placeholder="Earned Today (₹)"
            value={formData.earned}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
          />

          <input
            type="number"
            name="food"
            placeholder="Food Expense (₹)"
            value={formData.food}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
          />

          <input
            type="number"
            name="transport"
            placeholder="Transport Expense (₹)"
            value={formData.transport}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
          />

          <input
            type="number"
            name="medical"
            placeholder="Medical Expense (₹)"
            value={formData.medical}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
          />

          <input
            type="number"
            name="other"
            placeholder="Other Expense (₹)"
            value={formData.other}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
          />

          <div className="bg-white/10 border border-white/20 rounded-xl p-3 text-white">
            Total Expense Today: ₹{totalExpense}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-all text-white font-semibold"
          >
            Save Log
          </button>

        </div>
      </div>
    </div>
  );
}