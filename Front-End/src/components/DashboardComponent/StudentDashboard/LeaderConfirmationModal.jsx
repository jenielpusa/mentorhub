// components/LeaderConfirmationModal.jsx
import React from 'react';
import { Crown, RefreshCw, X } from 'lucide-react';

const LeaderConfirmationModal = ({ showLeaderModal, setShowLeaderModal, selectedLeader, isSavingLeader, confirmLeaderSelection, floatingClass }) => {
  if (!showLeaderModal || !selectedLeader) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowLeaderModal(false)}></div>
      <div className={`${floatingClass} w-full max-w-md rounded-[2.5rem] p-8 relative z-10`}>
        <button onClick={() => setShowLeaderModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
        <h2 className="text-xl font-black text-[#0038A8] italic uppercase mb-4 flex items-center gap-2">
          <Crown className="text-[#FFD700]" size={24} /> Confirm Leader
        </h2>
        <div className="mb-6 p-4 bg-amber-50 rounded-2xl">
          <p className="text-slate-600 mb-2 text-center">
            Are you sure you want to select <span className="font-bold text-amber-700 text-lg block my-1">{selectedLeader.name}</span>
            as your <span className="font-bold text-amber-700">Group Leader</span>?
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={confirmLeaderSelection}
            disabled={isSavingLeader}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 rounded-xl uppercase text-[10px] tracking-widest hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isSavingLeader ? <RefreshCw size={12} className="animate-spin" /> : <Crown size={14} />}
            {isSavingLeader ? "Saving..." : "Yes, Select as Leader"}
          </button>
          <button
            onClick={() => setShowLeaderModal(false)}
            className="flex-1 bg-slate-200 text-slate-600 font-bold py-3 rounded-xl uppercase text-[10px] tracking-widest hover:bg-slate-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderConfirmationModal;