import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try{
        const response = await API.get("/insights");
        setInsights(response.data);
      }
      catch(error){
        console.log(error);
      }
    };

    fetchInsights();
  }, []);
  
  const recentLogs = [
    { date: "13 Jun", earned: 800, spent: 450 },
    { date: "12 Jun", earned: 650, spent: 300 },
    { date: "11 Jun", earned: 0, spent: 180 },
  ];

  const bufferCurrent = 1200;
  const bufferTarget = 2400;

  const bufferPercent = (bufferCurrent / bufferTarget) * 100;

  if (!insights){
    return (
      <div className="text-white"> Loading... </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold text-white">
          Hello Ramu 👋
        </h1>

        <p className="text-gray-400 mt-2">
          Here's your financial snapshot today
        </p>

        {/* Summary Cards */}

        <div className="grid md:grid-cols-3 gap-4 mt-8">

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6">
            <h3 className="text-gray-300">Income</h3>
            <p className="text-3xl font-bold text-green-400">
              ₹{insights.totalIncome}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6">
            <h3 className="text-gray-300">Expense</h3>
            <p className="text-3xl font-bold text-red-400">
              ₹{insights.totalExpense}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6">
            <h3 className="text-gray-300">Remaining</h3>
            <p className="text-3xl font-bold text-white">
              ₹{insights.remaining}
            </p>
          </div>

        </div>

        {/* Spend Limit */}

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 mt-6">

          <h2 className="text-white text-xl font-semibold">
            Today's Safe Spend Limit
          </h2>

          <p className="text-5xl font-bold text-emerald-400 mt-4">
            ₹{insights.spendLimit}
          </p>

        </div>

        {/* Emergency Buffer */}

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 mt-6">

          <h2 className="text-white text-xl font-semibold">
            Emergency Buffer
          </h2>

          <p className="text-gray-300 mt-2">
            ₹1200 / ₹2400
          </p>

          <div className="w-full bg-slate-700 rounded-full h-4 mt-4">

            <div
              className="bg-emerald-500 h-4 rounded-full"
              style={{
                width: `${bufferPercent}%`,
              }}
            />

          </div>

          <p className="text-gray-300 mt-2">
            {Math.round(bufferPercent)}% Complete
          </p>

        </div>

        {/* AI Advice */}

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 mt-6">

          <h2 className="text-white text-xl font-semibold">
            AI Advice
          </h2>

          <p className="text-gray-300 mt-3">
            You earned less than usual yesterday.
            Try keeping food expenses below ₹150 today.
          </p>

        </div>

        {/* Recent Logs */}

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 mt-6">

          <h2 className="text-white text-xl font-semibold mb-4">
            Recent Records
          </h2>

          {recentLogs.map((log, index) => (
            <div
              key={index}
              className="flex justify-between border-b border-white/10 py-3 text-gray-300"
            >
              <span>{log.date}</span>
              <span>₹{log.earned}</span>
              <span>₹{log.spent}</span>
            </div>
          ))}

        </div>

        {/* Add Log Button */}

        <button
          onClick={() => navigate("/add-log")}
          className="fixed bottom-8 right-8 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-full shadow-xl transition-all"
        >
          + Add Today's Log
        </button>

      </div>

    </div>
  );
}