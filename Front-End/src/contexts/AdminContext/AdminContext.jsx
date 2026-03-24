import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../AuthContext";
import SuccessFailed from "../../ReusableFolder/SuccessandField";
import axiosInstance from "../../ReusableFolder/axioxInstance";

export const AdminDisplayContext = createContext();

export const AdminDisplayProvider = ({ children }) => {
    const { authToken, linkId } = useContext(AuthContext);

    // States para sa table at pagination
    const [admins, setAdmins] = useState([]);
    const [adminProfile, setAdminProfile] = useState(null); // profile ng isang admin
    const [totalAdminCount, setTotalAdminCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [faculty, setFaculty] = useState([]);

    // UI states
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalStatus, setModalStatus] = useState("success");
    const [customError, setCustomError] = useState("");

    // Fetch admin list para sa table
    const fetchFaculty = useCallback(async () => {
        if (!authToken) return;
        try {
            setLoading(true);

            const res = await axiosInstance.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Admin/DisplayDropdownAdviserPanelist`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Cache-Control": "no-cache",
                },
            });

            setFaculty(res.data.data);
        } catch (error) {
            console.error("Failed to load adviser/panelist", error);
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    // Fetch admin list para sa table
    const FetchAdminData = useCallback(async () => {
        if (!authToken) return;

        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: limit,
                search: searchTerm,
                role: roleFilter || undefined,
            };

            const res = await axiosInstance.get(`/api/v1/Admin`, {
                params,
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Cache-Control": "no-cache",
                },
            });

            const adminData = res.data.data;
            setAdmins(adminData);
            setTotalAdminCount(res.data.totalCount || 0);
            setTotalPages(res.data.totalPages || 1);
            if (res.data.currentPage) setCurrentPage(res.data.currentPage);
        } catch (error) {
            console.error("Error fetching admins:", error);
            setCustomError("Failed to load admins.");
        } finally {
            setLoading(false);
        }
    }, [authToken, currentPage, limit, searchTerm, roleFilter]);

    // Fetch profile ng isang admin (kung kailangan)
    const FetchProfileData = useCallback(async () => {
        if (!authToken || !linkId) return;
        try {
            const response = await axiosInstance.get(`/api/v1/Admin/profile/${linkId}`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${authToken}` },
            });

            if (response.data?.status === "success") {
                setAdminProfile(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }, [authToken, linkId]);

    // Delete admin
    const DeleteAdmin = useCallback(
        async (adminId) => {
            try {
                const response = await axiosInstance.delete(`/api/v1/Admin/${adminId}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                if (response.data.status === "success") {
                    setAdmins((prev) => prev.filter((admin) => admin._id !== adminId));
                    setModalStatus("success");
                    setShowModal(true);
                } else {
                    setModalStatus("failed");
                    setShowModal(true);
                    return { success: false, error: "Unexpected response." };
                }
            } catch (error) {
                console.error("Error deleting admin:", error);
                setCustomError(error.response?.data?.message || "Failed to delete admin.");
                setModalStatus("failed");
                setShowModal(true);
            }
        },
        [authToken],
    );

    // Update admin
    const UpdateAdmin = useCallback(
        async (adminId, values) => {
            try {
                const formData = new FormData();
                formData.append("first_name", values.first_name || "");
                formData.append("last_name", values.last_name || "");
                formData.append("middle_name", values.middle_name || "");
                formData.append("email", values.email || "");
                formData.append("role", "admin");
                if (values.avatar) formData.append("avatar", values.avatar);

                const response = await axiosInstance.patch(`/api/v1/Admin/${adminId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response.data?.status === "success") {
                    await FetchAdminData(); // refresh list
                    setModalStatus("success");
                    setShowModal(true);
                    return { success: true, data: response.data.data };
                } else {
                    setModalStatus("failed");
                    setShowModal(true);
                    return { success: false, error: "Unexpected response." };
                }
            } catch (error) {
                const message = error.response?.data?.message || error.response?.data?.error || error.message || "Something went wrong.";
                setCustomError(message);
                setModalStatus("failed");
                setShowModal(true);
                return { success: false, error: message };
            }
        },
        [authToken, FetchAdminData],
    );

    const AddAdmin = useCallback(
        async (values) => {
            console.log("values", values);
            try {
                const formData = new FormData();
                formData.append("first_name", values.first_name || "");
                formData.append("last_name", values.last_name || "");
                formData.append("email", values.email || "");
                formData.append("gender", values.gender || "");
                formData.append("role", values.role || "admin");
                formData.append("password", values.password || "");
                formData.append("address", values.address || "");
                formData.append("department", values.department || "");
                formData.append("dob", values.dob || "");
                formData.append("emergency_contact_name", values.emergency_contact_name || "");
                formData.append("id_number", values.id_number || "");

                if (values.middle_name) {
                    formData.append("middle_name", values.middle_name);
                }

                if (values.specialty) {
                    formData.append("specialty", values.specialty);
                }
                if (values.contact_number) {
                    formData.append("contact_number", values.contact_number);
                }

                if (values.emergency_contact_number) {
                    formData.append("emergency_contact_number", values.emergency_contact_number || "");
                }

                if (values.avatar) formData.append("avatar", values.avatar);

                const res = await axiosInstance.post(`/api/v1/authentication/signup`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (res.data?.status?.toLowerCase() === "success") {
                    FetchAdminData();
                    setModalStatus("success");
                    setShowModal(true);

                    return { success: true, data: res.data.data };
                } else {
                    setModalStatus("failed");
                    setShowModal(true);
                    return { success: false, error: res.data?.message || "Unexpected response from server." };
                }
            } catch (error) {
                const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong.";
                setCustomError(message);
                setModalStatus("failed");
                setShowModal(true);

                return { success: false, error: message };
            }
        },
        [authToken, FetchAdminData],
    );
    const UpdateStatusAccount = useCallback(
        async ({ newStatus, studentId }) => {
            try {
                const res = await axiosInstance.patch(
                    `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Admin/AdminStatusAccount/${studentId}`,
                    { statusAccount: newStatus },
                    {
                        headers: { Authorization: `Bearer ${authToken}` },
                        withCredentials: true,
                    },
                );
                const status = res.data?.status || res.data?.data?.status;

                if (status === true) {
                    return { success: true };
                }

                setCustomError("Failed to update account status.");
                setModalStatus("failed");
                setShowModal(true);
                return { success: false };
            } catch (error) {
                console.error("Update failed:", error.response?.data || error);
                setCustomError(error.response?.data?.message || "Failed to update account status.");
                setModalStatus("failed");
                setShowModal(true);
                return { success: false };
            }
        },
        [authToken],
    );

    // Handler para sa search (nagre-reset ng page)
    const handleSearch = useCallback((query) => {
        setSearchTerm(query);
        setCurrentPage(1);
    }, []);

    // Handler para palitan ang page
    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    // Handler para sa role filter
    const handleRoleFilter = useCallback((role) => {
        setRoleFilter(role);
        setCurrentPage(1);
    }, []);

    // Auto-fetch kapag nagbago ang authToken o ang mga filter/pagination
    useEffect(() => {
        if (!authToken) return;
        fetchFaculty();
        FetchAdminData();
    }, [authToken, currentPage, limit, searchTerm, roleFilter, FetchAdminData, fetchFaculty]);

    // Close modal
    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setCustomError("");
    }, []);

    return (
        <AdminDisplayContext.Provider
            value={{
                admins,
                totalAdminCount,
                totalPages,
                currentPage,
                limit,
                searchTerm,
                roleFilter,
                setAdmins,
                loading,
                adminProfile,
                FetchAdminData,
                FetchProfileData,
                DeleteAdmin,
                UpdateAdmin,
                AddAdmin,
                handleSearch,
                handlePageChange,
                handleRoleFilter,
                setLimit,
                setCurrentPage,
                setSearchTerm,
                setRoleFilter,
                UpdateStatusAccount,
                faculty,
            }}
        >
            {children}
            <SuccessFailed
                isOpen={showModal}
                onClose={handleCloseModal}
                status={modalStatus}
                errorMessage={customError}
            />
        </AdminDisplayContext.Provider>
    );
};
