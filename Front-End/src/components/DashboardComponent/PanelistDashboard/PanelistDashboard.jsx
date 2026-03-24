import React from "react";
import { ClipboardList, Clock, CheckCircle, Download, Users, Calendar, ArrowRight, ExternalLink } from "lucide-react";

// --- MOCK DATA FOR PREVIEW ---
const DUMMY_PANELIST_DATA = {
    assignedThesis: [
        { id: 1, title: "Smart Agriculture using LoRaWAN", student: "Alice Guo", type: "Final Defense", status: "Pending Review" },
        { id: 2, title: "E-Learning Platform for BiPSU", student: "Bob Marasigan", type: "Proposal", status: "Graded" },
        { id: 3, title: "Student Traffic Monitoring System", student: "Charlie Day", type: "Final Defense", status: "Pending Review" },
    ],
    upcomingDefenses: [
        { date: "Oct 24, 2023", time: "9:00 AM", student: "Alice Guo", room: "LR 1" },
        { date: "Oct 26, 2023", time: "1:30 PM", student: "Charlie Day", room: "Virtual Hub" },
    ],
};

// --- SUB-COMPONENT ---
const PanelStatsCard = ({ icon, label, count, colorClass }) => (
    <div className="group flex items-center gap-5 rounded-[2rem] border border-white/40 bg-white/60 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/80">
        <div className={`rounded-2xl p-4 ${colorClass} shadow-inner transition-transform duration-500 group-hover:scale-110`}>{icon}</div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
            <p className="text-3xl font-black text-[#0038A8]">{count}</p>
        </div>
    </div>
);

const PanelistDashboard = ({ panelistData = DUMMY_PANELIST_DATA }) => {
    return (
        
        <div className="min-h-screen bg-transparent p-2">

            {/* Header Section */}
            <section className="mb-10 flex items-end justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-3">
                        <div className="h-8 w-2 rounded-full bg-[#FFD700]"></div>
                        <h1 className="text-3xl font-black uppercase italic tracking-tight text-[#0038A8]">Panelist Review Board 🎓</h1>
                    </div>
                    <p className="ml-5 font-bold text-slate-500">
                        Actively evaluating <span className="text-[#0038A8]">{panelistData.assignedThesis.length}</span> research projects.
                    </p>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                <div className="space-y-8 lg:col-span-3">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <PanelStatsCard
                            icon={<ClipboardList className="text-[#0038A8]" />}
                            label="Assigned"
                            count={panelistData.assignedThesis.length}
                            colorClass="bg-blue-50"
                        />
                        <PanelStatsCard
                            icon={<Clock className="text-orange-600" />}
                            label="Pending"
                            count={panelistData.assignedThesis.filter((t) => t.status !== "Graded").length}
                            colorClass="bg-orange-50"
                        />
                        <PanelStatsCard
                            icon={<CheckCircle className="text-green-600" />}
                            label="Evaluated"
                            count={panelistData.assignedThesis.filter((t) => t.status === "Graded").length}
                            colorClass="bg-green-50"
                        />
                    </div>

                    {/* Table Area */}
                    <div className="overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 shadow-2xl shadow-blue-900/5 backdrop-blur-xl">
                        <div className="flex items-center justify-between border-b border-white/50 bg-[#0038A8]/5 p-8">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter text-[#0038A8]">Manuscripts for Evaluation</h3>
                            <div className="flex gap-2">
                                <span className="rounded-xl border border-white bg-white/80 px-4 py-2 text-[9px] font-black text-[#0038A8] shadow-sm">
                                    FILTER BY STATUS
                                </span>
                            </div>
                        </div>

                        <div className="overflow-x-auto p-4">
                            <table className="w-full border-separate border-spacing-y-3 text-left">
                                <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0038A8]/40">
                                    <tr>
                                        <th className="px-6 py-2 text-center">Project Info</th>
                                        <th className="px-6 py-2">Lead Student</th>
                                        <th className="px-6 py-2 text-center">Status</th>
                                        <th className="px-6 py-2 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {panelistData.assignedThesis.map((thesis) => (
                                        <tr
                                            key={thesis.id}
                                            className="group bg-white/40 shadow-sm transition-all duration-300 hover:bg-white/80"
                                        >
                                            <td className="rounded-l-3xl border-y border-l border-white/50 px-6 py-5">
                                                <p className="text-sm font-black text-[#0038A8] transition-colors group-hover:text-blue-700">
                                                    {thesis.title}
                                                </p>
                                                <span className="mt-1 inline-block rounded-md bg-[#FFD700] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow-sm">
                                                    {thesis.type}
                                                </span>
                                            </td>
                                            <td className="border-y border-white/50 px-6 py-5 text-sm font-bold italic text-slate-600">
                                                {thesis.student}
                                            </td>
                                            <td className="border-y border-white/50 px-6 py-5 text-center">
                                                <span
                                                    className={`rounded-xl border px-4 py-1.5 text-[10px] font-black uppercase tracking-tighter ${
                                                        thesis.status === "Graded"
                                                            ? "border-green-200 bg-green-500/10 text-green-700"
                                                            : "border-blue-200 bg-[#0038A8]/10 text-[#0038A8]"
                                                    }`}
                                                >
                                                    {thesis.status}
                                                </span>
                                            </td>
                                            <td className="rounded-r-3xl border-y border-r border-white/50 px-6 py-5 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button className="rounded-xl border border-slate-50 bg-white p-3 text-slate-400 transition-all hover:text-[#0038A8] hover:shadow-lg">
                                                        <Download size={18} />
                                                    </button>
                                                    <button className="flex items-center gap-2 rounded-xl bg-[#0038A8] px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-900/10 transition-all hover:bg-[#FFD700] hover:text-[#0038A8]">
                                                        Evaluate <ExternalLink size={12} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT SIDEBAR: DEFENSE SCHEDULE --- */}
                <div className="space-y-6">
                    <div className="rounded-[2.5rem] border border-b-8 border-white/40 border-b-[#FFD700] bg-white/60 p-8 shadow-xl shadow-blue-900/5 backdrop-blur-xl">
                        <div className="mb-8 flex items-center gap-3">
                            <Calendar
                                className="text-[#0038A8]"
                                size={20}
                            />
                            <h3 className="text-lg font-black uppercase tracking-tighter text-[#0038A8]">Defense Schedule</h3>
                        </div>

                        <div className="space-y-5">
                            {panelistData.upcomingDefenses.map((def, idx) => (
                                <div
                                    key={idx}
                                    className="group relative border-l-2 border-slate-100 pl-4 transition-colors hover:border-[#FFD700]"
                                >
                                    <div className="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-slate-200 transition-colors group-hover:bg-[#FFD700]"></div>

                                    <div className="rounded-2xl border border-white bg-white/50 p-4 shadow-sm transition-all group-hover:bg-white">
                                        <div className="mb-3 flex items-start justify-between">
                                            <div className="rounded-lg bg-[#0038A8] px-3 py-1 text-center text-white shadow-lg shadow-blue-900/20">
                                                <p className="text-[8px] font-black uppercase tracking-widest">{def.date.split(" ")[0]}</p>
                                                <p className="text-sm font-black leading-none tracking-tighter">
                                                    {def.date.split(" ")[1].replace(",", "")}
                                                </p>
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400">{def.time}</p>
                                        </div>

                                        <p className="mb-1 truncate text-xs font-black uppercase tracking-tight text-[#0038A8]">{def.student}</p>
                                        <div className="flex items-center gap-2 text-[10px] font-bold italic text-slate-500">
                                            <div className="h-1 w-1 rounded-full bg-yellow-400"></div>
                                            {def.room}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#0038A8]/20 bg-[#0038A8]/5 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#0038A8] transition-all hover:bg-[#0038A8] hover:text-white">
                            View Full Calendar <ArrowRight size={14} />
                        </button>
                    </div>

                    {/* Quick Tip Card */}
                    <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0038A8] to-blue-900 p-6 text-white shadow-2xl">
                        <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-[#FFD700] opacity-10 transition-transform duration-700 group-hover:scale-150"></div>
                        <h4 className="mb-2 text-sm font-black uppercase italic tracking-widest text-[#FFD700]">Grading Reminder</h4>
                        <p className="text-[10px] font-medium leading-relaxed text-blue-100/80">
                            Ensure all rubric criteria are filled before submitting. Grades are final once posted.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PanelistDashboard;
