import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { useI18n } from '../i18n'

export default function DailyLog() {
  const navigate = useNavigate();
  const { t } = useI18n();

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
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white border border-slate-200/80 shadow-sm rounded-3xl p-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Daily Activity Log
        </h1>
        <p className="text-slate-500 font-medium mb-6">
          {t('track_today')}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('earned_today')}</label>
            <input
              type="number"
              name="earned"
              placeholder="e.g. 500"
              value={formData.earned}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:border-blue-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Food Expense (₹)</label>
            <input
              type="number"
              name="food"
              placeholder="e.g. 150"
              value={formData.food}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:border-blue-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Transport Expense (₹)</label>
            <input
              type="number"
              name="transport"
              placeholder="e.g. 100"
              value={formData.transport}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:border-blue-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Medical Expense (₹)</label>
            <input
              type="number"
              name="medical"
              placeholder="e.g. 200"
              value={formData.medical}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:border-blue-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Other Expense (₹)</label>
            <input
              type="number"
              name="other"
              placeholder="e.g. 50"
              value={formData.other}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:border-blue-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-slate-705 font-bold flex justify-between items-center mt-6">
            <span>{t('total_expense_today')}</span>
            <span className="text-red-600 text-lg">₹{totalExpense}</span>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-all text-white font-bold shadow-sm cursor-pointer"
            >
              {t('save_log')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}