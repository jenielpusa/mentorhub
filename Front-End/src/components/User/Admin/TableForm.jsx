import { Search, ChevronLeft, ChevronRight, Phone, PencilLine } from "lucide-react";
import { cn } from "@/utils/cn";

const TableForm = ({
    filteredRows,
    roleFilter,
    onRoleFilterChange,
    searchTerm,
    onSearchChange,
    limit,
    onLimitChange,
    currentPage,
    totalPages,
    onPageChange,
    onUpdateStatus,
    onEdit,
    glassClass,
}) => {

    console.log("filteredRows",filteredRows)
    return (
        <>
            {/* Filters */}
            <div className={cn(glassClass, "flex flex-wrap items-center justify-between gap-4 p-5")}>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-slate-400">Show</span>
                        <select value={limit} onChange={onLimitChange} className="rounded-xl bg-white/60 px-4 py-2 text-xs font-black outline-none dark:bg-slate-800">
                            <option value={5}>05</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-slate-400">Role</span>
                        <select value={roleFilter} onChange={onRoleFilterChange} className="rounded-xl bg-white/60 px-4 py-2 text-xs font-black outline-none dark:bg-slate-800">
                            <option value="all">All</option>
                            <option value="admin">Admin</option>
                            <option value="adviser">Adviser</option>
                            <option value="panelist">Panelist</option>
                            <option value="instructor">Instructor</option>
                        </select>
                    </div>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={onSearchChange}
                        className="w-full rounded-2xl border border-white/10 bg-white/60 py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#0038A8] dark:bg-slate-800/60 dark:focus:ring-yellow-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className={cn(glassClass, "overflow-hidden")}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-white/20 bg-slate-50/50 dark:bg-white/5">
                            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-yellow-400">
                                <th className="p-5">Full Name</th>
                                <th className="p-5">ID Number</th>
                                <th className="p-5">Department</th>
                                <th className="p-5">Contact Number</th>
                                <th className="p-5 text-center">Role</th>
                                <th className="p-5 text-center">Status</th>
                                <th className="p-5 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredRows.map((row) => (
                                <tr key={row.id} className="transition-all hover:bg-white/40 dark:hover:bg-white/5">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-black text-white">
                                                {row.firstName.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black leading-tight dark:text-slate-100">{row.fullName}</span>
                                                <span className="text-[10px] font-bold uppercase tracking-tighter text-blue-500">{row.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="font-mono text-sm font-bold">{row.idNumber}</span>
                                    </td>
                                    <td className="p-5">
                                        <span className="text-sm">{row.department}</span>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                                            <Phone size={12} className="text-slate-400" /> {row.contactNumber}
                                        </div>
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className="rounded-full bg-purple-100 px-3 py-1 text-[10px] font-black uppercase text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                            {row.role}
                                        </span>
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className={cn(
                                            "inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase",
                                            row.status === "Approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                            row.status === "Blocked" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                        )}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="p-5 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            {row.status === "Pending" && (
                                                <button
                                                    onClick={() => onUpdateStatus(row.id, "Approved")}
                                                    className="rounded-xl bg-green-500/10 p-2 text-green-600 hover:bg-green-600 hover:text-white transition-all"
                                                >
                                                    <span className="text-[10px] font-black uppercase px-1">Approve</span>
                                                </button>
                                            )}
                                            {row.status !== "Blocked" && (
                                                <button
                                                    onClick={() => onUpdateStatus(row.id, "Blocked")}
                                                    className="rounded-xl bg-red-500/10 p-2 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                                                >
                                                    <span className="text-[10px] font-black uppercase px-1">Block</span>
                                                </button>
                                            )}
                                            {row.status === "Blocked" && (
                                                <button
                                                    onClick={() => onUpdateStatus(row.id, "approved")}
                                                    className="rounded-xl bg-blue-500/10 p-2 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                                                >
                                                    <span className="text-[10px] font-black uppercase px-1">Unblock</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => onEdit(row)}
                                                className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                                            >
                                                <PencilLine size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 p-6 md:flex-row">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                        Page {currentPage} of {totalPages || 1}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => onPageChange('prev')}
                            className="rounded-xl border border-white/20 bg-white/50 p-2 hover:bg-white disabled:opacity-20 dark:bg-slate-800"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => onPageChange('next')}
                            className="rounded-xl border border-white/20 bg-white/50 p-2 hover:bg-white disabled:opacity-20 dark:bg-slate-800"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TableForm;