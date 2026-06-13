import { useState, useEffect } from "react";

export default function SavingsGoal() {
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  // Pretend this came from backend insights
  const safeSavingPerDay = 300;
  const safeSpendPerDay = 500;

  const [dailySaving, setDailySaving] = useState(safeSavingPerDay);
  const [days, setDays] = useState(0);

  const [savedSoFar, setSavedSoFar] = useState(1500);

  useEffect(() => {
    if (targetAmount && dailySaving) {
      setDays(
        Math.ceil(Number(targetAmount) / Number(dailySaving))
      );
    }
  }, [targetAmount]);

  const handleDailySavingChange = (value) => {
    setDailySaving(value);

    if (targetAmount && value) {
      setDays(
        Math.ceil(Number(targetAmount) / Number(value))
      );
    }
  };

  const handleDaysChange = (value) => {
    setDays(value);

    if (targetAmount && value) {
      setDailySaving(
        Math.ceil(Number(targetAmount) / Number(value))
      );
    }
  };

  const progress =
    targetAmount > 0
      ? Math.min(
          (savedSoFar / Number(targetAmount)) * 100,
          100
        )
      : 0;

  const daysSavedEarly =
    Math.floor(
      Number(targetAmount) / dailySaving
    ) -
    Math.floor(
      Number(targetAmount) / (dailySaving + 100)
    );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Savings Goal Planner
        </h1>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-6">

          <div>
            <label className="block mb-2">
              Goal Name
            </label>

            <input
              type="text"
              value={goalName}
              onChange={(e) =>
                setGoalName(e.target.value)
              }
              placeholder="New Bicycle"
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
            />
          </div>

          <div>
            <label className="block mb-2">
              Target Amount (₹)
            </label>

            <input
              type="number"
              value={targetAmount}
              onChange={(e) =>
                setTargetAmount(e.target.value)
              }
              placeholder="5000"
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
            />
          </div>

          <div>
            <label className="block mb-2">
              Daily Saving (₹)
            </label>

            <input
              type="number"
              value={dailySaving}
              onChange={(e) =>
                handleDailySavingChange(
                  e.target.value
                )
              }
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
            />
          </div>

          <div>
            <label className="block mb-2">
              Estimated Days
            </label>

            <input
              type="number"
              value={days}
              onChange={(e) =>
                handleDaysChange(
                  e.target.value
                )
              }
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
            />
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <p className="text-slate-300">
              Average Safe Spend Per Day
            </p>

            <p className="text-2xl font-bold">
              ₹{safeSpendPerDay}
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span>Progress</span>

              <span>
                ₹{savedSoFar} / ₹{targetAmount || 0}
              </span>
            </div>

            <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <p className="mt-2 text-sm text-slate-400">
              {progress.toFixed(0)}% Complete
            </p>
          </div>

          <div className="bg-green-900/30 border border-green-700 rounded-xl p-4">
            <p className="font-semibold mb-2">
              💡 Smart Insight
            </p>

            <p>
              If you save ₹100 more each day,
              you can achieve your goal{" "}
              <span className="font-bold">
                {daysSavedEarly}
              </span>{" "}
              days earlier.
            </p>
          </div>

          <button
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 transition"
          >
            Save Goal
          </button>

        </div>
      </div>
    </div>
  );
}