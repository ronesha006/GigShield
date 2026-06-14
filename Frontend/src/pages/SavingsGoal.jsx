import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function SavingsGoal() {
  const navigate = useNavigate();

  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savingPerDay, setSavingPerDay] = useState("");
  const [numberOfDays, setNumberOfDays] = useState("");
  
  const [data, setData] = useState(null);
  const [savedSoFar, setSavedSoFar] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/dashboard");
        setData(res.data);
        if (res.data.goals && res.data.goals[0]) {
          setSavedSoFar(res.data.goals[0].saved || 0);
          setTargetAmount(res.data.goals[0].target?.toString() || "");
          setGoalName(res.data.goals[0].name || "");
          
          // Calculate initial values if goal exists
          if (res.data.goals[0].target) {
            const remaining = res.data.goals[0].target - (res.data.goals[0].saved || 0);
            const defaultDays = 30;
            setNumberOfDays(defaultDays.toString());
            setSavingPerDay(Math.ceil(remaining / defaultDays).toString());
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  // Calculate when target amount changes
  const handleTargetChange = (value) => {
    setTargetAmount(value);
    if (value && numberOfDays && Number(numberOfDays) > 0) {
      const remaining = Number(value) - savedSoFar;
      const perDay = Math.ceil(remaining / Number(numberOfDays));
      setSavingPerDay(perDay.toString());
    }
  };

  // Calculate when saving per day changes
  const handleSavingPerDayChange = (value) => {
    setSavingPerDay(value);
    if (value && targetAmount && Number(value) > 0) {
      const remaining = Number(targetAmount) - savedSoFar;
      const days = Math.ceil(remaining / Number(value));
      setNumberOfDays(days.toString());
    }
  };

  // Calculate when number of days changes
  const handleDaysChange = (value) => {
    setNumberOfDays(value);
    if (value && targetAmount && Number(value) > 0) {
      const remaining = Number(targetAmount) - savedSoFar;
      const perDay = Math.ceil(remaining / Number(value));
      setSavingPerDay(perDay.toString());
    }
  };

  const handleSubmit = async () => {
    if (!goalName || !targetAmount) {
      alert("Please fill in goal name and target amount");
      return;
    }

    try {
      await API.post("/create-goal", {
        name: goalName,
        target: Number(targetAmount),
      });
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Failed to save goal");
    }
  };

  const handleUpdateSavings = async () => {
    if (!savingPerDay || !numberOfDays) {
      alert("Please set saving amount per day");
      return;
    }

    // Calculate total savings to add
    const dailyAmount = Number(savingPerDay);
    const days = Number(numberOfDays);
    const totalToSave = dailyAmount * days;
    
    try {
      await API.post("/add-savings", totalToSave);
      // Refresh data
      const res = await API.get("/dashboard");
      setData(res.data);
      if (res.data.goals && res.data.goals[0]) {
        setSavedSoFar(res.data.goals[0].saved || 0);
      }
      setIsEditing(false);
    } catch (err) {
      console.log(err);
      alert("Failed to update savings");
    }
  };

  if (!data) {
    return <div className="text-white p-6">Loading...</div>;
  }

  const remaining = targetAmount ? Number(targetAmount) - savedSoFar : 0;
  const progress = targetAmount > 0 ? (savedSoFar / Number(targetAmount)) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-6 flex items-center gap-3">
        <i className="ti ti-target text-blue-600 text-3xl"></i> Savings Goal Planner
      </h1>

      <div className="bg-white border border-slate-200/80 shadow-sm rounded-3xl p-8 space-y-6">
        
        {/* Goal Name - Editable */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Goal Name</label>
          <input
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:border-blue-500 focus:bg-white focus:outline-none transition"
            placeholder="e.g., New Bicycle, Vacation, Emergency Fund"
          />
        </div>

        {/* Target Amount - Editable */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Target Amount (₹)</label>
          <input
            type="number"
            value={targetAmount}
            onChange={(e) => handleTargetChange(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:border-blue-500 focus:bg-white focus:outline-none transition"
            placeholder="e.g., 50000"
          />
        </div>

        {/* Current Progress Display */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-slate-750 text-sm uppercase tracking-wider">Current Progress</span>
            <span className="font-bold text-slate-800">₹{savedSoFar} / ₹{targetAmount || 0}</span>
          </div>
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-3 text-sm font-semibold text-slate-600">
            <span>{progress.toFixed(0)}% Complete</span>
            <span>Remaining: ₹{remaining}</span>
          </div>
        </div>

        {/* Interactive Savings Calculator */}
        <div className="bg-slate-50 border border-slate-200/65 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            🎯 Plan Your Savings
          </h3>

          {/* Saving Per Day - Editable */}
          <div>
            <label className="block mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Savings Amount Per Day (₹)
            </label>
            <input
              type="number"
              value={savingPerDay}
              onChange={(e) => handleSavingPerDayChange(e.target.value)}
              className="w-full p-3 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold focus:border-blue-500 focus:outline-none transition"
              placeholder="e.g., 500"
            />
            <p className="text-xs text-slate-400 mt-1.5 font-medium">
              How much you can save each day
            </p>
          </div>

          {/* Number of Days - Editable */}
          <div>
            <label className="block mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Number of Days
            </label>
            <input
              type="number"
              value={numberOfDays}
              onChange={(e) => handleDaysChange(e.target.value)}
              className="w-full p-3 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold focus:border-blue-500 focus:outline-none transition"
              placeholder="e.g., 30"
            />
            <p className="text-xs text-slate-400 mt-1.5 font-medium">
              Days needed to reach your goal
            </p>
          </div>

          {/* Quick Calculation Display */}
          {savingPerDay && numberOfDays && (
            <div className="bg-white border border-slate-200/50 rounded-xl p-4 mt-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total savings in {numberOfDays} days:
              </p>
              <p className="text-2xl font-black text-blue-600 mt-1">
                ₹{Number(savingPerDay) * Number(numberOfDays)}
              </p>
              {Number(savingPerDay) * Number(numberOfDays) >= remaining && (
                <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
                  ✓ You'll reach your goal early!
                </p>
              )}
              {Number(savingPerDay) * Number(numberOfDays) < remaining && (
                <p className="text-xs text-amber-600 font-bold mt-2 flex items-center gap-1">
                  ⚠ You'll need more days to reach your goal
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => navigate("/")}
            className="py-3 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition font-bold shadow-sm cursor-pointer"
            >
              Plan Savings Strategy
            </button>
          ) : (
            <button
              onClick={handleUpdateSavings}
              className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition font-bold shadow-sm cursor-pointer"
            >
              Apply Savings Plan
            </button>
          )}
        </div>

        {/* Save Goal Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition text-white font-bold shadow-sm cursor-pointer mt-4"
        >
          Save Goal
        </button>

        {/* Help Text */}
        <div className="text-xs text-slate-400 text-center border-t border-slate-100 pt-4 font-medium leading-relaxed">
          <p>💡 Tip: Edit any field - the others will auto-update!</p>
          <p className="mt-1">Set your daily savings OR target days to calculate the other.</p>
        </div>
      </div>
    </div>
  );
}