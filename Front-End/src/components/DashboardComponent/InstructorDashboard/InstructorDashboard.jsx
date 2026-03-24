import React, { useState } from "react";
import {
    LayoutDashboard, FileText, Users, Calendar, CheckCircle, Clock,
    AlertCircle, Search, Bell, MoreVertical, Filter, ArrowUpRight,
    Megaphone, Upload, Download, PlusCircle, FileDown, BookOpen,
    Info, LogOut, Settings, X
} from "lucide-react";

const App = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [showUploadModal, setShowUploadModal] = useState(false);

    // BiPSU Identity Colors & Glassmorphism Styles
    const bipsuStyle = {
        glass: "backdrop-blur-2xl bg-white/60 border border-white/40 shadow-[0_20px_50px_rgba(0,56,168,0.08)]",
        buttonBlue: "bg-[#0038A8] hover:bg-[#002d86] text-white shadow-lg shadow-blue-900/20 active:scale-95 transition-all duration-300",
        buttonYellow: "bg-[#FFD700] hover:bg-[#e6c200] text-[#0038A8] shadow-lg shadow-yellow-500/20 active:scale-95 transition-all duration-300",
        cardTitle: "text-[#0038A8] font-black tracking-tight",
    };

    const thesisGroups = [
        { id: 1, title: "AI-Driven Crop Monitoring System", students: ["Juan Dela Cruz", "Maria Clara"], status: "In Review", progress: 75 },
        { id: 2, title: "Blockchain for Health Records", students: ["Pedro Penduko", "Elena Adarna"], status: "Approved", progress: 100 },
        { id: 3, title: "Smart Waste Management IoT", students: ["Jose Rizal", "Andres Bonifacio"], status: "Pending Revision", progress: 40 },
    ];

    const stats = [
        { label: "Advisees", value: "12", icon: <Users className="text-[#0038A8]" />, color: "bg-blue-100" },
        { label: "For Revision", value: "4", icon: <FileText className="text-orange-600" />, color: "bg-orange-100" },
        { label: "Completed", value: "5", icon: <CheckCircle className="text-green-600" />, color: "bg-green-100" },
        { label: "Upcoming", value: "3", icon: <Calendar className="text-purple-600" />, color: "bg-purple-100" },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden font-sans p-4 md:p-8">
            {/* Morphism Background Blobs */}
            <div className="fixed -top-24 -left-24 w-[500px] h-[500px] bg-[#0038A8]/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed -bottom-24 -right-24 w-[500px] h-[500px] bg-[#FFD700]/15 rounded-full blur-[120px] pointer-events-none"></div>

            <main className="relative z-10 mx-auto max-w-7xl">
                {/* --- HEADER --- */}
                <header className={`mb-8 p-6 md:p-8 rounded-[2.5rem] ${bipsuStyle.glass} flex flex-col md:flex-row justify-between items-center gap-6`}>
                    <div className="flex items-center gap-5">
                        <div className="h-16 w-16 bg-[#0038A8] rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/30 ring-4 ring-white">
                             <BookOpen className="text-[#FFD700]" size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className={`text-3xl md:text-4xl ${bipsuStyle.cardTitle}`}>BiPSU <span className="text-[#FFD700] drop-shadow-sm font-black italic">Research Hub</span></h1>
                            </div>
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Research Management & Manuscript Tracking</p>
                        </div>
                    </div>

                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* --- SIDEBAR STATS --- */}
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="px-4 text-[11px] font-black text-[#0038A8] uppercase tracking-[0.3em] mb-4">Quick Insights</h2>
                        {stats.map((stat, idx) => (
                            <div key={idx} className={`${bipsuStyle.glass} p-6 rounded-[2rem] group hover:bg-white/90 transition-all duration-500 border-b-4 border-b-[#0038A8]/10`}>
                                <div className="flex justify-between items-center mb-4">
                                    <div className={`p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                                        {stat.icon}
                                    </div>
                                    <ArrowUpRight size={18} className="text-slate-300 group-hover:text-[#0038A8] transition-colors" />
                                </div>
                                <h3 className="text-4xl font-black text-[#0038A8] tracking-tighter">{stat.value}</h3>
                                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* --- MAIN CONTENT --- */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`${bipsuStyle.glass} p-8 rounded-[3rem] group cursor-pointer relative overflow-hidden transition-all duration-500`}>
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#0038A8]/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-black text-[#0038A8] leading-tight">Post<br/>Announcement</h3>
                                        <p className="text-sm text-slate-500 font-medium mt-2">Broadcast to all advisees.</p>
                                    </div>
                                    <button className={`p-5 rounded-2xl ${bipsuStyle.buttonBlue}`}>
                                        <PlusCircle size={28} />
                                    </button>
                                </div>
                            </div>

                            <div className={`${bipsuStyle.glass} p-8 rounded-[3rem] group cursor-pointer relative overflow-hidden transition-all duration-500 border-b-4 border-b-[#FFD700]`}>
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#FFD700]/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-black text-[#0038A8] leading-tight text-nowrap">Upload Guide</h3>
                                        <p className="text-sm text-slate-500 font-medium mt-2">Publish manuscript format.</p>
                                    </div>
                                    <button onClick={() => setShowUploadModal(true)} className={`p-5 rounded-2xl ${bipsuStyle.buttonYellow}`}>
                                        <Upload size={28} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Table-like List */}
                        <div className={`${bipsuStyle.glass} rounded-[3rem] overflow-hidden`}>
                            <div className="p-8 border-b border-white/50 bg-[#0038A8]/5 flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-black text-[#0038A8] italic">Advisee Progress</h3>
                                    <p className="text-xs text-blue-900/50 font-bold uppercase tracking-widest mt-1">Live Monitoring</p>
                                </div>
                                <div className="flex gap-2">
                                     <span className="bg-[#0038A8] text-white text-[10px] font-black px-5 py-2.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20">
                                        {thesisGroups.length} Groups
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {thesisGroups.map((group) => (
                                    <div key={group.id} className="bg-white/40 border border-white/60 p-6 rounded-[2rem] hover:bg-white/90 transition-all duration-300 group shadow-sm hover:shadow-md">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`h-2 w-2 rounded-full ${group.status === 'Approved' ? 'bg-green-500 animate-pulse' : 'bg-[#FFD700]'}`}></span>
                                                    <h4 className="text-xl font-black text-[#0038A8] group-hover:underline underline-offset-8 decoration-[#FFD700] decoration-4 transition-all">
                                                        {group.title}
                                                    </h4>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex -space-x-3">
                                                        {[1, 2].map((i) => (
                                                            <div key={i} className="h-8 w-8 rounded-xl border-2 border-white bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-[10px] font-black text-[#0038A8]">
                                                                {group.students[i-1].charAt(0)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-500 italic uppercase tracking-tighter">
                                                        {group.students.join(" • ")}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="text-right hidden md:block">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-tighter ${group.status === 'Approved' ? 'bg-green-500/10 text-green-700' : 'bg-[#FFD700]/20 text-[#0038A8]'}`}>
                                                        {group.status}
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-[10px] font-black text-blue-900">
                                                        <span>PROGRESS</span>
                                                        <span>{group.progress}%</span>
                                                    </div>
                                                    <div className="w-32 bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-white">
                                                        <div className="h-full bg-gradient-to-r from-[#0038A8] to-blue-500 rounded-full transition-all duration-1000" style={{ width: `${group.progress}%` }}></div>
                                                    </div>
                                                </div>
                                                <button className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-[#0038A8] hover:bg-[#0038A8] hover:text-white transition-all group-hover:rotate-6">
                                                    <FileText size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- UPLOAD MODAL (Glassmorphism) --- */}
                {showUploadModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0038A8]/30 backdrop-blur-xl p-4 transition-all">
                        <div className={`w-full max-w-2xl rounded-[3.5rem] overflow-hidden ${bipsuStyle.glass} shadow-2xl`}>
                            <div className="bg-[#0038A8] p-10 text-white relative">
                                <button onClick={() => setShowUploadModal(false)} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-xl transition-all">
                                    <X size={24} />
                                </button>
                                <div className="flex items-center gap-4 mb-2">
                                    <Upload className="text-[#FFD700]" size={32} />
                                    <h3 className="text-3xl font-black italic tracking-tight">Manuscript Guide</h3>
                                </div>
                                <p className="text-blue-100/60 font-bold text-xs uppercase tracking-[0.2em]">Institutional Standard Compliance</p>
                            </div>

                            <div className="p-10 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#0038A8] mb-3 ml-2">Resource Title</label>
                                        <input type="text" placeholder="e.g. Chapter 1 Template" className="w-full bg-white/50 border-2 border-slate-100 px-6 py-4 rounded-2xl focus:border-[#FFD700] outline-none font-bold text-sm transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#0038A8] mb-3 ml-2">Category</label>
                                        <select className="w-full bg-white/50 border-2 border-slate-100 px-6 py-4 rounded-2xl focus:border-[#FFD700] outline-none font-bold text-sm transition-all appearance-none">
                                            <option>Template</option>
                                            <option>Checklist</option>
                                            <option>Policy</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#0038A8] mb-3 ml-2">Instructions</label>
                                    <textarea rows="3" placeholder="Ibigay ang mga detalye..." className="w-full bg-white/50 border-2 border-slate-100 px-6 py-4 rounded-2xl focus:border-[#FFD700] outline-none font-bold resize-none text-sm"></textarea>
                                </div>

                                <div className="p-12 border-4 border-dashed border-[#0038A8]/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 bg-[#0038A8]/5 hover:bg-[#0038A8]/10 transition-all cursor-pointer group">
                                    <div className="p-6 rounded-full bg-white shadow-xl text-[#0038A8] group-hover:scale-110 transition-transform duration-500">
                                        <FileDown size={40} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-black text-[#0038A8] uppercase tracking-widest">Select Files</p>
                                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">PDF, DOCX, OR ZIP (MAX 25MB)</p>
                                    </div>
                                </div>

                                <button className={`w-full py-6 rounded-[2.5rem] font-black text-lg ${bipsuStyle.buttonBlue} uppercase tracking-[0.2em]`}>
                                    Confirm Posting
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;