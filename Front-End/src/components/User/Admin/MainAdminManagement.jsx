import { useState, useContext, useCallback, useMemo } from "react";
import { UserPlus, UserCog, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Footer } from "@/layouts/footer";
import { AdminDisplayContext } from "../../../contexts/AdminContext/AdminContext";
import StatusModal from "../../../ReusableFolder/SuccessandField";
import AddForm from "./AddForm";
import TableForm from "./TableForm";

const MainAdminManagement = () => {
    const { 
        admins, 
        UpdateStatusAccount, 
        currentPage, 
        totalPages, 
        limit, 
        searchTerm, 
        setCurrentPage, 
        setLimit, 
        setSearchTerm 
    } = useContext(AdminDisplayContext);

    // Local UI states
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
    const [formError, setFormError] = useState(null);
    const [roleFilter, setRoleFilter] = useState("all");

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

    // Transform admin objects into table row format
    const tableRows = useMemo(() => {
        if (!admins) return [];
        return admins.map((admin) => {
            let displayStatus;
            if (admin.statusAccount === "approved") displayStatus = "Approved";
            else if (admin.statusAccount === "blocked") displayStatus = "Blocked";
            else displayStatus = "Pending";

            return {
                id: admin._id,
                firstName: admin.first_name || "",
                lastName: admin.last_name || "",
                middleName: admin.middle_name || "",
                fullName: `${admin.first_name} ${admin.middle_name ? admin.middle_name + " " : ""}${admin.last_name}`.trim(),
                idNumber: admin.id_number || "N/A",
                department: admin.department || "N/A",
                contactNumber: admin.contact_number || "N/A",
                email: admin.email || "N/A",
                status: displayStatus,
                rawStatus: admin.statusAccount,
                role: admin.role || "N/A",
                specialty: admin.specialty || "",
                gender: admin.gender || "male",
                dob: admin.dob || "",
                emergencyContactName: admin.emergency_contact_name || "N/A",
                emergencyContactNumber: admin.emergency_contact_number || "N/A",
            };
        });
    }, [admins]);

    const filteredRows = useMemo(() => {
        if (roleFilter === "all") return tableRows;
        return tableRows.filter((row) => row.role.toLowerCase() === roleFilter.toLowerCase());
    }, [tableRows, roleFilter]);

    const updateStatus = async (id, newStatus) => {
        const payload = { studentId: id, newStatus: newStatus.toLowerCase() };
        const result = await UpdateStatusAccount(payload);
        if (result && result.success) {
            showStatusMessage("success", null, {
                title: "Status Updated!",
                message: `Account has been successfully set to ${payload.newStatus}.`,
            });
        } else {
            const errorMessage = result?.message || result?.error || "Failed to update status";
            setFormError(errorMessage);
            showStatusMessage("error", null, {
                title: "Update Failed",
                message: errorMessage,
            });
        }
    };

    const handleSave = (formData) => {
        // Dito mo ilalagay ang actual API call para mag-save ng admin (add/edit)
        console.log("Save:", formData);
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const glassClass = "bg-white/40 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl dark:bg-slate-900/60 dark:border-white/10";

    return (
        <div className="relative flex min-h-full flex-col gap-y-6 bg-transparent pb-10">
            {/* Add/Edit Modal */}
            <AddForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingUser={editingUser}
                onSave={handleSave}
                formError={formError}
                glassClass={glassClass}
            />

            {/* Header */}
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div className="flex items-center gap-x-4">
                    <div className="rounded-2xl bg-[#0038A8] p-4 text-white shadow-2xl dark:bg-yellow-500 dark:text-blue-950">
                        <UserCog size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-[#0038A8] dark:text-yellow-400">
                            Account Management
                        </h1>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            View and Manage Admin Records
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 rounded-2xl bg-[#0038A8] px-6 py-4 text-xs font-black uppercase text-white shadow-lg transition-all hover:scale-105 dark:bg-yellow-500 dark:text-blue-950"
                >
                    <UserPlus size={18} /> New Account
                </button>
            </div>

            {/* Table Component */}
            <TableForm
                filteredRows={filteredRows}
                roleFilter={roleFilter}
                onRoleFilterChange={(e) => setRoleFilter(e.target.value)}
                searchTerm={searchTerm}
                onSearchChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                }}
                limit={limit}
                onLimitChange={(e) => {
                    setLimit(Number(e.target.value));
                    setCurrentPage(1);
                }}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(direction) => {
                    if (direction === 'prev') setCurrentPage(prev => Math.max(prev - 1, 1));
                    else setCurrentPage(prev => Math.min(prev + 1, totalPages));
                }}
                onUpdateStatus={updateStatus}
                onEdit={(user) => { setEditingUser(user); setIsModalOpen(true); }}
                glassClass={glassClass}
            />

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

export default MainAdminManagement;