import { PencilLine, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

const StudentListTable = ({ 
    rows, onEdit, onUpdateStatus, 
    currentPage, totalPages, setCurrentPage 
}) => {
    return (
        <div className="overflow-hidden bg-white/40 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl dark:bg-slate-900/60 dark:border-white/10">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-white/20 bg-slate-50/50 dark:bg-white/5">
                        <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-yellow-400">
                            <th className="p-5">Full Name</th>
                            <th className="p-5">Student ID</th>
                            <th className="p-5">Department</th>
                            <th className="p-5 text-center">Status</th>
                            <th className="p-5 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {rows.map((row) => (
                            <tr key={row.id} className="transition-all hover:bg-white/40 dark:hover:bg-white/5">
                                <td className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-black text-white">
                                            {row.firstName.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black dark:text-slate-100">{row.fullName}</span>
                                            <span className="text-[10px] font-bold text-blue-500 uppercase">{row.gender}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5 font-mono text-sm font-bold">{row.studentID}</td>
                                <td className="p-5 text-sm">{row.department}</td>
                                <td className="p-5 text-center">
                                    <span className={cn(
                                        "inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase",
                                        row.status === "Approved" ? "bg-green-100 text-green-700" : 
                                        row.status === "Blocked" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                                    )}>
                                        {row.status}
                                    </span>
                                </td>
                                <td className="p-5 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        {row.status === "Pending" && (
                                            <button onClick={() => onUpdateStatus(row.id, "Approved")} className="rounded-xl bg-green-500/10 p-2 text-green-600 hover:bg-green-600 hover:text-white">
                                                <span className="text-[10px] font-black">APPROVE</span>
                                            </button>
                                        )}
                                        <button onClick={() => onEdit(row)} className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 hover:bg-blue-600 hover:text-white">
                                            <PencilLine size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination UI inside Table */}
            <div className="flex items-center justify-between p-6 border-t border-white/10">
                <p className="text-[10px] font-black uppercase text-slate-400">Page {currentPage} of {totalPages}</p>
                <div className="flex items-center gap-2">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-xl bg-white/50 disabled:opacity-20"><ChevronLeft size={18}/></button>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-xl bg-white/50 disabled:opacity-20"><ChevronRight size={18}/></button>
                </div>
            </div>
        </div>
    );
};

export default StudentListTable;