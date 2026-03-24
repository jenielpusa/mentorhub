import React from "react";
import { BookOpen, PieChart, Activity, Users, TrendingUp } from "lucide-react";

/** Utility for Tailwind classes */
const cn = (...classes) => classes.filter(Boolean).join(" ");

/** Shared Glassmorphism Style */
const glassClass = "bg-white/40 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-xl rounded-[2.5rem] transition-all duration-300";

export const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className={cn(glassClass, "p-5 flex flex-col items-center text-center hover:scale-105")}>
        <div className={cn(color, "p-3 rounded-2xl text-white mb-3 shadow-lg shadow-blue-500/10")}>
            <Icon size={22} />
        </div>
        <h3 className="text-xl font-black text-slate-800 dark:text-white">{value}</h3>
        <p className="text-[9px] font-black text-slate-400 uppercase mt-1 tracking-tighter">{label}</p>
    </div>
);

export const LegendItem = ({ color, label, isLine }) => (
    <div className="flex items-center gap-2">
        <div className={cn(isLine ? "w-8 h-1" : "w-3 h-3", "rounded-full", color)} />
        <span className="text-[10px] font-black uppercase text-slate-500">{label}</span>
    </div>
);

export const TopStudyFieldsCard = ({ fields }) => (
    <div className={cn(glassClass, "p-6")}>
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
                <PieChart className="text-blue-500" size={18} />
            </div>
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Top Study Fields</h4>
        </div>
        <div className="space-y-4">
            {fields.map((field, i) => (
                <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                        <span>{field.name}</span>
                        <span className="text-slate-800 dark:text-white">{field.count}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", field.color)} style={{ width: field.w }} />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const LatestArchivesCard = ({ archives }) => (
    <div className={cn(glassClass, "p-6")}>
        <div className="flex items-center justify-between mb-8">
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Latest Archives</h4>
            <div className="px-3 py-1 bg-emerald-500/10 rounded-full text-[8px] font-black text-emerald-500 uppercase animate-pulse">Live Feed</div>
        </div>
        <div className="space-y-6">
            {archives.map((sub, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer border-b border-slate-100 dark:border-slate-800/50 pb-5 last:border-0 last:pb-0">
                    <div className="w-11 h-11 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <BookOpen size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h5 className="text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase truncate group-hover:text-blue-500">{sub.title}</h5>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[8px] font-black text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{sub.group}</span>
                            <span className="text-[8px] font-bold text-blue-500 uppercase">{sub.date}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const AdviserWorkloadCard = ({ advisers }) => (
    <div className={cn(glassClass, "p-6 bg-gradient-to-br from-[#0038A8] to-[#001D56] text-white border-none shadow-2xl shadow-blue-500/30")}>
        <div className="flex items-center gap-2 mb-6 opacity-90">
            <Users size={16} className="text-yellow-400" />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Adviser Allocation</h4>
        </div>
        <div className="space-y-5">
            {advisers.map((adv, i) => (
                <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight">
                        <span className="opacity-80">{adv.name}</span>
                        <span className="text-yellow-400">{adv.groups} Groups</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full transition-all duration-1000" style={{ width: adv.load }} />
                    </div>
                </div>
            ))}
        </div>
    </div>
);