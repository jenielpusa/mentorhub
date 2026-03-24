import { useState, useContext, useCallback, useMemo } from "react";
import {
    UserPlus,
    PencilLine,
    Search,
    ChevronLeft,
    ChevronRight,
    UserCog,
    X,
    Save,
    Lock,
    User as UserIcon,
    Eye,
    EyeOff,
    Phone,
    MapPin,
    IdCard,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Footer } from "@/layouts/footer";
import { StudentContext } from "../../../contexts/StudentContext/StudentContext";
import StatusModal from "../../../ReusableFolder/SuccessandField";

const StudentTable = () => {
    const { students, UpdateStatusAccount, currentPage, totalPages, limit, searchTerm, setCurrentPage, setLimit, setSearchTerm, setStudents } =
        useContext(StudentContext);

    // Local UI states (modal, form, etc.)
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusModalProps, setStatusModalProps] = useState({
        status: "success",
        error: null,
        title: "",
        message: "",
        onRetry: null,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState(null);

    const showStatusMessage = useCallback((status, error = null, customProps = {}) => {
        setStatusModalProps({
            status,
            error,
            title: customProps.title || "",
            message: customProps.message || "",
            onRetry: customProps.onRetry || null,
        });
        setShowStatusModal(true);
    }, []);

    // Transform student objects into table row format (memoized)
    const tableRows = useMemo(() => {
        return students.map((student) => {
            // Determine display status based on statusAccount
            let displayStatus;
            if (student.statusAccount === "approved") {
                displayStatus = "Approved";
            } else if (student.statusAccount === "blocked") {
                displayStatus = "Blocked";
            } else {
                displayStatus = "Pending";
            }

            return {
                id: student._id,
                firstName: student.first_name,
                lastName: student.last_name,
                middleName: student.middle_name || "",
                fullName: `${student.first_name} ${student.middle_name ? student.middle_name + " " : ""}${student.last_name}`.trim(),
                studentID: student.studentID,
                department: student.department || "N/A",
                emergencyContactName: student.emergency_contact_name || "N/A",
                emergencyContactNumber: student.emergency_contact_number || "N/A",
                status: displayStatus,
                rawStatus: student.statusAccount,
                gender: student.gender || "N/A",
                dob: student.dob || "N/A",
            };
        });
    }, [students]);

    // Function to update status (calls context function)
    const updateStatus = async (id, newStatus) => {
        const payload = {
            studentId: id,
            newStatus: newStatus.toLowerCase(),
        };

        const result = await UpdateStatusAccount(payload);

        if (result && result.success) {
            setIsModalOpen(false);
            showStatusMessage("success", null, {
                title: "Status Updated!",
                message: `"${payload.newStatus}" has been successfully changed.`,
            });
        } else {
            // Get the error message from result or use a default
            const errorMessage = result?.message || result?.error || "Failed to update status";

            setFormError(errorMessage);

            showStatusMessage("error", null, {
                title: "Update Failed",
                message: errorMessage,
            });
        }
    };

    // Handlers for filter changes
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleLimitChange = (e) => {
        setLimit(Number(e.target.value));
        setCurrentPage(1);
    };

    const glassClass = "bg-white/40 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl dark:bg-slate-900/60 dark:border-white/10";

    return (
        <div className="relative flex min-h-full flex-col gap-y-6 bg-transparent pb-10">
            {/* --- POPUP MODAL (Add / Edit) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div
                        className={cn(
                            glassClass,
                            "animate-in zoom-in relative max-h-[95vh] w-full max-w-2xl overflow-y-auto bg-white p-8 duration-200 dark:bg-slate-900",
                        )}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-[#0038A8] dark:text-yellow-400">
                                {editingUser ? "Update Account" : "Create New Account"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-full p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form
                            className="space-y-5"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            {/* Row 1: Name & Username */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="ml-1 text-[10px] font-black uppercase text-slate-400">Full Name</label>
                                    <input
                                        type="text"
                                        defaultValue={editingUser?.fullName}
                                        className="w-full rounded-xl border-none bg-slate-100 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                                        placeholder="Juan Dela Cruz"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="ml-1 text-[10px] font-black uppercase text-slate-400">Student ID</label>
                                    <div className="relative">
                                        <IdCard
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                            size={16}
                                        />
                                        <input
                                            type="text"
                                            defaultValue={editingUser?.studentID}
                                            className="w-full rounded-xl border-none bg-slate-100 py-3 pl-10 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                                            placeholder="2020-12345"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Department & Gender */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="ml-1 text-[10px] font-black uppercase text-slate-400">Department</label>
                                    <div className="relative">
                                        <MapPin
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                            size={16}
                                        />
                                        <input
                                            type="text"
                                            defaultValue={editingUser?.department}
                                            className="w-full rounded-xl border-none bg-slate-100 py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                                            placeholder="Criminal Justice"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="ml-1 text-[10px] font-black uppercase text-slate-400">Gender</label>
                                    <select
                                        defaultValue={editingUser?.gender?.toLowerCase()}
                                        className="w-full rounded-xl border-none bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 3: Emergency Contact */}
                            <div className="grid grid-cols-1 gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-white/5 dark:bg-white/5 md:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="ml-1 text-[10px] font-black uppercase text-blue-600 dark:text-yellow-500">
                                        Emergency Contact Name
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={editingUser?.emergencyContactName}
                                        className="w-full rounded-xl border-none bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900"
                                        placeholder="Nellisa Mae Vicedor"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="ml-1 text-[10px] font-black uppercase text-blue-600 dark:text-yellow-500">
                                        Emergency Contact Number
                                    </label>
                                    <div className="relative">
                                        <Phone
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                            size={16}
                                        />
                                        <input
                                            type="text"
                                            defaultValue={editingUser?.emergencyContactNumber}
                                            className="w-full rounded-xl border-none bg-white py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900"
                                            placeholder="09XXXXXXXXX"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="ml-1 text-[10px] font-black uppercase text-slate-400">Role</label>
                                <select className="rounded-xl border-none bg-slate-100 px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800">
                                    <option value="student">Student</option>
                                    <option value="admin">Admin</option>
                                    <option value="adviser">Adviser</option>
                                    <option value="panelist">Panelist</option>
                                    <option value="instructor">Instructor</option>
                                </select>
                            </div>

                            <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0038A8] py-4 text-xs font-black uppercase text-white shadow-xl transition-all hover:opacity-90 active:scale-95 dark:bg-yellow-500 dark:text-blue-950">
                                <Save size={18} /> {editingUser ? "Update Student Record" : "Register New Student"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- HEADER --- */}
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div className="flex items-center gap-x-4">
                    <div className="rounded-2xl bg-[#0038A8] p-4 text-white shadow-2xl dark:bg-yellow-500 dark:text-blue-950">
                        <UserCog size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-[#0038A8] dark:text-yellow-400">Student Management</h1>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            View and Manage Student Records
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setEditingUser(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-2xl bg-[#0038A8] px-6 py-4 text-xs font-black uppercase text-white shadow-lg transition-all hover:scale-105 dark:bg-yellow-500 dark:text-blue-950"
                >
                    <UserPlus size={18} /> New Student
                </button>
            </div>

            {/* --- FILTERS (Show & Search) --- */}
            <div className={cn(glassClass, "flex flex-wrap items-center justify-between gap-4 p-5")}>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-slate-400">Show</span>
                        <select
                            value={limit}
                            onChange={handleLimitChange}
                            className="rounded-xl bg-white/60 px-4 py-2 text-xs font-black outline-none dark:bg-slate-800"
                        >
                            <option value={5}>05</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
                <div className="relative w-full md:w-80">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search by name or student ID..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full rounded-2xl border border-white/10 bg-white/60 py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#0038A8] dark:bg-slate-800/60 dark:focus:ring-yellow-500"
                    />
                </div>
            </div>

            {/* --- TABLE --- */}
            <div className={cn(glassClass, "overflow-hidden")}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-white/20 bg-slate-50/50 dark:bg-white/5">
                            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-yellow-400">
                                <th className="p-5">Full Name</th>
                                <th className="p-5">Student ID</th>
                                <th className="p-5">Department</th>
                                <th className="p-5">Emergency Contact</th>
                                <th className="p-5 text-center">Status</th>
                                <th className="p-5 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {tableRows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="transition-all hover:bg-white/40 dark:hover:bg-white/5"
                                >
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-black text-white">
                                                {row.firstName.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black leading-tight dark:text-slate-100">{row.fullName}</span>
                                                <span className="text-[10px] font-bold uppercase tracking-tighter text-blue-500">
                                                    {row.gender} • {row.dob}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="font-mono text-sm font-bold">{row.studentID}</span>
                                    </td>
                                    <td className="p-5">
                                        <span className="text-sm">{row.department}</span>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{row.emergencyContactName}</span>
                                            <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                                                <Phone size={12} /> {row.emergencyContactNumber}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-center">
                                        <span
                                            className={cn(
                                                "inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase",
                                                row.status === "Approved"
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : row.status === "Blocked"
                                                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                                            )}
                                        >
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="p-5 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            {row.status === "Pending" && (
                                                <button
                                                    onClick={() => updateStatus(row.id, "Approved")}
                                                    className="rounded-xl bg-green-500/10 p-2 text-green-600 transition-all hover:bg-green-600 hover:text-white"
                                                    title="Approve"
                                                >
                                                    <span className="text-[10px] font-black uppercase">Approve</span>
                                                </button>
                                            )}
                                            {row.status !== "Blocked" && (
                                                <button
                                                    onClick={() => updateStatus(row.id, "Blocked")}
                                                    className="rounded-xl bg-red-500/10 p-2 text-red-600 transition-all hover:bg-red-600 hover:text-white"
                                                    title="Block"
                                                >
                                                    <span className="text-[10px] font-black uppercase">Block</span>
                                                </button>
                                            )}
                                            {row.status === "Blocked" && (
                                                <button
                                                    onClick={() => updateStatus(row.id, "approved")}
                                                    className="rounded-xl bg-blue-500/10 p-2 text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
                                                    title="Unblock"
                                                >
                                                    <span className="text-[10px] font-black uppercase">Unblock</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setEditingUser(row);
                                                    setIsModalOpen(true);
                                                }}
                                                className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
                                                title="Edit"
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

                {/* --- PAGINATION --- */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 p-6 md:flex-row">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                        Page {currentPage} of {totalPages || 1}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className="rounded-xl border border-white/20 bg-white/50 p-2 hover:bg-white disabled:opacity-20 dark:bg-slate-800"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={cn(
                                            "h-8 w-8 rounded-lg text-[10px] font-black",
                                            currentPage === pageNum ? "bg-[#0038A8] text-white shadow-lg" : "bg-white/20 text-slate-500",
                                        )}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            className="rounded-xl border border-white/20 bg-white/50 p-2 hover:bg-white disabled:opacity-20 dark:bg-slate-800"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
            <StatusModal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                status={statusModalProps.status}
                error={statusModalProps.error}
                title={statusModalProps.title}
                message={statusModalProps.message}
                onRetry={statusModalProps.onRetry}
            />
        </div>
    );
};

export default StudentTable;
