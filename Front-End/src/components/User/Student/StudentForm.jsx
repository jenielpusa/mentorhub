import { X, Save, IdCard, MapPin, Phone } from "lucide-react";
import { cn } from "@/utils/cn";

const StudentForm = ({ isOpen, onClose, editingUser, onSubmit, formData, setFormData, loading }) => {
    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const glassClass = "bg-white/40 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl dark:bg-slate-900/60 dark:border-white/10";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className={cn(glassClass, "animate-in zoom-in relative max-h-[95vh] w-full max-w-2xl overflow-y-auto bg-white p-8 duration-200 dark:bg-slate-900")}>
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-[#0038A8] dark:text-yellow-400">
                        {editingUser ? "Update Account" : "Create New Account"}
                    </h2>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <X size={24} />
                    </button>
                </div>

                <form className="space-y-5" onSubmit={onSubmit}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="ml-1 text-[10px] font-black uppercase text-slate-400">Full Name</label>
                            <input name="full_name_display" readOnly value={formData.full_name_display} className="w-full rounded-xl border-none bg-slate-100 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800" placeholder="Juan Dela Cruz" />
                        </div>
                        <div className="space-y-1">
                            <label className="ml-1 text-[10px] font-black uppercase text-slate-400">Student ID</label>
                            <div className="relative">
                                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input name="studentID" value={formData.studentID} onChange={handleInputChange} className="w-full rounded-xl border-none bg-slate-100 py-3 pl-10 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="ml-1 text-[10px] font-black uppercase text-slate-400">Department</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input name="department" value={formData.department} onChange={handleInputChange} className="w-full rounded-xl border-none bg-slate-100 py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="ml-1 text-[10px] font-black uppercase text-slate-400">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full rounded-xl border-none bg-slate-100 px-4 py-3 text-sm outline-none dark:bg-slate-800">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-white/5 dark:bg-white/5 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="ml-1 text-[10px] font-black uppercase text-blue-600 dark:text-yellow-500">Emergency Contact Name</label>
                            <input name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleInputChange} className="w-full rounded-xl border-none bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900" />
                        </div>
                        <div className="space-y-1">
                            <label className="ml-1 text-[10px] font-black uppercase text-blue-600 dark:text-yellow-500">Emergency Contact Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input name="emergency_contact_number" value={formData.emergency_contact_number} onChange={handleInputChange} className="w-full rounded-xl border-none bg-white py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900" />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0038A8] py-4 text-xs font-black uppercase text-white shadow-xl transition-all hover:opacity-90 active:scale-95 dark:bg-yellow-500 dark:text-blue-950">
                        <Save size={18} /> {editingUser ? "Update Student Record" : "Register New Student"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudentForm;