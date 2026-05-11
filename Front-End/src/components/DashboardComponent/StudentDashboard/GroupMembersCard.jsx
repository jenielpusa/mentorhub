// components/GroupMembersCard.jsx
import React from 'react';
import { Users, Crown, CheckCircle } from 'lucide-react';

const GroupMembersCard = ({ 
  groupMembers, 
  savedLeader, 
  milestones, 
  role, 
  handleApproveMember, 
  handleRejectMember, 
  floatingClass 
}) => {
  return (
    <div className={`${floatingClass} rounded-[3rem] p-8`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-lg text-[#0038A8] flex items-center gap-2 uppercase italic">
          <Users className="text-[#FFD700]" size={20} /> Group Members
        </h3>
        <div className="text-[8px] font-bold uppercase">
          {milestones.membersApproved ? (
            <span className="text-green-600">✓ All Approved</span>
          ) : groupMembers.length > 0 ? (
            <span className="text-yellow-600">⏳ Need Approval</span>
          ) : (
            <span className="text-red-400">No Members</span>
          )}
        </div>
      </div>

      {role === 'member' && savedLeader && (
        <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold">
              <Crown size={16} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-[11px] font-black text-amber-800">{savedLeader.name}</h4>
                <span className="px-2 py-0.5 bg-amber-500 text-white text-[7px] font-bold rounded-full">LEADER</span>
              </div>
              <p className="text-[8px] text-slate-600">{savedLeader.course}</p>
            </div>
            <Crown size={16} className="text-amber-500" />
          </div>
        </div>
      )}

      {groupMembers.filter(m => m.status === 'approved').map((m) => (
        <div key={m.id} className="flex items-center justify-between p-3 rounded-2xl bg-green-50 border border-green-100 mb-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-green-500 text-white flex items-center justify-center text-[10px] font-bold">
              {m.name?.charAt(0) || '?'}
            </div>
            <div>
              <h4 className="text-[10px] font-black text-green-700 leading-none uppercase">{m.name}</h4>
              <p className="text-[7px] text-green-500 font-bold uppercase mt-1">{m.role || "Member"}</p>
            </div>
          </div>
          <CheckCircle size={14} className="text-green-500" />
        </div>
      ))}

      {groupMembers.filter(m => m.status === 'pending').map((m) => (
        <div key={m.id} className="flex items-center justify-between p-3 rounded-2xl bg-yellow-50 border border-yellow-100 mb-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-yellow-500 text-white flex items-center justify-center text-[10px] font-bold">
              {m.name?.charAt(0) || '?'}
            </div>
            <div>
              <h4 className="text-[10px] font-black text-yellow-700 leading-none uppercase">{m.name}</h4>
              <p className="text-[7px] text-yellow-500 font-bold uppercase mt-1">{m.role || "Member"}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => handleApproveMember(m)} className="px-2 py-1 rounded-lg bg-green-500 text-white text-[8px] font-bold hover:bg-green-600">Approve</button>
            <button onClick={() => handleRejectMember(m)} className="px-2 py-1 rounded-lg bg-red-500 text-white text-[8px] font-bold hover:bg-red-600">Reject</button>
          </div>
        </div>
      ))}

      {groupMembers.length === 0 && (
        <div className="text-center py-8">
          <Users size={32} className="text-slate-300 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No group members found</p>
        </div>
      )}
    </div>
  );
};

export default GroupMembersCard;