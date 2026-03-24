import React from "react";
import { Search, BookOpen, Clock, TrendingUp } from "lucide-react";
import { StatCard, TopStudyFieldsCard, LatestArchivesCard, AdviserWorkloadCard } from "./DashboardCard";
import SubmissionTrends from "./SubmissionTrend";

const ResearchAnalytics = () => {
    // Mock Data (Maaari itong i-fetch mula sa API)
    const stats = [
        { label: "Total Manuscripts", value: "1,284", icon: BookOpen, color: "bg-blue-500" },
        { label: "Active Research", value: "42", icon: Clock, color: "bg-amber-500" },
    ];

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const lineData = [20, 35, 25, 60, 40, 50, 85, 60, 35, 70, 45, 75];
    const thesisData = [15, 25, 10, 45, 20, 30, 50, 40, 20, 50, 30, 55];
    const capstoneData = [5, 10, 15, 15, 20, 20, 35, 20, 15, 20, 15, 20];

    const fieldsData = [
        { name: "Information Technology", count: 420, color: "bg-blue-500", w: "85%" },
        { name: "Education", count: 310, color: "bg-emerald-500", w: "65%" },
        { name: "Engineering", count: 215, color: "bg-amber-500", w: "45%" },
        { name: "Business Management", count: 180, color: "bg-purple-500", w: "35%" },
    ];

    const recentArchives = [
        { title: "AI-Driven Crop Monitoring System", group: "AgriTech", date: "2 mins ago" },
        { title: "Blockchain for Student Records", group: "CyberSecure", date: "1 hour ago" },
        { title: "Smart Traffic Management", group: "UrbanDev", date: "3 hours ago" },
    ];

    const adviserData = [
        { name: "Dr. Maria Santos", groups: 8, load: "90%" },
        { name: "Prof. John Doe", groups: 6, load: "70%" },
    ];

    return (
        <div className="relative min-h-screen overflow-hidden p-4 font-sans transition-colors md:p-2">
            <div className="relative z-10 mx-auto max-w-8xl">
                {/* Header */}
                <header className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-black uppercase leading-none tracking-tighter text-[#0038A8] dark:text-yellow-400 md:text-5xl">
                            Research Analytics
                        </h1>
                        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                            Overview and insights of archived manuscripts
                        </p>
                    </div>
                    <div className="relative">
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            size={18}
                        />
                        {/* Siniguro nating rounded-2xl ito */}
                        <input
                            type="text"
                            placeholder="Search archives..."
                            className="w-full rounded-2xl border border-white/40 bg-white/60 py-4 pl-12 pr-6 text-sm font-bold outline-none backdrop-blur-md dark:bg-slate-800/50 md:w-80"
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* LEFT COLUMN */}
                    <div className="space-y-8 lg:col-span-8">
                        {/* Siguraduhin na sa loob ng SubmissionTrends component ay may rounded-3xl class din */}
                        <div className="overflow-hidden rounded-[2.5rem]">
                            <SubmissionTrends
                                months={months}
                                lineData={lineData}
                                thesisData={thesisData}
                                capstoneData={capstoneData}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Wrapper para sa TopStudyFieldsCard para makuha ang rounded effect */}
                            <div className="overflow-hidden rounded-[2.5rem]">
                                <TopStudyFieldsCard fields={fieldsData} />
                            </div>

                            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-white/60 bg-white/40 p-6 text-center dark:border-white/10 dark:bg-slate-900/60">
                                <TrendingUp
                                    size={36}
                                    className="mb-4 text-emerald-500"
                                />
                                <h4 className="text-sm font-black uppercase text-slate-800 dark:text-white">Growth Insight</h4>
                                <button className="mt-8 rounded-2xl bg-[#0038A8] px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:opacity-90">
                                    Generate Report
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-6 lg:col-span-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Siguraduhin na ang StatCard component ay gumagamit ng rounded-3xl o rounded-2xl */}
                            {stats.map((stat, idx) => (
                                <StatCard
                                    key={idx}
                                    {...stat}
                                />
                            ))}
                        </div>

                        {/* Mga side cards na may rounded corners */}
                        <div className="overflow-hidden rounded-[2rem] border border-white/20">
                            <LatestArchivesCard archives={recentArchives} />
                        </div>

                        <div className="overflow-hidden rounded-[2rem] border border-white/20">
                            <AdviserWorkloadCard advisers={adviserData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResearchAnalytics;
