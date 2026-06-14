import { useState, useEffect } from "react";
import API from "../api/api";
import { useI18n } from '../i18n'

export default function SmartAllocation({ onAllocationComplete }) {
  const { t } = useI18n();
  // const [allocationPercent, setAllocationPercent] = useState(30); // COMMENTED OUT - Percentage mode disabled
  const [customAmount, setCustomAmount] = useState("");
  const [netSavings, setNetSavings] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningData, setWarningData] = useState(null);
  const [savingsData, setSavingsData] = useState(null);
  // const [allocationMode, setAllocationMode] = useState("percentage"); // COMMENTED OUT - Using only custom mode
  const [badDayMode, setBadDayMode] = useState(false);

  useEffect(() => {
    fetchSavingsOverview();
    fetchIncomeEngine();
  }, []);

  const fetchIncomeEngine = async () => {
    try {
      const res = await API.get("/income-engine");
      setBadDayMode(res.data.bad_day_mode);
    } catch (err) {
      console.error("Income engine fetch failed", err);
    }
  };

  const fetchSavingsOverview = async () => {
    try {
      const res = await API.get("/savings-overview");
      setSavingsData(res.data);
      setNetSavings(res.data.net_savings ?? 0);
    } catch (err) {
      console.error(err);
    }
  };

  // COMMENTED OUT - Percentage mode handler
  // const handlePercentageChange = async (value) => {
  //   const percent = parseInt(value);
  //   setAllocationPercent(percent);
  //   
  //   await API.post("/set-savings-percentage", { percentage: percent });
  //   
  //   const availableToAllocate = savingsData?.available_savings || netSavings;
  //   const amount = (availableToAllocate * percent) / 100;
  //   setCustomAmount(amount.toFixed(0));
  // };

  const handleCustomAmountChange = (value) => {
    const amount = parseFloat(value);
    setCustomAmount(value);
    
    if (!isNaN(amount) && netSavings > 0) {
      // const percent = (amount / netSavings) * 100; // COMMENTED OUT
      // setAllocationPercent(Math.round(percent)); // COMMENTED OUT
    }
  };

  const handleAllocate = async () => {
    let amountToAllocate;
    
    // COMMENTED OUT - Percentage mode
    // if (allocationMode === "percentage") {
    //   const availableToAllocate = savingsData?.available_savings || netSavings;
    //   amountToAllocate = (availableToAllocate * allocationPercent) / 100;
    // } else {
    //   amountToAllocate = parseFloat(customAmount);
    // }
    
    // USING ONLY CUSTOM AMOUNT
    amountToAllocate = parseFloat(customAmount);
    
    if (isNaN(amountToAllocate) || amountToAllocate <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    
    try {
      const response = await API.post("/allocate-savings", {
        amount: amountToAllocate,
        force_override: false
      });
      
      // Check if warning is returned
      if (response.data.warning) {
        setWarningData(response.data);
        setShowWarning(true);
      } else if (response.data.error) {
        alert(response.data.error);
      } else {
        alert(`${response.data.message}\nAllocated: ₹${response.data.allocated_amount}\nRemaining: ₹${response.data.remaining_net}`);
        fetchSavingsOverview();
        if (onAllocationComplete) onAllocationComplete();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to allocate savings");
    }
  };

  const handleForceAllocate = async () => {
    try {
      const response = await API.post("/allocate-savings", {
        amount: warningData.requested_amount,
        force_override: true
      });
      
      alert(`${response.data.message}\nAllocated: ₹${response.data.allocated_amount}`);
      setShowWarning(false);
      fetchSavingsOverview();
      if (onAllocationComplete) onAllocationComplete();
    } catch (err) {
      console.error(err);
      alert("Failed to allocate savings");
    }
  };

  if (!savingsData) {
    return <div className="text-slate-500 font-semibold">{t('loading') || 'Loading savings data...'}</div>;
  }

  // const recommendedAmount = savingsData.recommendations?.recommended ?? Math.round(netSavings * 0.5); // COMMENTED OUT
  const availableToAllocate = savingsData?.available_savings || netSavings;
  const maxRecommended = availableToAllocate * 0.5;
  // const currentAllocation = allocationMode === "percentage"  // COMMENTED OUT
  //   ? (availableToAllocate * allocationPercent) / 100 
  //   : parseFloat(customAmount) || 0;
  const currentAllocation = parseFloat(customAmount) || 0;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
        <i className="ti ti-piggy-bank text-blue-600"></i> {t('smart_allocator')}
      </h2>
      
      {/* Net Savings Display */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
        <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider">{t('todays_net')}</p>
        <p className="text-3xl font-black text-emerald-600 mt-1">
          ₹{(savingsData.available_savings ?? netSavings).toLocaleString()}
        </p>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Income: ₹{savingsData.total_income} · Expenses: ₹{savingsData.total_expense}
        </p>
        {savingsData.allocated_savings > 0 && (
          <p className="text-xs text-blue-650 font-bold mt-1.5 flex items-center gap-1">
            Already allocated to goals: ₹{savingsData.allocated_savings.toLocaleString()}
          </p>
        )}
      </div>

      {/* Custom Amount Input - ALWAYS VISIBLE */}
      <div>
        <label className="block mb-2 text-sm font-semibold text-slate-700">{t('custom_amount')} (₹)</label>
        <input
          type="number"
          value={customAmount}
          onChange={(e) => handleCustomAmountChange(e.target.value)}
          className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:border-blue-500 focus:bg-white focus:outline-none transition"
          placeholder="Enter amount to save"
        />
      </div>

      {/* Current Allocation Preview */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
        <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider mb-2">Amount to Save:</p>
        <p className="text-2xl font-black text-slate-800">
          ₹{currentAllocation.toLocaleString()}
        </p>
        <p className="text-xs text-slate-400 font-medium mt-1">
          {((currentAllocation / availableToAllocate) * 100).toFixed(1)}% of available savings
        </p>
        
        {/* Warning Indicator */}
        {currentAllocation > maxRecommended && (
          <div className="mt-2 text-amber-600 text-xs font-bold flex items-center gap-1">
            ⚠️ This exceeds the recommended 50% limit
          </div>
        )}
        
        {/* Recommendation */}
        <div className="mt-3 pt-3 border-t border-slate-200">
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            💡 Recommended: Save ₹{maxRecommended.toLocaleString()} (50% of available)
          </p>
        </div>
      </div>

      {/* Allocate Button */}
      <button
        onClick={handleAllocate}
        disabled={netSavings <= 0}
        className={`w-full py-3.5 rounded-xl font-bold transition shadow-sm cursor-pointer ${
          netSavings > 0
            ? currentAllocation > maxRecommended
              ? "bg-amber-600 hover:bg-amber-700 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
            : "bg-slate-100 border border-slate-250 text-slate-400 cursor-not-allowed"
        }`}
      >
        {netSavings > 0 && !badDayMode
          ? `Save ₹${currentAllocation.toLocaleString()} to Goals`
          : badDayMode ? "Bad Day Mode Active - Savings Paused" : "No Savings Available"}
      </button>

      {badDayMode && (
        <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 font-semibold text-sm">
          {t('bad_day_message')}
        </div>
      )}

      {/* Warning Modal */}
      {showWarning && warningData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl">
            <div className="text-amber-500 text-5xl mb-4 text-center">⚠️</div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-4 text-center">
              High Savings Alert!
            </h3>
            <p className="text-slate-600 font-medium mb-4 leading-relaxed">
              {warningData.message}
            </p>
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl mb-4 text-slate-700 font-medium space-y-1 text-sm">
              <p className="font-bold text-slate-800 mb-2">📊 Details:</p>
              <p>Available Savings: <span className="font-bold text-slate-900">₹{warningData.available_savings?.toLocaleString() || warningData.net_savings?.toLocaleString()}</span></p>
              <p>Requested: <span className="font-bold text-slate-900">₹{warningData.requested_amount?.toLocaleString()}</span></p>
              <p>Recommended Max: <span className="font-bold text-slate-900">₹{warningData.recommended_max?.toLocaleString()} (50%)</span></p>
              <p>Exceeds by: <span className="font-bold text-red-650">₹{warningData.exceeds_by?.toLocaleString()}</span></p>
            </div>
            <p className="text-amber-600 text-xs font-bold mb-6">
              Saving more than 50% might leave you short for unexpected expenses.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWarning(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold transition cursor-pointer"
              >
                Adjust Amount
              </button>
              <button
                onClick={handleForceAllocate}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition cursor-pointer"
              >
                Save Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goals Progress */}
      {savingsData.goals && savingsData.goals.length > 0 && (
        <div className="border-t border-slate-100 pt-4">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Your Goals Progress:</h3>
          {savingsData.goals.map((goal) => (
            <div key={goal.id} className="mb-3">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>{goal.name}</span>
                <span>₹{goal.saved.toLocaleString()} / ₹{goal.target.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1 border border-slate-200/40">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(goal.saved / goal.target) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}