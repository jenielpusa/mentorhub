import React, { useState, useEffect } from "react";
import { User, UserCheck, Users, GraduationCap, CheckCircle2, ArrowLeft } from "lucide-react";

const RoleRegistration = ({
  isOpen,
  onClose,
  role: initialRole,
  inline = false,
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
      description: "Enroll in subjects and submit your requirements or assignments.",
      icon: <GraduationCap size={20} />,
    },
    {
      id: "instructor",
      title: "Instructor",
      description: "Manage your classes, create content, and grade your students.",
      icon: <User size={20} />,
    },
    {
      id: "adviser",
      title: "Adviser",
      description: "Guide students through their research, thesis, or capstone projects.",
      icon: <UserCheck size={20} />,
    },
    {
      id: "panelist",
      title: "Panelist",
      description: "Participate in defense panels and evaluate student presentations.",
      icon: <Users size={20} />,
    },
  ];

  const handleSelection = (id) => {
    setSelectedRole(id);
  };

  const handleContinue = () => {
    if (selectedRole && onSelectRole) {
      onSelectRole(selectedRole);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-start overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-yellow-50/30 p-3">
      <div className="w-full max-w-3xl">
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="group mb-3 flex items-center gap-1.5 text-blue-900 transition hover:text-yellow-600"
          >
            <div className="rounded-lg bg-blue-100 p-1 group-hover:bg-yellow-200">
              <ArrowLeft className="h-3.5 w-3.5 text-blue-900" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              Back to Login
            </span>
          </button>
        )}

        <div className="mb-4 text-center">
          <h1 className="mb-1 text-xl font-bold text-blue-950">
            Select Your <span className="text-yellow-500">Role</span>
          </h1>
          <p className="text-xs text-blue-800/70">
            Choose the category that best fits your purpose in the system.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => handleSelection(role.id)}
                className={`relative flex items-start rounded-xl border-2 bg-white p-3 text-left shadow-sm transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? "border-yellow-400 bg-yellow-50 ring-2 ring-yellow-100 ring-offset-2"
                    : "border-blue-100 hover:border-yellow-300 hover:bg-blue-50/50"
                }`}
              >
                <div
                  className={`mr-3 rounded-lg p-1.5 transition-colors ${
                    isSelected
                      ? "bg-yellow-400 text-blue-900"
                      : "bg-blue-100 text-blue-900"
                  }`}
                >
                  {role.icon}
                </div>

                <div className="flex-1">
                  <div className="mb-0.5 flex items-center justify-between">
                    <h3
                      className={`text-sm font-bold ${
                        isSelected ? "text-blue-950" : "text-blue-900"
                      }`}
                    >
                      {role.title}
                    </h3>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed text-blue-800/60">
                    {role.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`transform rounded-full px-6 py-2.5 text-sm font-bold shadow-lg transition-all ${
              selectedRole
                ? "border-b-4 border-blue-950 bg-gradient-to-r from-blue-900 to-blue-800 text-white hover:from-blue-800 hover:to-blue-700 active:scale-95 focus:ring-4 focus:ring-yellow-400/50"
                : "cursor-not-allowed bg-gray-300 text-gray-500"
            }`}
          >
            {selectedRole
              ? `Continue as ${
                  selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)
                }`
              : "Select a Role to Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleRegistration;