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
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Savings Goal Planner</h1>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-6">
          
          {/* Goal Name - Editable */}
          <div>
            <label className="block mb-2 font-semibold">Goal Name</label>
            <input
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-green-500 focus:outline-none"
              placeholder="e.g., New Bicycle, Vacation, Emergency Fund"
            />
          </div>

          {/* Target Amount - Editable */}
          <div>
            <label className="block mb-2 font-semibold">Target Amount (₹)</label>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => handleTargetChange(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-green-500 focus:outline-none"
              placeholder="e.g., 50000"
            />
          </div>

          {/* Current Progress Display */}
          <div className="bg-green-900/30 border border-green-700 rounded-xl p-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Current Progress</span>
              <span>₹{savedSoFar} / ₹{targetAmount || 0}</span>
            </div>
            <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-slate-300">
              {progress.toFixed(0)}% Complete
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Remaining: ₹{remaining}
            </p>
          </div>

          {/* Interactive Savings Calculator */}
          <div className="bg-slate-800/50 rounded-xl p-4 space-y-4">
            <h3 className="text-lg font-semibold text-green-400">
              🎯 Plan Your Savings
            </h3>

            {/* Saving Per Day - Editable */}
            <div>
              <label className="block mb-2 text-sm text-slate-300">
                Savings Amount Per Day (₹)
              </label>
              <input
                type="number"
                value={savingPerDay}
                onChange={(e) => handleSavingPerDayChange(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-green-500 focus:outline-none"
                placeholder="e.g., 500"
              />
              <p className="text-xs text-slate-400 mt-1">
                How much you can save each day
              </p>
            </div>

            {/* Number of Days - Editable */}
            <div>
              <label className="block mb-2 text-sm text-slate-300">
                Number of Days
              </label>
              <input
                type="number"
                value={numberOfDays}
                onChange={(e) => handleDaysChange(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-green-500 focus:outline-none"
                placeholder="e.g., 30"
              />
              <p className="text-xs text-slate-400 mt-1">
                Days needed to reach your goal
              </p>
            </div>

            {/* Quick Calculation Display */}
            {savingPerDay && numberOfDays && (
              <div className="bg-slate-900 rounded-lg p-3 mt-2">
                <p className="text-sm text-slate-300">
                  Total savings in {numberOfDays} days:
                </p>
                <p className="text-xl font-bold text-green-400">
                  ₹{Number(savingPerDay) * Number(numberOfDays)}
                </p>
                {Number(savingPerDay) * Number(numberOfDays) > remaining && (
                  <p className="text-xs text-green-400 mt-1">
                    ✓ You'll reach your goal early!
                  </p>
                )}
                {Number(savingPerDay) * Number(numberOfDays) < remaining && (
                  <p className="text-xs text-orange-400 mt-1">
                    ⚠ You'll need more days to reach your goal
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
              >
                Plan Savings Strategy
              </button>
            ) : (
              <button
                onClick={handleUpdateSavings}
                className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 transition font-semibold"
              >
                Apply Savings Plan
              </button>
            )}

            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 transition font-semibold"
            >
              Save Goal
            </button>
          </div>

          {/* Help Text */}
          <div className="text-sm text-slate-400 text-center border-t border-slate-700 pt-4">
            <p>💡 Tip: Edit any field - the others will auto-update!</p>
            <p className="mt-1">Set your daily savings OR target days to calculate the other.</p>
          </div>

        </div>
      </div>
    </div>
  );
}