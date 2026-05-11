// components/LoadingSpinner.jsx
import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="text-center">
        <RefreshCw size={40} className="animate-spin text-[#0038A8] mx-auto mb-4" />
        <p className="text-slate-600 font-medium">Loading your information...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;