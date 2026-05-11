// components/DashboardHeader.jsx
import React from 'react';
import { GraduationCap } from 'lucide-react';

const DashboardHeader = ({ studentData, role }) => {
  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
      <div className="flex items-center gap-6">
        <div className="h-20 w-20 rounded-[2.5rem] bg-gradient-to-br from-[#0038A8] to-blue-800 flex items-center justify-center text-white shadow-2xl ring-4 ring-white">
          <GraduationCap size={40} />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0038A8] tracking-tight">
            Welcome, <span className="text-[#FFD700]">{studentData.name?.split(' ')[0] || 'User'}!</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1 italic">
            {studentData.course} • ID: {studentData.studentId} • Role: {role || 'Student'}
          </p>
        </div>
      </div>
      {role && (
        <div className="px-4 py-2 bg-[#0038A8] text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
          {role === 'member' ? 'Member Access Mode' : `${role} Role`}
        </div>
      )}
    </section>
  );
};

export default DashboardHeader;