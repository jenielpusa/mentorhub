// components/AdviserSelectionSection.jsx
import React from 'react';
import { ShieldCheck, RefreshCw, Save, X, AlertCircle, Check } from 'lucide-react';

const AdviserSelectionSection = ({
    availableAdvisers,
    savedAdviser,
    savedCoAdviser,
    tempSelectedAdviser,
    tempSelectedCoAdviser,
    isSavingAdvisers,
    handleTempSelectAdviser,
    handleTempSelectCoAdviser,
    handleSaveBothAdvisers,
    handleResetTempSelection,
    getFacultyColor,
    getFacultyAvatar,
    bipsuGlass
}) => {
    return (
        <div className={`${bipsuGlass} rounded-[3rem] p-8`}>
            <h3 className="font-black text-xl text-[#0038A8] uppercase tracking-tighter italic flex items-center gap-3 mb-6">
                <ShieldCheck className="text-[#FFD700]" size={24} /> Select Adviser & Co-Adviser
            </h3>

            <div className="mb-4 p-2 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-[8px] text-blue-700 text-center">
                    📌 Note: Upon saving, the role (Adviser or Co-Adviser) for each selection will be automatically included in the payload.
                </p>
            </div>

            {isSavingAdvisers && (
                <div className="mb-4 p-3 bg-blue-50 rounded-2xl flex items-center justify-center gap-2">
                    <RefreshCw size={16} className="animate-spin text-[#0038A8]" />
                    <span className="text-[10px] font-bold text-[#0038A8]">Saving to database...</span>
                </div>
            )}

            {(savedAdviser || savedCoAdviser) && (
                <div className="mb-4 p-4 bg-green-50 rounded-2xl border border-green-200">
                    <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Check size={12} /> Currently Assigned (Saved in Database):
                    </p>
                    <div className="space-y-2">
                        {savedAdviser && (
                            <div className="flex items-center justify-between p-2 bg-white rounded-xl">
                                <div>
                                    <span className="text-[9px] font-bold text-[#0038A8]">Adviser:</span>
                                    <span className="text-[10px] font-semibold text-green-700 ml-2">{savedAdviser.name}</span>
                                </div>
                                <div className="px-2 py-1 bg-green-500 rounded-full">
                                    <Check size={10} className="text-white" />
                                </div>
                            </div>
                        )}
                        {savedCoAdviser && (
                            <div className="flex items-center justify-between p-2 bg-white rounded-xl">
                                <div>
                                    <span className="text-[9px] font-bold text-[#0038A8]">Co-Adviser:</span>
                                    <span className="text-[10px] font-semibold text-green-700 ml-2">{savedCoAdviser.name}</span>
                                </div>
                                <div className="px-2 py-1 bg-green-500 rounded-full">
                                    <Check size={10} className="text-white" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(tempSelectedAdviser || tempSelectedCoAdviser) && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-2xl border border-yellow-200">
                    <p className="text-[9px] font-bold text-yellow-700 uppercase tracking-wider mb-1">⏳ Pending Selection (Click Save to confirm):</p>
                    <div className="flex flex-wrap gap-2">
                        {tempSelectedAdviser && (
                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center gap-1">
                                Adviser: {tempSelectedAdviser.name}
                                <button onClick={() => setTempSelectedAdviser(null)} className="text-red-500 hover:text-red-700"><X size={10} /></button>
                            </span>
                        )}
                        {tempSelectedCoAdviser && (
                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center gap-1">
                                Co-Adviser: {tempSelectedCoAdviser.name}
                                <button onClick={() => setTempSelectedCoAdviser(null)} className="text-red-500 hover:text-red-700"><X size={10} /></button>
                            </span>
                        )}
                    </div>
                    <button onClick={handleResetTempSelection} className="mt-2 text-[8px] text-yellow-600 underline">
                        Clear all pending selections
                    </button>
                </div>
            )}

            {availableAdvisers.length === 0 && (
                <div className="text-center py-8 bg-yellow-50 rounded-2xl">
                    <AlertCircle className="text-yellow-500 mx-auto mb-2" size={32} />
                    <p className="text-slate-600 text-sm">No faculty members available for selection.</p>
                </div>
            )}

            {availableAdvisers.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {availableAdvisers.map((adv) => {
                            const isTempSelectedAsAdviser = tempSelectedAdviser?._id === adv._id;
                            const isTempSelectedAsCoAdviser = tempSelectedCoAdviser?._id === adv._id;
                            const isSavedAsAdviser = savedAdviser?._id === adv._id;
                            const isSavedAsCoAdviser = savedCoAdviser?._id === adv._id;
                            const isDisabled = isSavingAdvisers || isSavedAsAdviser || isSavedAsCoAdviser;

                            return (
                                <div key={adv.id} className={`p-4 rounded-[2rem] border-2 transition-all ${isTempSelectedAsAdviser || isTempSelectedAsCoAdviser ? 'border-yellow-500 bg-yellow-50/50' : (isSavedAsAdviser || isSavedAsCoAdviser) ? 'border-green-500 bg-green-50/50' : 'border-transparent bg-white/40 hover:scale-[1.01]'}`}>
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className={`h-10 w-10 rounded-full ${getFacultyColor(adv.name)} flex items-center justify-center text-white font-black`}>
                                            {adv.avatar?.url ? (
                                                <img src={adv.avatar.url} alt={adv.name} className="h-full w-full rounded-full object-cover" />
                                            ) : (
                                                getFacultyAvatar(adv.firstName, adv.lastName)
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-[11px] font-black text-[#0038A8]">{adv.name}</h4>
                                            <p className="text-[8px] text-slate-500 mt-0.5">{adv.department || 'Department'}</p>
                                            {(isSavedAsAdviser || isSavedAsCoAdviser) && (
                                                <div className="mt-1">
                                                    <span className="text-[7px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                                                        ✓ {isSavedAsAdviser ? 'Assigned as Adviser' : 'Assigned as Co-Adviser'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleTempSelectAdviser(adv)}
                                            disabled={isTempSelectedAsCoAdviser || isDisabled}
                                            className={`flex-1 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${isTempSelectedAsAdviser
                                                ? 'bg-yellow-500 text-white shadow-lg'
                                                : isSavedAsAdviser
                                                    ? 'bg-green-500 text-white cursor-not-allowed opacity-70'
                                                    : (isTempSelectedAsCoAdviser || isDisabled)
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-[#0038A8]/10 text-[#0038A8] hover:bg-[#0038A8] hover:text-white'
                                                }`}
                                        >
                                            {isSavedAsAdviser ? "Assigned" : "Adviser"}
                                        </button>
                                        <button
                                            onClick={() => handleTempSelectCoAdviser(adv)}
                                            disabled={isTempSelectedAsAdviser || isDisabled}
                                            className={`flex-1 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${isTempSelectedAsCoAdviser
                                                ? 'bg-yellow-500 text-white shadow-lg'
                                                : isSavedAsCoAdviser
                                                    ? 'bg-green-500 text-white cursor-not-allowed opacity-70'
                                                    : (isTempSelectedAsAdviser || isDisabled)
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-green-100 text-green-700 hover:bg-green-600 hover:text-white'
                                                }`}
                                        >
                                            {isSavedAsCoAdviser ? "Assigned" : "Co-Adviser"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {(!savedAdviser || !savedCoAdviser) && (
                        <div className="mt-4 pt-4 border-t border-white/30">
                            <button
                                onClick={handleSaveBothAdvisers}
                                disabled={!tempSelectedAdviser || !tempSelectedCoAdviser || isSavingAdvisers}
                                className={`w-full py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${(!tempSelectedAdviser || !tempSelectedCoAdviser)
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[#0038A8] to-blue-700 text-white hover:shadow-lg'
                                    }`}
                            >
                                {isSavingAdvisers ? (
                                    <RefreshCw size={14} className="animate-spin" />
                                ) : (
                                    <Save size={14} />
                                )}
                                {isSavingAdvisers ? "Saving..." : "💾 SAVE ADVISER & CO-ADVISER ASSIGNMENT"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdviserSelectionSection;