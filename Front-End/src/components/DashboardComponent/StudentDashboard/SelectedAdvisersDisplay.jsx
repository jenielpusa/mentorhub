// components/SelectedAdvisersDisplay.jsx
import React from 'react';
import {
  LayoutDashboard, FileText, MessageSquare, Calendar, Upload,
  CheckCircle, Clock, AlertCircle, LogOut, Bell, Search,
  ChevronRight, MoreVertical, Menu, X, BookOpen, GraduationCap,
  Users, UserCheck, ShieldCheck, History, FileUp, Plus, Check,
  RefreshCw, Crown, UserPlus, Edit2, ThumbsUp, Save, Mail
} from 'lucide-react';

const SelectedAdvisersDisplay = ({ 
  savedAdviser, 
  savedCoAdviser, 
  getFacultyAvatarColor, 
  getFacultyInitials, 
  bipsuGlass 
}) => {
  return (
    <div className="mb-8">
      <div className={`${bipsuGlass} rounded-[2rem] p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-lg text-[#0038A8] uppercase tracking-tighter italic flex items-center gap-2">
            <ShieldCheck className="text-[#FFD700]" size={22} />
            Your Group Advisers
          </h3>
          <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircle size={10} /> Assigned
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Adviser Card */}
          {savedAdviser && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border-2 border-blue-200 hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className={`h-16 w-16 rounded-full ${getFacultyAvatarColor(savedAdviser.name)} flex items-center justify-center text-white font-black text-2xl shadow-lg`}>
                  <span>{getFacultyInitials(savedAdviser.firstName, savedAdviser.lastName)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-black text-blue-800">{savedAdviser.name}</h4>
                    <span className="px-2 py-0.5 bg-blue-500 text-white text-[8px] font-bold rounded-full">
                      ADVISER
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">
                    {savedAdviser.department || 'Faculty Department'}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-1 flex items-center gap-1">
                    <Mail size={10} /> {savedAdviser.email || 'Email not provided'}
                  </p>
                </div>
                <div className="text-right">
                  <ShieldCheck size={32} className="text-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* Co-Adviser Card */}
          {savedCoAdviser && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200 hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className={`h-16 w-16 rounded-full ${getFacultyAvatarColor(savedCoAdviser.name)} flex items-center justify-center text-white font-black text-2xl shadow-lg`}>
                  <span>{getFacultyInitials(savedCoAdviser.firstName, savedCoAdviser.lastName)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-black text-purple-800">{savedCoAdviser.name}</h4>
                    <span className="px-2 py-0.5 bg-purple-500 text-white text-[8px] font-bold rounded-full">
                      CO-ADVISER
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">
                    {savedCoAdviser.department || 'Faculty Department'}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-1 flex items-center gap-1">
                    <Mail size={10} /> {savedCoAdviser.email || 'Email not provided'}
                  </p>
                </div>
                <div className="text-right">
                  <UserCheck size={32} className="text-purple-500" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectedAdvisersDisplay;