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
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('dashboard')}</h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column - Summary & Engine */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Income Engine Panel */}
          {engine && (
            <div className="bg-white border border-slate-200/80 shadow-sm p-6 rounded-2xl">
              <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <i className="ti ti-engine text-blue-600"></i> {t('income_engine')}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-slate-700">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/50">
                  <div className="text-xs text-slate-400 font-medium mb-1">{t('seven_day_avg')}</div>
                  <div className="text-xl font-bold text-slate-800">₹{engine.seven_day_avg}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/50">
                  <div className="text-xs text-slate-400 font-medium mb-1">{t('daily_spend_limit')}</div>
                  <div className="text-xl font-bold text-slate-800">₹{engine.daily_spend_limit}</div>
                </div>
              </div>
              {engine.bad_day_mode ? (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <strong className="text-red-700 font-bold flex items-center gap-2">
                    <i className="ti ti-alert-triangle"></i> {t('bad_day_mode_active')}
                  </strong>
                  <ul className="mt-2 list-disc ml-5 text-red-600 text-sm space-y-1">
                    {engine.gov_schemes.map((s,i) => (
                      <li key={i}>{s.name}: {s.desc}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}

          {/* Key Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card title="Income" value={data.totalIncome} />
            <Card title="Expense" value={data.totalExpense} />
            <Card title="Remaining" value={data.remaining} />
          </div>

          {/* Spend Limit */}
          <div className="bg-white border border-slate-200/80 shadow-sm p-6 rounded-2xl flex justify-between items-center">
            <div>
              <h2 className="text-slate-500 font-medium text-sm mb-1">{t('spend_limit')}</h2>
              <p className="text-4xl font-black text-emerald-600">₹{data.spendLimit}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <i className="ti ti-wallet text-2xl"></i>
            </div>
          </div>

          {/* AI Insight */}
          <div className="bg-white border border-slate-200/80 shadow-sm p-6 rounded-2xl">
            <h2 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
              <i className="ti ti-bulb text-amber-500"></i> {t('ai_insight')}
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">{aiNudge || data.aiNudge}</p>
            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
              <label className="text-sm text-slate-500 font-semibold">Language / भाषा / மொழி:</label>
              <select value={lang} onChange={async (e) => {
                  const newLang = e.target.value;
                  setLang(newLang);
                  try {
                    const a = await API.get('/ai-nudge', { params: { lang: newLang } });
                    setAiNudge(a.data.aiNudge || '');
                  } catch (err) {
                    console.error('ai-nudge fetch failed', err);
                  }
                }} className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none">
                <option value="en">English</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="ta">Tamil (தமிழ்)</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => navigate("/add-log")}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-sm cursor-pointer"
            >
              <i className="ti ti-plus text-lg"></i> {t('add_log')}
            </button>
            <button
              onClick={() => navigate("/savings-goal")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-sm cursor-pointer"
            >
              <i className="ti ti-target text-lg"></i> {t('savings_goal')}
            </button>
            <button
              onClick={() => navigate("/family-shield")}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-sm cursor-pointer"
            >
              <i className="ti ti-shield text-lg"></i> Family Shield
            </button>
          </div>
        </div>

        {/* Right Column - Allocations & Buffer */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white border border-slate-200/80 shadow-sm p-6 rounded-2xl">
            <SmartAllocation onAllocationComplete={handleAllocationComplete} />
          </div>
          
          {buffer && (
            <div className="bg-white border border-slate-200/80 shadow-sm p-6 rounded-2xl">
              <h3 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                <i className="ti ti-shield-alert text-blue-600"></i> {t('emergency_buffer')}
              </h3>
              <p className="text-slate-800 font-semibold">{t('recommended_buffer')}: <span className="text-blue-600 font-bold">₹{buffer.recommended_buffer}</span></p>
              <p className="text-sm text-slate-500 mt-1 mb-4 leading-relaxed">{buffer.note}</p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/80">
                <label className="text-sm text-slate-600 font-semibold">{t('multiplier')}: <span className="font-bold text-slate-850">{bufferMultiplier}x</span></label>
                <input type="range" min="0.5" max="3" step="0.1" value={bufferMultiplier} onChange={(e)=>setBufferMultiplier(Number(e.target.value))} className="w-full mt-2 accent-blue-600 cursor-pointer" />
                <div className="flex justify-end mt-3">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition cursor-pointer" onClick={async ()=>{ const b = await API.get('/emergency-buffer',{params:{multiplier:bufferMultiplier}}); setBuffer(b.data); }}>{t('apply')}</button>
                </div>
              </div>

              {/* Chart with Tooltips */}
              {buffer.last14 && (
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('income_last14')}</div>
                    <div>
                      <button onClick={() => setShowHistory(prev=>!prev)} className="text-xs bg-slate-100 hover:bg-slate-250 text-slate-600 hover:text-slate-850 px-2 py-1.5 rounded-lg transition font-bold border border-slate-200/60">{showHistory ? 'Hide' : 'Show'} history</button>
                    </div>
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 flex justify-center">
                    <SVGChart data={buffer.last14} height={120} />
                  </div>
                  <div className="mt-2 text-xs text-slate-400">{t('hover_bars')}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white border border-slate-200/80 shadow-sm p-5 rounded-2xl flex flex-col justify-between">
      <h3 className="text-slate-400 font-semibold text-xs mb-2 uppercase tracking-wider">{title}</h3>
      <p className="text-2xl font-black text-slate-850">₹{value}</p>
    </div>
  );
}