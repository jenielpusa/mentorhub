// components/MemberApprovalModal.jsx
import React from 'react';
import { X } from 'lucide-react';

const MemberApprovalModal = ({ showMemberApprovalModal, setShowMemberApprovalModal, selectedMemberForApproval, confirmApproveMember, floatingClass }) => {
  if (!showMemberApprovalModal || !selectedMemberForApproval) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowMemberApprovalModal(false)}></div>
      <div className={`${floatingClass} w-full max-w-md rounded-[2.5rem] p-8 relative z-10`}>
        <button onClick={() => setShowMemberApprovalModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
        <h2 className="text-xl font-black text-[#0038A8] italic uppercase mb-4">Approve Member</h2>
        <p className="text-slate-600 mb-6">Approve <span className="font-bold text-[#0038A8]}">{selectedMemberForApproval.name}</span> to join your group?</p>
        <div className="flex gap-3">
          <button onClick={confirmApproveMember} className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl uppercase text-[10px] tracking-widest hover:bg-green-600">Yes, Approve</button>
          <button onClick={() => setShowMemberApprovalModal(false)} className="flex-1 bg-slate-200 text-slate-600 font-bold py-3 rounded-xl uppercase text-[10px] tracking-widest hover:bg-slate-300">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default MemberApprovalModal;