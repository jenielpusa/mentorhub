import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../AuthContext";
import SuccessFailed from "../../ReusableFolder/SuccessandField";
import axiosInstance from "../../ReusableFolder/axioxInstance";

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
    const { authToken } = useContext(AuthContext);

    // Data States
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalStudents, setTotalStudents] = useState(0);

    // Modal & Error States
    const [showModal, setShowModal] = useState(false);
    const [modalStatus, setModalStatus] = useState("success");
    const [customError, setCustomError] = useState("");

    // Pagination & Filter States
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    const FetchStudents = useCallback(async () => {
        if (!authToken) return;

        setLoading(true);

        try {
            const params = {
                page: currentPage,
                limit: limit,
                search: searchTerm,
            };

            const res = await axiosInstance.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Student`, {
                params,
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Cache-Control": "no-cache",
                },
            });

            const studentData = res.data.data;

            setStudents(studentData);
            setTotalStudents(res.data.totalCount);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    }, [authToken, currentPage, limit, searchTerm]); // tanggalin na roleFilter

    // 2. DELETE STUDENT & LINKED LOGIN
    const DeleteStudent = useCallback(
        async (studentID) => {
            try {
                const res = await axiosInstance.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Student/${studentID}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                if (res.data?.status === "success") {
                    // Agad na i-update ang UI
                    setStudents((prev) => prev.filter((std) => std._id !== studentID));
                    setTotalStudents((prev) => prev - 1);
                    setModalStatus("success");
                    setShowModal(true);
                    return { success: true };
                }
            } catch (error) {
                setCustomError(error.response?.data?.message || "Failed to delete student record.");
                setModalStatus("failed");
                setShowModal(true);
                return { success: false };
            }
        },
        [authToken],
    );

    // 3. UPDATE STUDENT (with FormData)
    const UpdateStudent = useCallback(
        async (studentID, values) => {
            try {
                const formData = new FormData();
                Object.keys(values).forEach((key) => {
                    if (values[key] !== null && values[key] !== undefined) {
                        formData.append(key, values[key]);
                    }
                });

                const res = await axiosInstance.patch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Student/${studentID}`, formData, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (res.data?.status === "success") {
                    // I-refresh ang listahan para makita ang updated na datos
                    await FetchStudents();
                    setModalStatus("success");
                    setShowModal(true);
                    return { success: true };
                }
            } catch (error) {
                setCustomError(error.response?.data?.message || "Update failed.");
                setModalStatus("failed");
                setShowModal(true);
                return { success: false };
            }
        },
        [authToken, FetchStudents],
    );

    const UpdateStatusAccount = useCallback(
        async ({ newStatus, studentId }) => {
            try {
                const res = await axiosInstance.patch(
                    `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Student/UpdateStudentStatusAccount/${studentId}`,
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
                return { success: false };
            } catch (error) {
                console.error("Update failed:", error.response?.data || error);
                setCustomError(error.response?.data?.message || "Failed to update account status.");

                return { success: false };
            }
        },
        [authToken],
    );

    // Initial load
    useEffect(() => {
        FetchStudents();
    }, [FetchStudents]);

    const handleCloseModal = () => {
        setShowModal(false);
        setCustomError("");
    };

    return (
        <StudentContext.Provider
            value={{
                students,
                setStudents,
                loading,
                totalStudents,
                FetchStudents,
                DeleteStudent,
                UpdateStudent,
                UpdateStatusAccount,
                // Pagination & filter states (opsyonal, kung kailangan sa UI)
                currentPage,
                totalPages,
                limit,
                searchTerm,
                roleFilter,
                setCurrentPage,
                setLimit,
                setSearchTerm,
                setRoleFilter,
            }}
        >
            {children}
            <SuccessFailed
                isOpen={showModal}
                onClose={handleCloseModal}
                status={modalStatus}
                errorMessage={customError}
            />
        </StudentContext.Provider>
    );
};
