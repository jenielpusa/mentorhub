import React from 'react';
import { Users, FileText, Calendar, CheckCircle, Clock, AlertCircle, MessageSquare } from 'lucide-react';

// --- DUMMY DATA ---
const ADVISEE_DATA = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    title: "AI-Powered Thesis Archiving System for Local Colleges",
    status: "Ready for Defense",
    progress: 92,
    lastUpdate: "2 hours ago"
  },
  {
    id: 2,
    name: "Maria Clara",
    title: "Impact of Remote Learning on Student Mental Health",
    status: "Revision Needed",
    progress: 65,
    lastUpdate: "Yesterday"
  },
  {
    id: 3,
    name: "Jose Rizal",
    title: "Blockchain-based Secure Voting Protocol",
    status: "Chapter 1-3 Review",
    progress: 40,
    lastUpdate: "3 days ago"
  }
];

// --- SUB-COMPONENTS ---
const TaskItem = ({ icon, label, urgent }) => (
  <div className={`flex items-center gap-3 p-3 rounded-2xl border backdrop-blur-sm transition-all cursor-pointer 
    ${urgent 
      ? 'bg-red-500/10 border-red-200/30 text-red-700 hover:bg-red-500/20 shadow-sm' 
      : 'bg-white/40 border-white/40 text-blue-900 hover:bg-blue-500/10 hover:translate-x-1'}`}>
    <div className={urgent ? "text-red-500" : "text-blue-600"}>{icon}</div>
    <span className="flex-1 font-bold text-[11px]">{label}</span>
    {urgent && <AlertCircle size={14} className="text-red-500 animate-pulse" />}
  </div>
);

// --- MAIN DASHBOARD ---
const AdviserDashboard = () => {
  return (
    // Background with abstract shapes for Glassmorphism effect
    <div className="min-h-screen relative overflow-hidden p-2 font-sans">
      <div className="relative z-10">
        {/* Header Section */}
        <section className="mb-10">
          <h1 className="text-4xl font-black text-blue-950 tracking-tight">Adviser Dashboard 📂</h1>
          <p className="text-blue-700/70 font-bold mt-1">Supervising {ADVISEE_DATA.length} active thesis projects</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Advisee List */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-black text-lg text-blue-900/80 flex items-center gap-2 px-2 uppercase tracking-widest">
              <Users size={20} className="text-yellow-500" /> My Advisees
            </h3>
            
            {ADVISEE_DATA.map((advisee) => (
              <div key={advisee.id} 
                className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 p-6 shadow-xl shadow-blue-900/5 hover:shadow-2xl transition-all duration-300 group">
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-5">
                    {/* Morphism Avatar */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30 ring-4 ring-white/50">
                      {advisee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-black text-blue-950 text-lg group-hover:text-blue-700 transition-colors">{advisee.name}</h4>
                      <p className="text-xs text-blue-800/60 font-medium italic">"{advisee.title}"</p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border-b-2 shadow-sm
                    ${advisee.status.includes('Ready') ? 'bg-green-500/10 text-green-700 border-green-500/20' : 
                      advisee.status.includes('Revision') ? 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20' : 
                      'bg-blue-500/10 text-blue-700 border-blue-500/20'}`}>
                    {advisee.status}
                  </span>
                </div>

                {/* Progress Section */}
                <div className="space-y-3 bg-blue-50/50 p-4 rounded-2xl border border-white/50">
                  <div className="flex justify-between text-xs font-black text-blue-900/70">
                    <span className="uppercase tracking-wide">Manuscript Progress</span>
                    <span className="bg-blue-900 text-white px-2 py-0.5 rounded-md">{advisee.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-white/50 rounded-full p-0.5 border border-white">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-1000 shadow-inner" 
                      style={{ width: `${advisee.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="mt-6 pt-4 flex justify-between items-center">
                  <span className="text-[10px] text-blue-900/40 font-black flex items-center gap-1.5 uppercase tracking-widest">
                    <Clock size={12} /> {advisee.lastUpdate}
                  </span>
                  <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white/80 text-blue-900 text-xs font-black rounded-xl hover:bg-yellow-400 hover:text-blue-900 transition-all border border-white shadow-sm">
                      Open
                    </button>
                    <button className="px-5 py-2.5 bg-blue-900 text-white text-xs font-black rounded-xl hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2">
                      <MessageSquare size={14} /> Feedback
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Sidebar Tasks */}
          <div className="space-y-8">
            <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 p-6 shadow-xl shadow-blue-900/5">
              <h3 className="font-black text-lg mb-5 text-blue-950 uppercase tracking-tight italic">Tasks</h3>
              <div className="space-y-4">
                <TaskItem icon={<FileText size={16} />} label="Review Juan's Chapter 4" urgent />
                <TaskItem icon={<Calendar size={16} />} label="Maria's Meeting (3PM)" />
                <TaskItem icon={<CheckCircle size={16} />} label="Jose's Title Draft" />
              </div>
            </div>

            {/* Nomination Card - Dark Morphism */}
            <div className="bg-blue-950 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group border-4 border-white/10">
              <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-yellow-400 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-1000"></div>
              
              <h3 className="font-black text-2xl mb-3 relative z-10 text-yellow-400 leading-tight">Defense Nominations</h3>
              <p className="text-[11px] text-blue-200/80 mb-8 relative z-10 font-medium leading-relaxed uppercase tracking-wider">
                Deadline for upcoming cycle is approaching.
              </p>
              <button className="w-full py-4 bg-yellow-400 text-blue-950 font-black rounded-2xl hover:bg-white hover:scale-[1.05] transition-all text-xs relative z-10 shadow-xl shadow-yellow-400/20 uppercase tracking-[0.2em]">
                Nominate Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdviserDashboard;