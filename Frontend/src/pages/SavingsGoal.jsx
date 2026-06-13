import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function SavingsGoal() {
  const navigate = useNavigate();

  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/dashboard");
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div className="text-white p-6">Loading...</div>;
  }

  const safeSavingPerDay = data.spendLimit || 0;
  const savedSoFar = data.goals?.[0]?.saved || 0;

  const estimatedDays =
    targetAmount && safeSavingPerDay
      ? Math.ceil(Number(targetAmount) / safeSavingPerDay)
      : 0;

  const optimisticDays =
    targetAmount && safeSavingPerDay
      ? Math.ceil(Number(targetAmount) / (safeSavingPerDay + 100))
      : 0;

  const daysSavedEarly = estimatedDays - optimisticDays;

  const progress =
    targetAmount > 0
      ? Math.min((savedSoFar / Number(targetAmount)) * 100, 100)
      : 0;

  const handleSubmit = async () => {
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

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Savings Goal Planner
        </h1>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-6">

          {/* Goal Name */}
          <div>
            <label className="block mb-2">Goal Name</label>
            <input
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
              placeholder="New Bicycle"
            />
          </div>

          {/* Target */}
          <div>
            <label className="block mb-2">Target Amount (₹)</label>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
              placeholder="5000"
            />
          </div>

          {/* Live Info */}
          <div className="bg-slate-800 p-4 rounded-xl">
            <p className="text-slate-300">Safe Saving Per Day</p>
            <p className="text-2xl font-bold">
              ₹{safeSavingPerDay}
            </p>
          </div>

          {/* Estimated Days */}
          <div className="bg-slate-800 p-4 rounded-xl">
            <p>Estimated Days</p>
            <p className="text-xl font-bold">{estimatedDays}</p>
          </div>

          {/* Progress */}
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
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-2 text-sm text-slate-400">
              {progress.toFixed(0)}% Complete
            </p>
          </div>

          {/* Insight */}
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

          {/* Save */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 transition"
          >
            Save Goal
          </button>

        </div>
      </div>
    </div>
  );
}