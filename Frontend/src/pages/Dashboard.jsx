import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import SmartAllocation from "../components/SmartAllocation";

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/dashboard");
      setData(res.data);
    };
    fetchData();
  }, [refresh]);

  const handleAllocationComplete = () => {
    setRefresh(prev => !prev); // Refresh dashboard
  };

  if (!data) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Summary Cards */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card title="Income" value={data.totalIncome} />
              <Card title="Expense" value={data.totalExpense} />
              <Card title="Remaining" value={data.remaining} />
            </div>

            <div className="bg-white/10 p-6 rounded-xl">
              <h2>Spend Limit</h2>
              <p className="text-4xl text-green-400">₹{data.spendLimit}</p>
            </div>

            <div className="bg-white/10 p-6 rounded-xl">
              <h2>AI Insight</h2>
              <p>{data.aiNudge}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/add-log")}
                className="bg-green-500 px-4 py-2 rounded"
              >
                Add Log
              </button>
              <button
                onClick={() => navigate("/savings-goal")}
                className="bg-blue-500 px-4 py-2 rounded"
              >
                Savings Goal
              </button>
            </div>
          </div>

          {/* Right Column - Smart Allocation */}
          <div>
            <SmartAllocation onAllocationComplete={handleAllocationComplete} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white/10 p-4 rounded-xl">
      <h3 className="text-gray-300">{title}</h3>
      <p className="text-xl font-bold">₹{value}</p>
    </div>
  );
}