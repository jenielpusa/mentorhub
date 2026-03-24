import React from "react";
import { Activity } from "lucide-react";
import { LegendItem } from "./DashboardCard";

const glassClass = "bg-white/40 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-xl rounded-[2.5rem] transition-all duration-300";

const SubmissionTrends = ({ months, lineData, thesisData, capstoneData }) => (
    <div className={`${glassClass} p-8 min-h-[480px] flex flex-col`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    <Activity size={20} className="text-blue-500" /> Submission Trends
                </h3>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Monthly Growth & Category Comparison</p>
            </div>
            <div className="flex flex-wrap gap-4">
                <LegendItem color="bg-blue-500" label="Thesis" />
                <LegendItem color="bg-amber-400" label="Capstone" />
                <LegendItem color="bg-emerald-500" label="Trend" isLine />
            </div>
        </div>
        
        <div className="flex-1 relative mt-4 group/graph">
            <svg className="absolute inset-0 w-full h-[85%] z-20 pointer-events-none" preserveAspectRatio="none">
                <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={lineData.map((val, i) => `${(i * (100 / 11)) + 4}%,${100 - val}%`).join(' ')}
                    className="drop-shadow-lg"
                />
            </svg>

            <div className="absolute inset-0 flex items-end justify-between px-2 pb-10 h-[85%] border-b border-slate-200 dark:border-slate-800/50">
                {months.map((m, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                        <div className="flex gap-1 items-end h-full w-full justify-center px-1">
                            <div style={{ height: `${thesisData[i]}%` }} className="w-2 md:w-4 bg-blue-500/80 rounded-t-md transition-all group-hover:bg-blue-600" />
                            <div style={{ height: `${capstoneData[i]}%` }} className="w-2 md:w-4 bg-amber-400/80 rounded-t-md transition-all group-hover:bg-amber-500" />
                        </div>
                        <span className="absolute -bottom-8 text-[9px] font-black text-slate-400 uppercase">{m}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default SubmissionTrends;