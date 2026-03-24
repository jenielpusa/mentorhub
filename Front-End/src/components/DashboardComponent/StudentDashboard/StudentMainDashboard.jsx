import React, { useState } from 'react';
import { 
  LayoutDashboard, FileText, MessageSquare, Calendar, Upload, 
  CheckCircle, Clock, AlertCircle, LogOut, Bell, Search, 
  ChevronRight, MoreVertical, Menu, X, BookOpen, GraduationCap,
  Users, UserCheck, ShieldCheck, History, FileUp, Plus, Check,
  RefreshCw, Crown, UserPlus
} from 'lucide-react';

const MainDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [selectedAdviser, setSelectedAdviser] = useState(null);

  const [studentData, setStudentData] = useState({
    name: "Juan Dela Cruz",
    studentId: "2021-10432",
    course: "BS Information Technology",
    groupName: "No Group Joined", 
    thesisTitle: "TBD", 
    adviser: "TBA",
    progress: 0,
    status: "Incomplete",
  });

  // Data para sa Members Card (Right Side)
  const [groupMembers, setGroupMembers] = useState([
    { id: 1, name: "Juan Dela Cruz", role: "Leader", status: "Active" },
    { id: 2, name: "Maria Clara", role: "Member", status: "Active" },
    { id: 3, name: "Ibarra Crisostomo", role: "Member", status: "Active" },
  ]);

  const activeLeaders = [
    { id: 1, name: "Juan Dela Cruz", group: "Team Innovators", avatar: "JD" },
    { id: 2, name: "Maria Clara", group: "Cyber Sentinel", avatar: "MC" },
  ];

  const availableAdvisers = [
    { id: 1, name: "Dr. Maria Santos", avatar: "MS", color: "bg-blue-500", slots: 3, maxSlots: 5 },
    { id: 2, name: "Dr. Danilo Cruz", avatar: "DC", color: "bg-purple-500", slots: 5, maxSlots: 5 },
    { id: 3, name: "Prof. Elena Reyes", avatar: "ER", color: "bg-orange-500", slots: 1, maxSlots: 5 },
  ];

  const [milestones, setMilestones] = useState({
    groupCreated: false,
    membersComplete: false,
    adviserSelected: false,
    adviserApproved: false,
    finalTitle: false
  });

  const [formInput, setFormInput] = useState({ groupName: '' });

  const handleGroupSubmit = (e) => {
    e.preventDefault();
    setStudentData(prev => ({
      ...prev,
      groupName: formInput.groupName,
      status: "Group Formed",
      progress: 20
    }));
    setMilestones(prev => ({ ...prev, groupCreated: true }));
    setIsModalOpen(false);
  };

  const bipsuGlass = "backdrop-blur-xl bg-white/60 border border-white/40 shadow-[0_20px_50px_rgba(0,56,168,0.05)]";
  const floatingClass = "backdrop-blur-2xl bg-white/70 border border-white shadow-[0_30px_60px_-15px_rgba(0,56,168,0.2)] transition-all duration-500";

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-slate-900 p-3 md:p-6 ">
      <div className="fixed -top-24 -right-24 w-96 h-96 bg-[#0038A8]/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <main className="relative z-10 max-w-7xl mx-auto">
        <section className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-[2.5rem] bg-gradient-to-br from-[#0038A8] to-blue-800 flex items-center justify-center text-white shadow-2xl ring-4 ring-white">
              <GraduationCap size={40} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-[#0038A8] tracking-tight">
                Mabuhay, <span className="text-[#FFD700]">{studentData.name.split(' ')[0]}!</span> 
              </h1>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1 italic">
                {studentData.course} • ID: {studentData.studentId}
              </p>
            </div>
          </div>

          <button className="flex items-center gap-3 bg-white border-2 border-[#0038A8] text-[#0038A8] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0038A8] hover:text-white transition-all shadow-lg active:scale-95 group">
            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            Check Manuscript Revisions
          </button>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            
            {/* MAIN TRACKING CARD */}
            <div className={`${bipsuGlass} rounded-[3rem] p-8 relative overflow-hidden`}>
              <div className="mb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-4 py-1.5 bg-[#0038A8] text-white text-[9px] font-black rounded-xl uppercase tracking-widest shadow-lg">Current Status</span>
                    <h2 className={`text-4xl font-black mt-5 leading-tight uppercase tracking-tighter ${studentData.groupName === "No Group Joined" ? 'text-slate-300' : 'text-[#0038A8]'}`}>
                      {studentData.groupName}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-black text-[#0038A8]">{studentData.progress}%</span>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Completion</p>
                  </div>
                </div>
              </div>
              
              <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden border border-white mb-8">
                <div 
                  className="h-full bg-gradient-to-r from-[#0038A8] via-blue-600 to-[#FFD700] transition-all duration-1000 ease-out" 
                  style={{ width: `${studentData.progress}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatusStat label="Members" value={milestones.membersComplete ? "Complete" : "Pending"} icon={<Users size={12}/>} />
                <StatusStat label="Adviser" value={selectedAdviser ? selectedAdviser.name : "TBA"} icon={<UserCheck size={12}/>} />
                <StatusStat label="Registration" value={studentData.status} highlight />
                <StatusStat label="Final Title" value={studentData.thesisTitle} icon={<FileText size={12}/>} />
              </div>
            </div>

            {/* ACTIVE LEADERS */}
            <div className={`${bipsuGlass} rounded-[3rem] p-8`}>
              <h3 className="font-black text-xl text-[#0038A8] uppercase tracking-tighter italic flex items-center gap-3 mb-6">
                <Crown className="text-[#FFD700]" size={24} /> Active Leaders
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeLeaders.map((leader) => (
                  <button 
                    key={leader.id} 
                    onClick={() => setSelectedLeader(leader.id)}
                    className={`flex items-center justify-between p-4 rounded-3xl transition-all border-2 text-left ${selectedLeader === leader.id ? 'border-[#0038A8] bg-blue-50/50' : 'border-white bg-white/40'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-[#0038A8] text-white flex items-center justify-center font-black">{leader.avatar}</div>
                      <div>
                        <h4 className="text-[11px] font-black text-[#0038A8] leading-none">{leader.name}</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{leader.group}</p>
                      </div>
                    </div>
                    {selectedLeader === leader.id && <CheckCircle size={20} className="text-[#0038A8]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* ADVISER CANDIDATES */}
            <div className={`${bipsuGlass} rounded-[3rem] p-8`}>
              <h3 className="font-black text-xl text-[#0038A8] uppercase tracking-tighter italic flex items-center gap-3 mb-6">
                <ShieldCheck className="text-[#FFD700]" size={24} /> Adviser Candidates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableAdvisers.map((adv) => (
                  <button 
                    key={adv.id} 
                    disabled={adv.slots >= adv.maxSlots}
                    onClick={() => setSelectedAdviser(adv)}
                    className={`p-5 rounded-[2.5rem] border-2 transition-all flex flex-col items-center relative group ${selectedAdviser?.id === adv.id ? 'border-[#0038A8] bg-white' : 'border-transparent bg-white/40'} ${adv.slots >= adv.maxSlots ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#0038A8] hover:bg-white'}`}
                  >
                    {selectedAdviser?.id === adv.id && (
                      <div className="absolute top-4 right-4 text-[#0038A8]"><CheckCircle size={20} /></div>
                    )}
                    <div className={`h-12 w-12 rounded-full ${adv.color} flex items-center justify-center text-white font-black mb-3`}>{adv.avatar}</div>
                    <h4 className="text-[11px] font-black text-[#0038A8]">{adv.name}</h4>
                    <div className="mt-3 w-full px-4">
                      <div className="flex justify-between text-[8px] font-bold uppercase mb-1">
                        <span>Slots</span>
                        <span className={adv.slots >= adv.maxSlots ? 'text-red-500' : 'text-slate-400'}>{adv.slots}/{adv.maxSlots}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${adv.slots >= adv.maxSlots ? 'bg-red-500' : 'bg-[#0038A8]'}`} style={{ width: `${(adv.slots / adv.maxSlots) * 100}%` }}></div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR AREA (Dito ko nilagay ang Members Card) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* DAGDAG: GROUP MEMBERS CARD */}
            <div className={`${floatingClass} rounded-[3rem] p-8`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-lg text-[#0038A8] flex items-center gap-2 uppercase italic">
                  <Users className="text-[#FFD700]" size={20} /> Group Members
                </h3>
                <button className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[#0038A8] hover:bg-[#0038A8] hover:text-white transition-colors">
                   <UserPlus size={14} />
                </button>
              </div>
              <div className="space-y-4">
                {groupMembers.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-50 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 text-[#0038A8] flex items-center justify-center text-[10px] font-bold border border-blue-100">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-[#0038A8] leading-none uppercase">{m.name}</h4>
                        <p className="text-[8px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">{m.role}</p>
                      </div>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* REGISTRATION STEPS (Existing) */}
            <div className={`${floatingClass} rounded-[3rem] p-8 sticky top-6`}>
              <h3 className="font-black text-lg text-[#0038A8] mb-6 flex items-center gap-2 uppercase italic">
                <CheckCircle className="text-[#FFD700]" size={20} /> Registration Steps
              </h3>
              <div className="space-y-3">
                <StepItem label="Create/Join Group" isDone={milestones.groupCreated} />
                <StepItem label="Complete Members" isDone={milestones.membersComplete} />
                <StepItem label="Select Adviser" isDone={!!selectedAdviser} />
                <StepItem label="Adviser's Approval" isDone={milestones.adviserApproved} />
                <StepItem label="Final Title Selection" isDone={milestones.finalTitle} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAB */}
      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-8 right-8 h-16 w-16 bg-[#0038A8] hover:bg-blue-700 text-[#FFD700] rounded-full shadow-2xl flex items-center justify-center transition-all z-50">
        <Plus size={32} strokeWidth={3} />
      </button>

      {/* MODAL (Existing) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className={`${floatingClass} w-full max-w-md rounded-[2.5rem] p-8 relative z-10 animate-in fade-in zoom-in duration-300`}>
            <h2 className="text-xl font-black text-[#0038A8] italic uppercase mb-6">Create New Group</h2>
            <form onSubmit={handleGroupSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="Enter Group Name" 
                required
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 focus:border-[#0038A8] outline-none font-bold text-[#0038A8]"
                value={formInput.groupName}
                onChange={(e) => setFormInput({groupName: e.target.value})}
              />
              <button type="submit" className="w-full bg-[#0038A8] text-[#FFD700] font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest">
                Initialize Group
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-components
const StatusStat = ({ label, value, highlight, icon }) => (
  <div className="flex flex-col">
    <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest flex items-center gap-1 mb-1">{icon} {label}</span>
    <span className={`text-[10px] font-black leading-tight ${highlight ? 'text-orange-600' : 'text-[#0038A8]'}`}>{value}</span>
  </div>
);

const StepItem = ({ label, isDone }) => (
  <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${isDone ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100'}`}>
    <div className={`h-6 w-6 rounded-full flex items-center justify-center ${isDone ? 'bg-green-500 text-white' : 'bg-white text-slate-300'}`}>
      {isDone ? <Check size={14} strokeWidth={4} /> : <Clock size={14} />}
    </div>
    <span className={`text-[11px] font-black uppercase ${isDone ? 'text-green-700' : 'text-slate-400'}`}>{label}</span>
  </div>
);

export default MainDashboard;