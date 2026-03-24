import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import SuccessFailed from "../../ReusableFolder/SuccessandField";
import axiosInstance from "../../ReusableFolder/axioxInstance";

export const DocumenContext = createContext();

export const DocumenProvider = ({ children }) => {
    const { authToken } = useContext(AuthContext);
    const [isDropdownProposal, setDropdownProposal] = useState("");
    const [customError, setCustomError] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalStatus, setModalStatus] = useState("success");
    const [isProposal, setProposal] = useState([]);
    const [isProposalProfile, setProposalData] = useState([]);
    const [isTotalProposal, setTotalProposal] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [ProposalStatusCount, setProposalStatusCount] = useState([]);

    const limit = 5;
    const FetchProposalDisplay = async (page = 1, limit, searchTerm = "", fromDate = "", toDate = "") => {
        if (!authToken) return;

        try {
            setIsLoading(true);

            const params = {
                page,
                limit,
            };

            if (searchTerm && searchTerm.trim() !== "") {
                params.search = searchTerm.trim();
            }

            if (fromDate && fromDate.trim() !== "") {
                params.dateFrom = fromDate.trim();
            }

            if (toDate && toDate.trim() !== "") {
                params.dateTo = toDate.trim();
            }

            const res = await axiosInstance.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Document`, {
                params,
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Cache-Control": "no-cache",
                },
            });

            const { data, totalPages, currentPage, totalCount, statusCounts } = res.data;
            setProposalStatusCount(statusCounts);
            setProposal(data || []);
            setTotalProposal(totalCount || 0);
            setTotalPages(totalPages || 1);
            setCurrentPage(currentPage || page);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authToken) return;
        FetchProposalDisplay(1, search, dateFrom, dateTo);
    }, [authToken, search, dateFrom, dateTo]);

    const AddDocument = async (formData) => {
        console.log("formData", formData);
        try {
            const res = await axiosInstance.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Document`, formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            const status = res.data?.status || res.data?.data?.status;

            if (status === true) {
                return { success: true };
            }

            setCustomError("Failed to upload Documents.");
            setModalStatus("failed");
            setShowModal(true);
            return { success: false };
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                const message = typeof errorData === "string" ? errorData : errorData.message || errorData.error || "Something went wrong.";
                setCustomError(message);
                setModalStatus("failed");
                setShowModal(true);
                return { success: false, error: message };
            } else if (error.request) {
                setCustomError("No response from the server.");
                setModalStatus("failed");
                setShowModal(true);
                return { success: false, error: "No response from the server." };
            } else {
                setCustomError(error.message || "Unexpected error occurred.");
                return {
                    success: false,
                    error: error.message || "Unexpected error",
                };
            }
        }
    };

    return (
        <DocumenContext.Provider
            value={{
                isProposal,
                isTotalProposal,
                isProposalProfile,
                customError,
                isLoading,
                setIsLoading,
                totalPages,
                currentPage,
                setCurrentPage,
                FetchProposalDisplay,
                limit,
                AddDocument,
                search,
                setSearch,
                dateFrom,
                setDateFrom,
                dateTo,
                setDateTo,
            }}
        >
            {children}
            <SuccessFailed
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                status={modalStatus}
                errorMessage={customError}
            />
        </DocumenContext.Provider>
    );
};
