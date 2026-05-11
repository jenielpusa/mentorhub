import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../AuthContext";
import SuccessFailed from "../../ReusableFolder/SuccessandField";
import axiosInstance from "../../ReusableFolder/axioxInstance";

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
    const { authToken, role, userId } = useContext(AuthContext);
    const [myStudent, setMyStudent] = useState(null);
    const [myStudentLoading, setMyStudentLoading] = useState(false);

    // MyGroup States
    const [myGroup, setMyGroup] = useState(null);
    const [myGroupLoading, setMyGroupLoading] = useState(false);

    // MyGroupThesis States
    const [myGroupThesis, setMyGroupThesis] = useState(null);
    const [myGroupThesisLoading, setMyGroupThesisLoading] = useState(false);
    const [groupThesisError, setGroupThesisError] = useState("");

    // Data States
    const [students, setStudents] = useState([]);
    const [Studentlead, setStudentlead] = useState(null);
    const [selectedLead, setSelectedLead] = useState(null);
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
    }, [authToken, currentPage, limit, searchTerm]);

    const DeleteStudent = useCallback(
        async (studentID) => {
            try {
                const res = await axiosInstance.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Student/${studentID}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                if (res.data?.status === "success") {
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

    const GetMyStudent = useCallback(async () => {
        if (!authToken) return null;
        setMyStudentLoading(true);
        try {
            const res = await axiosInstance.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Student/GetMyStudent`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${authToken}` },
            });
            if (res.data?.status === "success") {
                setMyStudent(res.data.data);
                return { success: true, data: res.data.data };
            } else {
                setMyStudent(null);
                return { success: false, error: "No student data found" };
            }
        } catch (error) {
            console.error("Error fetching my student:", error);
            setMyStudent(null);
            return { success: false, error: error.response?.data?.error };
        } finally {
            setMyStudentLoading(false);
        }
    }, [authToken]);

    // GetMyGroup Function
    const GetMyGroup = useCallback(async () => {
        if (!authToken) return null;
        setMyGroupLoading(true);
        try {
            const res = await axiosInstance.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Student/getMyGroup`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${authToken}` },
            });
            if (res.data?.success) {
                setMyGroup(res.data.data);
                return { success: true, data: res.data.data };
            }
            return { success: false };
        } catch (error) {
            console.error("Error fetching group details:", error);
            return { success: false, error: error.response?.data?.message };
        } finally {
            setMyGroupLoading(false);
        }
    }, [authToken]);

    // GetMyGroupThesis Function - FIXED VERSION
    const GetMyGroupThesis = useCallback(async () => {
        if (!authToken) {
            console.warn("No auth token available");
            return null;
        }

        setMyGroupThesisLoading(true);
        setGroupThesisError("");

        try {
            const response = await axiosInstance.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Student/getMyGroupThesis`, { userId }, {
                withCredentials: true,

                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Cache-Control": "no-cache"
                }
            });

            console.log("GetMyGroupThesis Response:", response.data);

            if (response.data?.success) {
                setMyGroupThesis(response.data.data);
                return { success: true, data: response.data.data };
            }

            setMyGroupThesis(null);
            return { success: false, error: response.data?.message || "No thesis data found" };
        } catch (err) {
            console.error("GetMyGroupThesis Error:", err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to fetch group thesis";
            setGroupThesisError(errorMessage);
            setMyGroupThesis(null);
            return { success: false, error: errorMessage };
        } finally {
            setMyGroupThesisLoading(false);
        }
    }, [authToken]);

    const GetStudentLead = useCallback(async () => {
        if (!authToken) return null;
        setMyStudentLoading(true);
        try {
            const res = await axiosInstance.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Student/GetStudentLead`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${authToken}` },
            });
            if (res.data?.status === "success") {
                setStudentlead(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching student lead:", error);
        } finally {
            setMyStudentLoading(false);
        }
    }, [authToken]);

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
                if (res.data?.status === true || res.data?.data?.status === true) {
                    return { success: true };
                }
                return { success: false };
            } catch (error) {
                console.error("Update failed:", error.response?.data || error);
                return { success: false };
            }
        },
        [authToken],
    );

    const SelectLead = useCallback(async (studentId, leadStudentId) => {
        if (!authToken) return { success: false, error: "No auth token" };
        try {
            const res = await axiosInstance.patch(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Student/SelectLead/${studentId}`,
                { studentlead: leadStudentId },
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                    withCredentials: true,
                }
            );
            if (res.data?.status === "success") {
                setSelectedLead(res.data.data);
                await GetMyStudent();
                await GetStudentLead();
                await GetMyGroup(); // Refresh group info when lead changes
                await GetMyGroupThesis(); // Also refresh thesis info
                return { success: true, data: res.data.data };
            }
            return { success: false, error: "Failed to select lead" };
        } catch (error) {
            console.error("SelectLead error:", error);
            return { success: false, error: error.response?.data?.error };
        }
    }, [authToken, GetMyStudent, GetStudentLead, GetMyGroup, GetMyGroupThesis]);

    useEffect(() => {
        if (authToken && (role === "adviser" || role === "student" || role === "member")) {
            GetMyStudent();
            GetStudentLead();
            GetMyGroup();
            GetMyGroupThesis();
        }
    }, [authToken, role, GetMyStudent, GetStudentLead, GetMyGroup, GetMyGroupThesis]);

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
                myStudent,
                myStudentLoading,
                myGroup,
                myGroupLoading,
                GetMyGroup,
                myGroupThesis,        // Exposed
                myGroupThesisLoading, // Exposed
                groupThesisError,     // Exposed
                GetMyGroupThesis,     // Exposed
                Studentlead,
                selectedLead,
                SelectLead,
                FetchStudents,
                DeleteStudent,
                UpdateStudent,
                UpdateStatusAccount,
                GetMyStudent,
                GetStudentLead,
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