import React, { useState, useEffect } from "react";
import { User, UserCheck, Users, GraduationCap, CheckCircle2, ArrowLeft } from "lucide-react";

const RoleRegistration = ({
  role: initialRole,
  onSelectRole,
  onBack,
}) => {
  const [selectedRole, setSelectedRole] = useState(initialRole || null);

  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);

  const roles = [
    {
      id: "student",
      title: "Student",
      description: "Enroll in subjects and submit assignments.",
      icon: <GraduationCap size={18} />,
    },
    {
      id: "instructor",
      title: "Instructor",
      description: "Manage classes and grade students.",
      icon: <User size={18} />,
    },
    {
      id: "adviser",
      title: "Adviser",
      description: "Guide research and capstone projects.",
      icon: <UserCheck size={18} />,
    },
    {
      id: "panelist",
      title: "Panelist",
      description: "Evaluate presentations and defenses.",
      icon: <Users size={18} />,
    },
  ];

  const handleContinue = () => {
    if (selectedRole && onSelectRole) {
      onSelectRole(selectedRole);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        {onBack && (
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-xs font-medium">Back</span>
          </button>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-white tracking-tight">
          Select <span className="text-blue-500">Role</span>
        </h3>
        <p className="text-[11px] text-slate-400">Choose your identity within the system.</p>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 gap-2.5 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`relative flex items-center rounded-xl border p-3 text-left transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/50"
                  : "border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <div className={`mr-3 rounded-lg p-2 transition-colors ${
                  isSelected ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                {role.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold ${isSelected ? "text-white" : "text-slate-200"}`}>
                    {role.title}
                  </h4>
                  {isSelected && <CheckCircle2 size={14} className="text-blue-500" />}
                </div>
                <p className="text-[10px] leading-tight text-slate-500 mt-0.5">
                  {role.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="mt-5">
        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`w-full rounded-lg py-2.5 text-sm font-bold transition-all shadow-lg ${
            selectedRole
              ? "bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.98]"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          {selectedRole 
            ? `Continue as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}` 
            : "Select a Role"}
        </button>
      </div>
    </div>
  );
};

export default RoleRegistration;