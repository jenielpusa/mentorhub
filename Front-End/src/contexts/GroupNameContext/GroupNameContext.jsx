import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../../ReusableFolder/axioxInstance";
import { AuthContext } from "../AuthContext";
import SuccessFailed from "../../ReusableFolder/SuccessandField";

export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
    const { authToken } = useContext(AuthContext);

    const [groups, setGroups] = useState([]);
    const [singleGroup, setSingleGroup] = useState([]); // Renamed for clarity
    const [groupDetail, setGroupDetail] = useState([]);
    const [totalGroups, setTotalGroups] = useState(0);

    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [modalStatus, setModalStatus] = useState("success");
    const [customError, setCustomError] = useState("");

    const [search, setSearch] = useState("");

    const limit = 5;

    // ==============================
    // GET ALL GROUPS
    // ==============================
    const FetchGroups = async () => {
        if (!authToken) return;

        try {
            setIsLoading(true);

            const res = await axiosInstance.get(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Groupname`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Cache-Control": "no-cache",
                    },
                }
            );

            const { data, results } = res.data;

            setGroups(data || []);
            setTotalGroups(results || 0);

        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ==============================
    // GET SINGLE GROUP (by specific criteria)
    // ==============================
    const FetchSingleGroup = async () => {
        if (!authToken) return;

        try {
            setIsLoading(true);

            const res = await axiosInstance.get(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Groupname/Singlegroup`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Cache-Control": "no-cache",
                    },
                }
            );

            const { data } = res.data;

            setSingleGroup(data || []);

        } catch (error) {
            console.error("Error fetching single group:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ==============================
    // GET GROUP BY ID
    // ==============================
    const FetchGroupById = async (id) => {
        if (!authToken) return;

        try {
            setLoading(true);

            const res = await axiosInstance.get(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Groupname/${id}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            setGroupDetail(res.data.data || []);

        } catch (error) {
            console.error("Error fetching group:", error);
        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // CREATE GROUP
    // ==============================
    const AddGroup = async (groupname) => {
        try {
            const res = await axiosInstance.post(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Groupname`,
                { groupname },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            if (res.data?.status === "success") {
                return { success: true };
            }

            setCustomError("Failed to create group.");
            setModalStatus("failed");
            setShowModal(true);

            return { success: false };

        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Unexpected error occurred.";

            setCustomError(message);
            setModalStatus("failed");
            setShowModal(true);

            return { success: false, error: message };
        }
    };

    // ==============================
    // UPDATE GROUP
    // ==============================
    const UpdateGroup = async (id, data) => {
        try {
            const res = await axiosInstance.put(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Groupname/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            if (res.data?.status === "success") {
                FetchGroups();
                return { success: true };
            }

            return { success: false };

        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Unexpected error occurred.";

            setCustomError(message);
            setModalStatus("failed");
            setShowModal(true);

            return { success: false, error: message };
        }
    };

    // ==============================
    // DELETE GROUP
    // ==============================
    const DeleteGroup = async (id) => {
        try {
            const res = await axiosInstance.delete(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Groupname/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            if (res.data?.status === "success") {
                FetchGroups();
                return { success: true };
            }

            return { success: false };

        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Unexpected error occurred.";

            setCustomError(message);
            setModalStatus("failed");
            setShowModal(true);

            return { success: false, error: message };
        }
    };

    // ==============================
    // INIT LOAD
    // ==============================
    useEffect(() => {
        if (!authToken) return;
        FetchGroups();
        FetchSingleGroup();
    }, [authToken]);

    return (
        <GroupContext.Provider
            value={{
                groups,
                singleGroup, // Added singleGroup to context
                groupDetail,
                totalGroups,
                loading,
                isLoading,
                search,
                setSearch, setGroups,

                FetchGroups,
                FetchSingleGroup, // Added FetchSingleGroup to context
                FetchGroupById,
                AddGroup,
                UpdateGroup,
                DeleteGroup,setSingleGroup
            }}
        >
            {children}

            <SuccessFailed
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                status={modalStatus}
                errorMessage={customError}
            />
        </GroupContext.Provider>
    );
};