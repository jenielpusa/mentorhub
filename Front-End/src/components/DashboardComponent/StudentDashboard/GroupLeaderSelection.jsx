// components/GroupLeaderSelection.jsx
import React from 'react';
import { Crown, AlertCircle } from 'lucide-react';

const GroupLeaderSelection = ({ 
  availableLeaders, 
  Studentlead, 
  handleSelectLeader, 
  getLeaderColor, 
  bipsuGlass 
}) => {
  return (
    <div className="mb-8">
      <div className={`${bipsuGlass} rounded-[2rem] p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-lg text-[#0038A8] uppercase tracking-tighter italic flex items-center gap-2">
            <Crown className="text-[#FFD700]" size={22} />
            Group Leader Selection
          </h3>
        </div>

        <p className="text-[10px] text-slate-600 mb-4">
          Pumili ng lider para sa inyong grupo. Ang lider ang magmo-monitor ng progress at mag-aapruba ng mga miyembro.
          <span className="text-amber-600 block mt-1">⚠️ Kailangan pumili ng lider bago makapagpatuloy sa ibang steps.</span>
        </p>

        {availableLeaders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableLeaders.map((leader) => (
              <div key={leader.id} className="bg-white/60 rounded-2xl p-4 border border-white/50 hover:shadow-lg transition-all hover:border-amber-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-12 w-12 rounded-full ${getLeaderColor(leader.name)} flex items-center justify-center text-white font-black text-lg`}>
                    {leader.firstName?.charAt(0)}{leader.lastName?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[11px] font-black text-[#0038A8]">{leader.name}</h4>
                    <p className="text-[7px] text-slate-500 uppercase font-bold">{leader.course}</p>
                    <p className="text-[7px] text-slate-400">ID: {leader.studentId}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSelectLeader(leader)}
                  className="w-full py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg"
                >
                  <Crown size={10} /> Select as Group Leader
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white/40 rounded-2xl">
            <AlertCircle size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No available leaders found</p>
            <p className="text-slate-300 text-xs mt-1">
              {Studentlead && Studentlead.length > 0
                ? "No eligible students to be leaders. Make sure there are approved students in the system."
                : "Please ensure there are students registered in the system."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupLeaderSelection;