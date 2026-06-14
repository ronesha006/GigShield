import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/dashboard");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      }
    };

    fetchData();
  }, [refresh]);

  const refreshDashboard = () => {
    setRefresh(prev => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/dashboard");
      setData(res.data);
    };

    fetchData();
  }, []);

  if (!data) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">

      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">

        <Card title="Income" value={data.totalIncome} />
        <Card title="Expense" value={data.totalExpense} />
        <Card title="Remaining" value={data.remaining} />

      </div>

      {/* Spend Limit */}
      <div className="mt-6 bg-white/10 p-6 rounded-xl">
        <h2>Spend Limit</h2>
        <p className="text-4xl text-green-400">
          ₹{data.spendLimit}
        </p>
      </div>

      {/* AI */}
      <div className="mt-6 bg-white/10 p-6 rounded-xl">
        <h2>AI Insight</h2>
        <p>{data.aiNudge}</p>
      </div>

      {/* Goals */}
      <div className="mt-6">
        <h2 className="text-xl mb-2">Goals</h2>

        {data.goals.map((g) => (
          <div key={g.id} className="bg-white/10 p-3 rounded mb-2">
            <p>{g.name}</p>
            <p>{g.saved} / {g.target}</p>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">

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