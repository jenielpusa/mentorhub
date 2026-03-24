import { X, Save, IdCard, MapPin } from "lucide-react";
import { cn } from "@/utils/cn";

const AddForm = ({ isOpen, onClose, editingUser, onSave, formError, glassClass }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className={cn(glassClass, "animate-in zoom-in relative max-h-[95vh] w-full max-w-2xl overflow-y-auto bg-white p-8 duration-200 dark:bg-slate-900")}>
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-[#0038A8] dark:text-yellow-400">
                        {editingUser ? "Update Account" : "Create New Account"}
                    </h2>
                    <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                        <X size={24} />
                    </button>
                </div>

                {formError && (
                    <div className="mb-4 rounded-lg bg-red-100 p-3 text-xs font-bold text-red-600">
                        {formError}
                    </div>
                )}

                <form
                    className="space-y-5"
                    onSubmit={(e) => {
                        e.preventDefault();
                        // Kunin ang form data at ipasa sa onSave
                        const formData = new FormData(e.target);
                        const data = Object.fromEntries(formData);
                        onSave(data);
                    }}
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="ml-1 text-[10px] font-black uppercase text-slate-400">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                defaultValue={editingUser?.fullName}
                                className="w-full rounded-xl border-none bg-slate-100 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                                placeholder="Juan Dela Cruz"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="ml-1 text-[10px] font-black uppercase text-slate-400">ID Number</label>
                            <div className="relative">
                                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    name="idNumber"
                                    defaultValue={editingUser?.idNumber}
                                    className="w-full rounded-xl border-none bg-slate-100 py-3 pl-10 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                                    placeholder="64646456"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="ml-1 text-[10px] font-black uppercase text-slate-400">Department</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    name="department"
                                    defaultValue={editingUser?.department}
                                    className="w-full rounded-xl border-none bg-slate-100 py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                                    placeholder="Tourism"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="ml-1 text-[10px] font-black uppercase text-slate-400">Gender</label>
                            <select
                                name="gender"
                                defaultValue={editingUser?.gender?.toLowerCase() || "male"}
                                className="w-full rounded-xl border-none bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="ml-1 text-[10px] font-black uppercase text-slate-400">Role</label>
                        <select
                            name="role"
                            defaultValue={editingUser?.role?.toLowerCase() || "adviser"}
                            className="w-full rounded-xl border-none bg-slate-100 px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                        >
                            <option value="admin">Admin</option>
                            <option value="adviser">Adviser</option>
                            <option value="panelist">Panelist</option>
                            <option value="instructor">Instructor</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0038A8] py-4 text-xs font-black uppercase text-white shadow-xl transition-all hover:opacity-90 active:scale-95 dark:bg-yellow-500 dark:text-blue-950"
                    >
                        <Save size={18} /> {editingUser ? "Update Account Record" : "Register New Account"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddForm;