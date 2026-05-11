// components/SelectedLeaderDisplay.jsx
import React from 'react';
import { Crown, CheckCircle } from 'lucide-react';

const SelectedLeaderDisplay = ({ savedLeader, getLeaderColor, bipsuGlass }) => {
  return (
    <div className="mb-8">
      <div className={`${bipsuGlass} rounded-[2rem] p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-lg text-[#0038A8] uppercase tracking-tighter italic flex items-center gap-2">
            <Crown className="text-[#FFD700]" size={22} />
            Your Group Leader
          </h3>
          <span className="text-[9px] font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircle size={10} /> Leader Assigned
          </span>
        </div>

        <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl">
          <div className={`h-16 w-16 rounded-full ${getLeaderColor(savedLeader.name)} flex items-center justify-center text-white font-black text-2xl shadow-lg`}>
            {savedLeader.firstName?.charAt(0) || savedLeader.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-black text-amber-800">{savedLeader.name}</h4>
              <span className="px-2 py-0.5 bg-amber-500 text-white text-[8px] font-bold rounded-full flex items-center gap-1">
                <Crown size={10} /> GROUP LEADER
              </span>
            </div>
            <p className="text-[8px] text-green-600 mt-2 flex items-center gap-1">
              <CheckCircle size={10} /> Selected on: {new Date(savedLeader.selectedAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <Crown size={32} className="text-amber-500" />
            <p className="text-[8px] text-amber-600 font-bold mt-1">LEADER</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedLeaderDisplay;