import React, { useState } from "react";
import { GraduationCap, UserCheck, Star, Bell } from "lucide-react";
import AdviserDashboard from "./AdvicerDashboard/AdviserDashboard";
import PanelistDashboard from "./PanelistDashboard/PanelistDashboard";

const PanelistAndAdviser = () => {
    const [userRole, setUserRole] = useState("adviser");

    const facultyData = {
        name: "Dr. Roberto Gomez",
        initials: "RG",
    };

    const adviseeData = [
        {
            id: 1,
            name: "Juan Dela Cruz",
            title: "AI-Driven MentorHub for Research",
            progress: 65,
            status: "Reviewing Ch. 4",
            lastUpdate: "2 hrs ago",
        },
        {
            id: 2,
            name: "Maria Clara",
            title: "Smart City Waste Management System",
            progress: 90,
            status: "Ready for Defense",
            lastUpdate: "1 day ago",
        },
    ];

    const panelistData = {
        assignedThesis: [{ id: 101, title: "Blockchain-based Voting System", student: "Alice Reyes", status: "Ready for Review", type: "Proposal" }],
        upcomingDefenses: [{ date: "Oct 25, 2024", time: "10:00 AM", student: "Alice Reyes", room: "AVR-1" }],
    };

    return (
        <div className="min-h-screen font-sans text-gray-900">
            <main className="mx-auto max-w-7xl p-2 sm:p-6 lg:p-2">
                
                {/* ROLE SWITCHER - Nilipat dito sa loob ng Page Body */}
                <div className="mb-8 flex justify-end">
                    <div className="inline-flex rounded-xl bg-slate-200 p-1 shadow-inner">
                        <button
                            onClick={() => setUserRole("adviser")}
                            className={`flex items-center gap-2 rounded-lg px-6 py-2 text-xs font-black transition-all ${
                                userRole === "adviser" 
                                ? "bg-white text-indigo-600 shadow-sm" 
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <UserCheck size={14} /> ADVISER
                        </button>
                        <button
                            onClick={() => setUserRole("panelist")}
                            className={`flex items-center gap-2 rounded-lg px-6 py-2 text-xs font-black transition-all ${
                                userRole === "panelist" 
                                ? "bg-white text-indigo-600 shadow-sm" 
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <Star size={14} /> PANELIST
                        </button>
                    </div>
                </div>

                {/* Dashboard Components */}
                <div className="animate-in fade-in duration-500">
                    {userRole === "adviser" ? (
                        <AdviserDashboard adviseeData={adviseeData} />
                    ) : (
                        <PanelistDashboard panelistData={panelistData} />
                    )}
                </div>
            </main>

            <footer className="mx-auto mt-12 max-w-7xl border-t border-slate-200 px-4 py-12 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                &copy; 2024 MentorHub Faculty Research Management System
            </footer>
        </div>
    );
};

export default PanelistAndAdviser;