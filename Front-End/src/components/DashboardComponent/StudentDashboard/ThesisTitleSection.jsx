// components/ThesisTitleSection.jsx
import React from 'react';
import { BookOpen, Plus, CheckCircle } from 'lucide-react';

const ThesisTitleSection = ({
    proposedTitles,
    milestones,
    isEditingTitle,
    customTitle,
    setCustomTitle,
    setIsEditingTitle,
    handleAddCustomTitle,
    bipsuGlass
}) => {
    return (
        <div className={`${bipsuGlass} rounded-[3rem] p-8`}>
            <h3 className="font-black text-xl text-[#0038A8] uppercase tracking-tighter italic flex items-center gap-3 mb-6">
                <BookOpen className="text-[#FFD700]" size={24} /> Thesis Title Selection
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">
                <span className="font-bold text-[#0038A8]">Note:</span> Once the title is approved, the progress will update automatically.
            </p>

            <div className="space-y-4 mb-6">
                {proposedTitles.map((title) => (
                    <div key={title.id} className={`p-4 rounded-2xl border-2 transition-all ${title.status === 'approved'
                        ? 'border-green-400 bg-green-50/50 shadow-lg'
                        : 'border-white/50 bg-white/40'
                        }`}>
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h4 className="text-[12px] font-black text-[#0038A8]">{title.title}</h4>
                                <div className="flex gap-3 mt-2">
                                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${title.status === 'approved'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {title.status === 'approved' ? '✓ APPROVED ✓' : '⏳ PENDING APPROVAL'}
                                    </span>
                                </div>
                            </div>
                            {title.status === 'approved' && (
                                <div className="px-2 py-1 bg-green-500 rounded-full">
                                    <CheckCircle size={16} className="text-white" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ThesisTitleSection;