// components/CreateGroupModal.jsx
import React from 'react';
import { X } from 'lucide-react';

const CreateGroupModal = ({ isModalOpen, setIsModalOpen, formInput, setFormInput, handleGroupSubmit, floatingClass }) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
      <div className={`${floatingClass} w-full max-w-md rounded-[2.5rem] p-8 relative z-10`}>
        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
        <h2 className="text-xl font-black text-[#0038A8] italic uppercase mb-6">Create New Group</h2>
        <form onSubmit={handleGroupSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Enter Group Name" 
            required 
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 focus:border-[#0038A8] outline-none font-bold text-[#0038A8]" 
            value={formInput.groupName} 
            onChange={(e) => setFormInput({ groupName: e.target.value })} 
          />
          <button type="submit" className="w-full bg-[#0038A8] text-[#FFD700] font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all">
            Initialize Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;