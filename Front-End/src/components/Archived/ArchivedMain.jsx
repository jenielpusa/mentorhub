import { useState } from "react";
import { 
    Folder, ChevronRight, FileText, Users, 
    GraduationCap, Calendar, Info, ArrowLeft,
    Search, BookOpen, Bookmark
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

const ArchiveComponent = () => {
    const [level, setLevel] = useState('departments');
    const [selection, setSelection] = useState({ dept: null, year: null, course: null, project: null });

    // --- MOCK DATA ---
    const departments = [
        { id: 'cs', name: 'Computer Studies', logo: '💻', color: 'bg-blue-600' },
        { id: 'eng', name: 'Engineering', logo: '⚙️', color: 'bg-red-600' },
    ];
    const years = ['2023-2024', '2022-2023'];
    const courses = ['BSIT', 'BSCS'];
    const projects = [
        { 
            id: 1, 
            title: "AI-Based Attendance System with Face Recognition", 
            group: "Group Alpha", 
            adviser: "Dr. Juan Dela Cruz",
            year: "2024",
            abstract: "A research focusing on utilizing machine learning to automate school attendance tracking...",
            members: ["Juan Luna", "Jose Rizal", "Andres Bonifacio"]
        },
        { 
            id: 2, 
            title: "BIPSU Campus Wayfinding Mobile Application", 
            group: "Team Beta", 
            adviser: "Engr. Maria Clara",
            year: "2024",
            abstract: "An Android application designed to help freshmen navigate the campus buildings easily...",
            members: ["Apolinario Mabini", "Melchora Aquino"]
        },
        { 
            id: 3, 
            title: "E-Voting System using Blockchain Technology", 
            group: "Gamma Devs", 
            adviser: "Prof. Lamberto",
            year: "2023",
            abstract: "Ensuring the security and transparency of student elections through decentralized data.",
            members: ["Marcelo H. Del Pilar", "Gregorio Del Pilar"]
        }
    ];

    const goBack = () => {
        if (level === 'details') setLevel('projects');
        else if (level === 'projects') setLevel('courses');
        else if (level === 'courses') setLevel('years');
        else if (level === 'years') setLevel('departments');
    };

    return (
        <div className="p-6 min-h-screen bg-transparent">
            {/* BREADCRUMBS & NAVIGATION */}
            <div className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                    {level !== 'departments' && (
                        <button onClick={goBack} className="p-3 bg-white/80 dark:bg-slate-800 rounded-2xl hover:bg-blue-500 hover:text-white transition-all shadow-md">
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <h1 className="text-3xl font-black text-[#0038A8] dark:text-yellow-400 uppercase tracking-tighter">Archive Repository</h1>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* 1. DEPARTMENT VIEW */}
                {level === 'departments' && (
                    <motion.div key="depts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {departments.map((dept) => (
                            <div key={dept.id} onClick={() => { setSelection({...selection, dept}); setLevel('years'); }} className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 shadow-xl cursor-pointer hover:-translate-y-2 transition-all">
                                <div className={cn("w-20 h-20 rounded-3xl mb-6 flex items-center justify-center text-4xl shadow-lg", dept.color)}>
                                    {dept.logo}
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase leading-tight mb-2">{dept.name}</h3>
                                <div className="flex items-center text-blue-500 font-black text-[10px] uppercase tracking-widest">
                                    Browse Records <ChevronRight size={14} />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* 2. YEARS (FOLDER VIEW) */}
                {level === 'years' && (
                    <motion.div key="years" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
                        {years.map((year) => (
                            <div key={year} onClick={() => { setSelection({...selection, year}); setLevel('courses'); }} className="group flex flex-col items-center cursor-pointer">
                                <div className="relative">
                                    <Folder size={110} className="text-amber-400 group-hover:fill-amber-400/40 group-hover:scale-105 transition-all drop-shadow-xl" />
                                    <Calendar className="absolute inset-0 m-auto text-amber-700/50" size={24} />
                                </div>
                                <span className="mt-4 text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{year}</span>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* 3. COURSES */}
                {level === 'courses' && (
                    <motion.div key="courses" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {courses.map((course) => (
                            <div key={course} onClick={() => { setSelection({...selection, course}); setLevel('projects'); }} className="bg-white/50 dark:bg-slate-800 p-6 rounded-[2rem] border-b-4 border-blue-600 flex items-center justify-between cursor-pointer hover:bg-blue-600 hover:text-white transition-all group">
                                <span className="text-lg font-black uppercase tracking-tighter">{course}</span>
                                <GraduationCap size={24} className="opacity-20 group-hover:opacity-100" />
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* 4. THESIS GRID (BOOK VIEW) */}
                {level === 'projects' && (
                    <motion.div key="projects" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        {projects.map((p) => (
                            <div 
                                key={p.id} 
                                onClick={() => { setSelection({...selection, project: p}); setLevel('details'); }}
                                className="relative group cursor-pointer"
                            >
                                {/* THE "BOOK" COVER */}
                                <div className="aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-r-2xl rounded-l-sm shadow-[-10px_10px_20px_rgba(0,0,0,0.2)] border-l-[6px] border-[#0038A8] dark:border-yellow-500 overflow-hidden group-hover:rotate-1 group-hover:scale-105 transition-all duration-300">
                                    <div className="p-6 h-full flex flex-col justify-between">
                                        <div>
                                            <Bookmark className="text-[#0038A8] dark:text-yellow-500 mb-4" fill="currentColor" size={24} />
                                            <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase leading-tight line-clamp-4">
                                                {p.title}
                                            </h4>
                                        </div>
                                        <div>
                                            <div className="w-10 h-1 bg-[#0038A8] dark:bg-yellow-500 mb-4 opacity-30" />
                                            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{p.group}</p>
                                            <p className="text-[9px] font-bold text-blue-600 dark:text-yellow-600 uppercase mt-1">Class of {p.year}</p>
                                        </div>
                                    </div>
                                    {/* Spine Effect */}
                                    <div className="absolute left-0 top-0 h-full w-[2px] bg-white/20" />
                                </div>
                                {/* Book Shadow/Shelf Base */}
                                <div className="mt-4 h-1 w-full bg-slate-400/20 blur-sm rounded-full" />
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* 5. SUMMARIZATION / DETAILS VIEW */}
                {level === 'details' && selection.project && (
                    <motion.div key="details" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-5xl mx-auto bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] border border-white/20 overflow-hidden shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-12">
                            {/* Left Side: Large Book Representation */}
                            <div className="md:col-span-4 bg-[#0038A8] p-12 flex flex-col items-center justify-center text-white text-center">
                                <div className="w-full aspect-[3/4] bg-white rounded-r-xl rounded-l-sm shadow-2xl mb-8 flex items-center justify-center p-8">
                                    <h2 className="text-blue-900 font-black uppercase text-xs leading-tight">{selection.project.title}</h2>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Adviser</span>
                                <p className="font-bold text-lg uppercase">{selection.project.adviser}</p>
                            </div>

                            {/* Right Side: Details */}
                            <div className="md:col-span-8 p-12">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase leading-tight mb-2">{selection.project.title}</h2>
                                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{selection.project.group} • {selection.project.year}</p>
                                    </div>
                                    <Info className="text-slate-300" size={32} />
                                </div>

                                <div className="space-y-8">
                                    <section>
                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Abstract Summary</h5>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic border-l-4 border-slate-200 dark:border-slate-700 pl-6">
                                            "{selection.project.abstract}"
                                        </p>
                                    </section>

                                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Users size={14} /> Group Members
                                            </h5>
                                            <div className="space-y-2">
                                                {selection.project.members.map((m, i) => (
                                                    <div key={i} className="text-xs font-bold text-slate-700 dark:text-slate-200 py-2 px-4 bg-slate-100 dark:bg-white/5 rounded-xl">
                                                        {m}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-end">
                                            <button className="w-full py-4 bg-[#0038A8] dark:bg-yellow-500 text-white dark:text-blue-950 rounded-2xl font-black uppercase text-xs shadow-xl hover:scale-[1.02] transition-all">
                                                Download Full Manuscript
                                            </button>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ArchiveComponent;