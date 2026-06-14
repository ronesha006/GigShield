import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import SmartAllocation from "../components/SmartAllocation";
import React from 'react';
import { useI18n } from '../i18n'

function SVGChart({ data, height=120 }){
  const [hint, setHint] = useState(null);
  const padding = 6;
  const w = Math.max(300, data.length * 18);
  const max = Math.max(...data.map(d=>d.income), 1);

  return (
    <div className="relative">
      <svg width={w} height={height} className="block">
        {data.map((d,i)=>{
          const barW = Math.floor((w - padding*2)/data.length) - 4;
          const h = Math.round((d.income / max) * (height - 20));
          const x = padding + i * (barW + 4);
          const y = height - h - 16;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={h} fill="#3b82f6"
                onMouseEnter={()=>setHint({x,y,value:d.income,date:d.date})}
                onMouseLeave={()=>setHint(null)} />
              <text x={x + barW/2} y={height-4} fontSize={9} fill="#94a3b8" textAnchor="middle">{d.date.slice(5)}</text>
            </g>
          )
        })}
      </svg>
      {hint && (
        <div style={{position:'absolute', left: hint.x + 10, top: hint.y - 10}} className="bg-slate-800 text-white text-xs px-2 py-1 rounded shadow">
          <div>₹{hint.value}</div>
          <div className="text-xs text-slate-300">{hint.date}</div>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, lang, setLang } = useI18n();
  const [data, setData] = useState(null);
  const [engine, setEngine] = useState(null);
  const [buffer, setBuffer] = useState(null);
  const [bufferMultiplier, setBufferMultiplier] = useState(1.5);
  const [aiNudge, setAiNudge] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/dashboard");
      setData(res.data);
      try {
        const eng = await API.get("/income-engine");
        setEngine(eng.data);
        try {
          const b = await API.get("/emergency-buffer", { params: { multiplier: bufferMultiplier } });
          setBuffer(b.data);
        } catch (e) {
          console.error('buffer fetch failed', e);
        }

        try {
          const a = await API.get('/ai-nudge', { params: { lang } });
          setAiNudge(a.data.aiNudge || '');
        } catch (e) {
          console.error('ai-nudge fetch failed', e);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [refresh]);

  const handleAllocationComplete = () => {
    setRefresh(prev => !prev); // Refresh dashboard
  };

  if (!data) {
    return <div className="text-white">{t('loading') || 'Loading...'}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t('dashboard')}</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Income Engine Panel */}
          {engine && (
            <div className="bg-white/5 p-4 rounded-xl mb-4">
              <h3 className="font-semibold">{t('income_engine')}</h3>
              <p>{t('seven_day_avg')}: ₹{engine.seven_day_avg}</p>
              <p>{t('daily_spend_limit')}: ₹{engine.daily_spend_limit}</p>
              {engine.bad_day_mode ? (
                <div className="mt-2 p-3 bg-red-700/20 rounded">
                  <strong>{t('bad_day_mode_active')}</strong>
                  <ul className="mt-2 list-disc ml-5">
                    {engine.gov_schemes.map((s,i) => (
                      <li key={i}>{s.name}: {s.desc}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
          {/* Left Column - Summary Cards */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card title="Income" value={data.totalIncome} />
              <Card title="Expense" value={data.totalExpense} />
              <Card title="Remaining" value={data.remaining} />
            </div>

            <div className="bg-white/10 p-6 rounded-xl">
              <h2>{t('spend_limit')}</h2>
              <p className="text-4xl text-green-400">₹{data.spendLimit}</p>
            </div>

            <div className="bg-white/10 p-6 rounded-xl">
              <h2>{t('ai_insight')}</h2>
              <p>{aiNudge || data.aiNudge}</p>
              <div className="mt-2 flex items-center gap-2">
                <label className="text-sm">Language:</label>
                <select value={lang} onChange={async (e) => {
                    const newLang = e.target.value;
                    setLang(newLang);
                    try {
                      const a = await API.get('/ai-nudge', { params: { lang: newLang } });
                      setAiNudge(a.data.aiNudge || '');
                    } catch (err) {
                      console.error('ai-nudge fetch failed', err);
                    }
                  }} className="bg-slate-800 text-white rounded px-2">
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/add-log")}
                className="bg-green-500 px-4 py-2 rounded"
              >
                {t('add_log')}
              </button>
              <button
                onClick={() => navigate("/savings-goal")}
                className="bg-blue-500 px-4 py-2 rounded"
              >
                {t('savings_goal')}
              </button>
            </div>
          </div>

          {/* Right Column - Smart Allocation */}
          <div>
            <SmartAllocation onAllocationComplete={handleAllocationComplete} />
            {buffer && (
              <div className="mt-4 bg-white/5 p-4 rounded-xl">
                <h3 className="font-semibold">{t('emergency_buffer')}</h3>
                <p>{t('recommended_buffer')}: ₹{buffer.recommended_buffer}</p>
                <p className="text-sm text-slate-400">{buffer.note}</p>

                <div className="mt-3">
                  <label className="text-sm">{t('multiplier')}: {bufferMultiplier}</label>
                  <input type="range" min="0.5" max="3" step="0.1" value={bufferMultiplier} onChange={(e)=>setBufferMultiplier(Number(e.target.value))} className="w-full mt-1" />
                  <div className="flex justify-end mt-2">
                    <button className="bg-green-500 px-3 py-1 rounded" onClick={async ()=>{ const b = await API.get('/emergency-buffer',{params:{multiplier:bufferMultiplier}}); setBuffer(b.data); }}>{t('apply')}</button>
                  </div>
                </div>

                {/* Improved SVG bar chart with tooltips & historical view */}
                {buffer.last14 && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm mb-2">{t('income_last14')}</div>
                      <div>
                        <button onClick={() => setShowHistory(prev=>!prev)} className="text-xs bg-slate-700 px-2 py-1 rounded">{showHistory ? 'Hide' : 'Show'} history</button>
                      </div>
                    </div>
                    <SVGChart data={buffer.last14} height={120} />
                    <div className="mt-2 text-xs text-slate-400">{t('hover_bars')}</div>
                  </div>
                )}
              </div>
            )}
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