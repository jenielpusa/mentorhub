// components/RegistrationStepsCard.jsx
import React from 'react';
import { CheckCircle, Clock, Check } from 'lucide-react';

const StepItem = React.memo(({ label, isDone, isHighlight }) => (
  <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${isDone ? 'bg-green-50 border-green-100' : isHighlight ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
    <div className={`h-6 w-6 rounded-full flex items-center justify-center ${isDone ? 'bg-green-500 text-white' : isHighlight ? 'bg-amber-500 text-white' : 'bg-white text-slate-300'}`}>
      {isDone ? <Check size={14} strokeWidth={4} /> : <Clock size={14} />}
    </div>
    <span className={`text-[11px] font-black uppercase ${isDone ? 'text-green-700' : isHighlight ? 'text-amber-700' : 'text-slate-400'}`}>{label}</span>
  </div>
));

const RegistrationStepsCard = ({ 
  milestones, 
  savedLeader, 
  savedAdviser, 
  savedCoAdviser, 
  role, 
  allStepsComplete, 
  floatingClass 
}) => {
  return (
    <div className={`${floatingClass} rounded-[3rem] p-8 sticky top-6`}>
      <h3 className="font-black text-lg text-[#0038A8] mb-6 flex items-center gap-2 uppercase italic">
        <CheckCircle className="text-[#FFD700]" size={20} /> Registration Steps
      </h3>
      <div className="space-y-3">
        <StepItem label="Create/Join Group" isDone={milestones.groupCreated} />
        <StepItem label="Complete Members" isDone={milestones.membersComplete} />
        <StepItem label="Leader Approves Members" isDone={milestones.membersApproved} isHighlight={!milestones.membersApproved && milestones.membersComplete} />
        {role === 'member' && (
          <StepItem label="Select Group Leader" isDone={!!savedLeader} isHighlight={!savedLeader} />
        )}
        {role !== 'member' && (
          <>
            <StepItem label="Select Adviser" isDone={!!savedAdviser} />
            <StepItem label="Select Co-Adviser" isDone={!!savedCoAdviser} />
          </>
        )}
        <StepItem label="Thesis Title Approved" isDone={milestones.titleApproved} isHighlight={!milestones.titleApproved && (role === 'member' ? !!savedLeader : (!!savedAdviser && !!savedCoAdviser))} />
      </div>

      {allStepsComplete && (
        <div className="mt-4 p-3 bg-green-50 rounded-2xl">
          <p className="text-[9px] text-green-700 font-bold text-center">🎉 REGISTRATION COMPLETE! 🎉</p>
        </div>
      )}
    </div>
  );
};

export default RegistrationStepsCard;