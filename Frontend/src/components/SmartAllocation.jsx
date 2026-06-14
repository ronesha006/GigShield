import { useState, useEffect } from "react";
import API from "../api/api";

export default function SmartAllocation({ onAllocationComplete }) {
  const [allocationPercent, setAllocationPercent] = useState(30);
  const [customAmount, setCustomAmount] = useState("");
  const [netSavings, setNetSavings] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningData, setWarningData] = useState(null);
  const [savingsData, setSavingsData] = useState(null);
  const [allocationMode, setAllocationMode] = useState("percentage"); // percentage or custom

  useEffect(() => {
    fetchSavingsOverview();
  }, []);

  const fetchSavingsOverview = async () => {
    try {
      const res = await API.get("/savings-overview");
      setSavingsData(res.data);
      setNetSavings(res.data.net_savings);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePercentageChange = async (value) => {
    const percent = parseInt(value);
    setAllocationPercent(percent);
    
    await API.post("/set-savings-percentage", { percentage: percent });
    
    const amount = (netSavings * percent) / 100;
    setCustomAmount(amount.toFixed(0));
  };

  const handleCustomAmountChange = (value) => {
    const amount = parseFloat(value);
    setCustomAmount(value);
    
    if (!isNaN(amount) && netSavings > 0) {
      const percent = (amount / netSavings) * 100;
      setAllocationPercent(Math.round(percent));
    }
  };

  const handleAllocate = async () => {
    let amountToAllocate;
    
    if (allocationMode === "percentage") {
      amountToAllocate = (netSavings * allocationPercent) / 100;
    } else {
      amountToAllocate = parseFloat(customAmount);
    }
    
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
    return <div className="text-white">Loading savings data...</div>;
  }

  const recommendedAmount = savingsData.recommendations.recommended;
  const maxRecommended = netSavings * 0.5;
  const currentAllocation = allocationMode === "percentage" 
    ? (netSavings * allocationPercent) / 100 
    : parseFloat(customAmount) || 0;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white"> Smart Savings Allocator</h2>
      
      {/* Net Savings Display */}
      <div className="bg-green-900/30 border border-green-700 rounded-xl p-4">
        <p className="text-slate-300">Today's Net Savings</p>
        <p className="text-3xl font-bold text-green-400">₹{netSavings.toLocaleString()}</p>
        <p className="text-sm text-slate-400">
          Income: ₹{savingsData.total_income} - Expenses: ₹{savingsData.total_expense}
        </p>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-4">
        <button
          onClick={() => setAllocationMode("percentage")}
          className={`flex-1 py-2 rounded-lg transition ${
            allocationMode === "percentage" 
              ? "bg-blue-600 text-white" 
              : "bg-slate-700 text-slate-300"
          }`}
        >
          Percentage Mode
        </button>
        <button
          onClick={() => setAllocationMode("custom")}
          className={`flex-1 py-2 rounded-lg transition ${
            allocationMode === "custom" 
              ? "bg-blue-600 text-white" 
              : "bg-slate-700 text-slate-300"
          }`}
        >
          Custom Amount
        </button>
      </div>

      {/* Percentage Slider */}
      {allocationMode === "percentage" && (
        <div className="space-y-4">
          <div className="flex justify-between">
            <label className="text-slate-300">Allocation Percentage</label>
            <span className="text-2xl font-bold text-blue-400">{allocationPercent}%</span>
          </div>
          
          <input
            type="range"
            min="0"
            max="100"
            value={allocationPercent}
            onChange={(e) => handlePercentageChange(e.target.value)}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${
                allocationPercent > 50 ? '#ef4444' : '#3b82f6'
              } 0%, ${
                allocationPercent > 50 ? '#ef4444' : '#3b82f6'
              } ${allocationPercent}%, #334155 ${allocationPercent}%, #334155 100%)`
            }}
          />
          
          <div className="flex justify-between text-sm text-slate-400">
            <span>0% (Save Nothing)</span>
            <span className="text-yellow-400">50% (Recommended)</span>
            <span>100% (All Savings)</span>
          </div>
        </div>
      )}

      {/* Custom Amount Input */}
      {allocationMode === "custom" && (
        <div>
          <label className="block mb-2 text-slate-300">Custom Amount (₹)</label>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-500 focus:outline-none"
            placeholder="Enter amount to save"
          />
        </div>
      )}

      {/* Current Allocation Preview */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <p className="text-slate-300 mb-2">Current Allocation:</p>
        <p className="text-xl font-bold">
          ₹{currentAllocation.toLocaleString()}
        </p>
        <p className="text-sm text-slate-400">
          {((currentAllocation / netSavings) * 100).toFixed(1)}% of net savings
        </p>
        
        {/* Warning Indicator */}
        {currentAllocation > maxRecommended && (
          <div className="mt-2 text-red-400 text-sm flex items-center gap-2">
            Exceeds recommended 50% limit
          </div>
        )}
        
        {/* Recommendation */}
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-sm text-green-400">
             Recommended: Save ₹{recommendedAmount.toLocaleString()} (50%)
          </p>
        </div>
      </div>

      {/* Allocate Button */}
      <button
        onClick={handleAllocate}
        disabled={netSavings <= 0}
        className={`w-full py-3 rounded-xl font-semibold transition ${
          netSavings > 0
            ? currentAllocation > maxRecommended
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-green-600 hover:bg-green-700"
            : "bg-gray-600 cursor-not-allowed"
        }`}
      >
        {netSavings > 0 
          ? `Allocate ₹${currentAllocation.toLocaleString()} to Goals`
          : "No Savings Available"}
      </button>

      {/* Warning Modal */}
      {showWarning && warningData && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border-2 border-red-500">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              High Savings Alert!
            </h3>
            <p className="text-slate-300 mb-4">
              {warningData.message}
            </p>
            <div className="bg-slate-900 p-3 rounded-lg mb-4">
              <p> Details:</p>
              <p>Net Savings: ₹{warningData.net_savings}</p>
              <p>Requested: ₹{warningData.requested_amount}</p>
              <p>Recommended Max: ₹{warningData.recommended_max}</p>
              <p>Exceeds by: ₹{warningData.exceeds_by}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWarning(false)}
                className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
              >
                Adjust Amount
              </button>
              <button
                onClick={handleForceAllocate}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
              >
                Save Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goals Progress */}
      {savingsData.goals && savingsData.goals.length > 0 && (
        <div className="border-t border-slate-700 pt-4">
          <h3 className="font-semibold mb-3">Your Goals Progress:</h3>
          {savingsData.goals.map((goal) => (
            <div key={goal.id} className="mb-3">
              <div className="flex justify-between text-sm">
                <span>{goal.name}</span>
                <span>₹{goal.saved} / ₹{goal.target}</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-green-500 transition-all"
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