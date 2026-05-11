// components/ProgressCard.jsx
import React from 'react';
import { Users, Crown, UserCheck, FileText, Check } from 'lucide-react';

const StatusStat = React.memo(({ label, value, icon, isComplete }) => (
  <div className="flex flex-col">
    <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest flex items-center gap-1 mb-1">{icon} {label}</span>
    <span className={`text-[10px] font-black leading-tight flex items-center gap-1 ${isComplete ? 'text-green-600' : 'text-[#0038A8]'}`}>
      {isComplete && <Check size={10} className="text-green-500" />}
      {value}
    </span>
  </div>
));

const ProgressCard = ({ 
  studentData, 
  progress, 
  milestones, 
  savedLeader, 
  role, 
  savedAdviser, 
  savedCoAdviser, 
  groupMembers, 
  allStepsComplete, 
  getRemainingSteps, 
  bipsuGlass 
}) => {
  return (
    <div className={`${bipsuGlass} rounded-[3rem] p-8 relative overflow-hidden`}>
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <span className="px-4 py-1.5 bg-[#0038A8] text-white text-[9px] font-black rounded-xl uppercase tracking-widest shadow-lg">Current Status</span>
            <h2 className={`text-4xl font-black mt-5 leading-tight uppercase tracking-tighter ${studentData.groupName === "No Group Joined" ? 'text-slate-300' : 'text-[#0038A8]'}`}>
              {studentData.groupName}
            </h2>
            {role === 'member' && savedLeader && (
              <p className="text-[10px] text-amber-600 mt-2 flex items-center gap-1">
                <Crown size={12} className="text-[#FFD700]" />
                Group Leader: <span className="font-bold">{savedLeader.name}</span>
              </p>
            )}
          </div>
          <div className="text-right">
            <span className={`text-4xl font-black ${progress === 100 ? 'text-[#FFD700]' : 'text-[#0038A8]'}`}>
              {progress}%
            </span>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Completion</p>
          </div>
        </div>
      </div>

      <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden border border-white mb-8">
        <div
          className="h-full bg-gradient-to-r from-[#0038A8] via-blue-600 to-[#FFD700] transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{ transform: 'skewX(-20deg)' }}></div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <StatusStat label="Members" value={milestones.membersApproved ? "Approved" : (groupMembers.length > 0 ? "Pending" : "Incomplete")} icon={<Users size={12} />} isComplete={milestones.membersApproved} />
        {role === 'member' && (
          <StatusStat label="Group Leader" value={savedLeader?.name || "Not Selected"} icon={<Crown size={12} />} isComplete={!!savedLeader} />
        )}
        {role !== 'member' && (
          <>
            <StatusStat label="Adviser" value={savedAdviser?.name || studentData.adviser} icon={<UserCheck size={12} />} isComplete={!!savedAdviser} />
            <StatusStat label="Co-Adviser" value={savedCoAdviser?.name || studentData.coAdviser} icon={<UserCheck size={12} />} isComplete={!!savedCoAdviser} />
          </>
        )}
        <StatusStat label="Thesis Title" value={milestones.titleApproved ? "Approved" : "Pending"} icon={<FileText size={12} />} isComplete={milestones.titleApproved} />
      </div>

      {!allStepsComplete && progress < 100 && (
        <div className="mt-6 p-4 bg-yellow-50/50 rounded-2xl border border-yellow-200">
          <p className="text-[9px] font-bold text-yellow-700 uppercase tracking-wider mb-2">⚠️ Remaining Steps:</p>
          <div className="flex flex-wrap gap-2">
            {getRemainingSteps().map((step, index) => (
              <span key={index} className="text-[8px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                {step}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressCard;