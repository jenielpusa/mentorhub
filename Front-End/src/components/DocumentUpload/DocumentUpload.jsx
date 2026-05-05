import { useState, useRef, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { Send, FileText, Lightbulb, ClipboardCheck, AlertCircle, List, ChevronDown, Eye, X, Download, User, Calendar, FileSearch, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { AdminDisplayContext } from "../../contexts/AdminContext/AdminContext";
import { DocumenContext } from "../../contexts/DocumentContext/DocumentContext";
import StatusModal from "../../ReusableFolder/SuccessandField";

const TitleProposal = () => {
    const { AddDocument, documents, isProposal, FetchProposalDisplay, proposal, totalProposal, totalPages, currentPage: contextCurrentPage, isLoading: contextIsLoading } = useContext(DocumenContext);
    const { faculty, fetchFaculty } = useContext(AdminDisplayContext);

    // UI States
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [statusModalProps, setStatusModalProps] = useState({
        status: "success",
        error: null,
        title: "",
        message: "",
        onRetry: null,
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [adviserId, setAdviserId] = useState("");
    const [coAdviserId, setCoAdviserId] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    
    // Pagination states
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [showDateFilter, setShowDateFilter] = useState(false);

    const [adviserSearch, setAdviserSearch] = useState("");
    const [coAdviserSearch, setCoAdviserSearch] = useState("");
    const [showAdviserDropdown, setShowAdviserDropdown] = useState(false);
    const [showCoAdviserDropdown, setShowCoAdviserDropdown] = useState(false);

    const adviserRef = useRef(null);
    const coAdviserRef = useRef(null);
    const searchTimeoutRef = useRef(null);

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

    // Get proposals to display
    const proposalsToDisplay = proposal && proposal.length > 0 ? proposal : (isProposal && Array.isArray(isProposal) && isProposal.length > 0 ? isProposal : (documents && Array.isArray(documents) ? documents : []));

    // Fetch proposals
    useEffect(() => {
        if (showTable) {
            fetchProposals();
        }
    }, [showTable, currentPage, limit, searchTerm, fromDate, toDate]);

    const fetchProposals = async () => {
        if (FetchProposalDisplay) {
            await FetchProposalDisplay(currentPage, limit, searchTerm, fromDate, toDate);
        }
    };

    // Handle search with debounce
    const handleServerSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleSearchInput = (e) => {
        const value = e.target.value;
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            handleServerSearchChange(value);
        }, 500);
    };

    // Handle limit change
    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setCurrentPage(1);
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Apply date filter
    const applyDateFilter = () => {
        setCurrentPage(1);
        fetchProposals();
    };

    const clearDateFilter = () => {
        setFromDate("");
        setToDate("");
        setCurrentPage(1);
    };

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (adviserRef.current && !adviserRef.current.contains(event.target)) setShowAdviserDropdown(false);
            if (coAdviserRef.current && !coAdviserRef.current.contains(event.target)) setShowCoAdviserDropdown(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleTriggerFetch = async (type) => {
        if (type === "adviser") setShowAdviserDropdown(true);
        if (type === "coAdviser") setShowCoAdviserDropdown(true);
        if (!faculty || faculty.length === 0) {
            setIsFetching(true);
            try { await fetchFaculty(); } catch (err) { console.error(err); } finally { setIsFetching(false); }
        }
    };

    const getFullName = (f) => {
        const middle = f.middle_name ? `${f.middle_name.charAt(0)}.` : "";
        return `${f.first_name} ${middle} ${f.last_name}`.toUpperCase();
    };

    const filteredAdvisers = (faculty || []).filter((f) =>
        `${f.first_name} ${f.last_name}`.toLowerCase().includes(adviserSearch.toLowerCase())
    );

    const filteredCoAdvisers = (faculty || []).filter((f) =>
        `${f.first_name} ${f.last_name}`.toLowerCase().includes(coAdviserSearch.toLowerCase())
    );

    // Get status badge color
    const getStatusBadge = (status) => {
        const statusColors = {
            pending: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" },
            approved: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
            rejected: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
            reviewed: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
            submitted: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" }
        };
        return statusColors[status?.toLowerCase()] || { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch {
            return "Invalid Date";
        }
    };

    // Handle view proposal details
    const handleViewDetails = (proposal) => {
        setSelectedProposal(proposal);
        setShowDetailModal(true);
    };

    const toggleTable = () => {
        setShowTable(!showTable);
        if (!showTable) {
            setCurrentPage(1);
            fetchProposals();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) return alert("Title and Description required");

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("adviserId", adviserId);
            formData.append("coAdviserId", coAdviserId);
            if (selectedFile) formData.append("file", selectedFile);

            const result = await AddDocument(formData);
            if (result?.success) {
                showStatusMessage("success", null, { title: "Upload Success", message: "Proposal uploaded successfully." });
                setTitle(""); 
                setDescription(""); 
                setSelectedFile(null); 
                setAdviserSearch(""); 
                setCoAdviserSearch(""); 
                setAdviserId(""); 
                setCoAdviserId("");
                if (showTable) {
                    fetchProposals();
                }
            } else {
                showStatusMessage("error", null, { title: "Update Failed", message: result?.message || "Failed to upload" });
            }
        } catch (error) {
            showStatusMessage("error", null, { title: "Error", message: "Submission failed" });
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#0038A8] focus:bg-white transition-all outline-none text-sm";

    return (
        <div className="mx-auto min-h-screen max-w-6xl p-4 md:p-8">
            {/* Header Section */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#0038A8] p-3 text-white shadow-md">
                        <Lightbulb size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight text-[#0038A8]">Title Proposal</h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Research Submission Portal</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {/* VIEW TITLE BUTTON */}
                    <button
                        onClick={toggleTable}
                        className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#0038A8] px-4 py-2 text-sm font-bold text-[#0038A8] transition-all hover:bg-[#0038A8] hover:text-white"
                    >
                        <Eye size={18} /> {showTable ? "Hide Submitted Titles" : "View Submitted Titles"} ({totalProposal})
                    </button>
                </div>
            </div>

            {/* Conditional rendering: Hide upload form when table is shown */}
            {!showTable ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* File Upload Left */}
                    <div className="lg:col-span-3">
                        <div className={cn("relative flex h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 text-center transition-all", selectedFile ? "border-emerald-500 bg-emerald-50/30" : "border-slate-300 bg-slate-50/50")}>
                            {!selectedFile ? (
                                <>
                                    <FileText className="mb-2 text-slate-400" size={32} />
                                    <span className="text-xs font-medium text-slate-500">Drop PDF here</span>
                                    <input type="file" accept=".pdf" className="absolute inset-0 cursor-pointer opacity-0" onChange={(e) => setSelectedFile(e.target.files[0])} />
                                </>
                            ) : (
                                <div className="text-center">
                                    <ClipboardCheck className="mx-auto mb-2 text-emerald-500" size={40} />
                                    <p className="truncate font-mono text-[10px] w-full px-2">{selectedFile.name}</p>
                                    <button onClick={() => setSelectedFile(null)} className="mt-2 text-[10px] font-bold uppercase text-red-500 underline">Remove</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Right */}
                    <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-xl backdrop-blur-md md:p-8 lg:col-span-9">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Research Title</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title..." className={inputClass} />
                            </div>
                            <div>
                                <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Description</label>
                                <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this research about?" className={cn(inputClass, "resize-none")} />
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="relative" ref={adviserRef}>
                                    <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Adviser</label>
                                    <div className="relative">
                                        <input type="text" value={adviserSearch} onFocus={() => handleTriggerFetch("adviser")} onChange={(e) => { setAdviserSearch(e.target.value); setAdviserId(""); }} placeholder="Select Adviser" className={inputClass} />
                                        <ChevronDown size={16} className="absolute right-3 top-3.5 text-slate-400" />
                                    </div>
                                    {showAdviserDropdown && (
                                        <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                                            {isFetching ? <div className="p-4 text-center text-xs italic text-slate-400">Fetching...</div> : filteredAdvisers.map(f => (
                                                <div key={f._id} onClick={() => { setAdviserSearch(getFullName(f)); setAdviserId(f._id); setShowAdviserDropdown(false); }} className="cursor-pointer border-b border-slate-50 p-3 text-sm hover:bg-slate-50">
                                                    <div className="font-bold">{getFullName(f)}</div>
                                                    <div className="text-[10px] text-slate-400">{f.department}</div>
                                                </div>
                                            ))}
                                            {filteredAdvisers.length === 0 && !isFetching && (
                                                <div className="p-4 text-center text-xs text-slate-400">No advisers found</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="relative" ref={coAdviserRef}>
                                    <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Co-Adviser</label>
                                    <div className="relative">
                                        <input type="text" value={coAdviserSearch} onFocus={() => handleTriggerFetch("coAdviser")} onChange={(e) => { setCoAdviserSearch(e.target.value); setCoAdviserId(""); }} placeholder="Select Co-Adviser" className={inputClass} />
                                        <ChevronDown size={16} className="absolute right-3 top-3.5 text-slate-400" />
                                    </div>
                                    {showCoAdviserDropdown && (
                                        <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                                            {isFetching ? <div className="p-4 text-center text-xs italic text-slate-400">Fetching...</div> : filteredCoAdvisers.map(f => (
                                                <div key={f._id} onClick={() => { setCoAdviserSearch(getFullName(f)); setCoAdviserId(f._id); setShowCoAdviserDropdown(false); }} className="cursor-pointer border-b border-slate-50 p-3 text-sm hover:bg-slate-50">
                                                    <div className="font-bold">{getFullName(f)}</div>
                                                    <div className="text-[10px] text-slate-400">{f.department}</div>
                                                </div>
                                            ))}
                                            {filteredCoAdvisers.length === 0 && !isFetching && (
                                                <div className="p-4 text-center text-xs text-slate-400">No co-advisers found</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0038A8] py-4 font-bold text-white transition-all hover:bg-[#002d86] disabled:opacity-50">
                                {loading ? "Submitting..." : <><Send size={18} /> Submit Proposal</>}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                /* TABLE DISPLAY */
                <div className="rounded-3xl border border-slate-200 bg-white/70 shadow-xl backdrop-blur-md overflow-hidden">
                    {/* Table Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-[#0038A8] to-[#002d86]">
                        <div>
                            <h2 className="text-xl font-black text-white">SUBMITTED PROPOSALS</h2>
                            <p className="text-xs text-blue-200 mt-1">Total: {totalProposal} proposals</p>
                        </div>
                        
                        {/* Limit selector */}
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-white/80">Show:</label>
                            <select
                                value={limit}
                                onChange={(e) => handleLimitChange(Number(e.target.value))}
                                className="rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                            >
                                <option value={5} className="text-slate-900">5</option>
                                <option value={10} className="text-slate-900">10</option>
                                <option value={20} className="text-slate-900">20</option>
                                <option value={50} className="text-slate-900">50</option>
                            </select>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="p-4 border-b space-y-3">
                        <div className="relative">
                            <FileSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by title, description, status, or adviser..."
                                onChange={handleSearchInput}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0038A8] focus:border-transparent outline-none text-sm"
                            />
                        </div>
                        
                        {/* Date Filter */}
                        <div>
                            <button
                                onClick={() => setShowDateFilter(!showDateFilter)}
                                className="inline-flex items-center gap-2 text-sm text-[#0038A8] font-semibold hover:underline"
                            >
                                <Calendar size={16} />
                                {showDateFilter ? "Hide Date Filter" : "Filter by Date"}
                            </button>
                            
                            {showDateFilter && (
                                <div className="mt-3 flex flex-col sm:flex-row gap-3 items-end">
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-slate-600 mb-1">From Date</label>
                                        <input
                                            type="date"
                                            value={fromDate}
                                            onChange={(e) => setFromDate(e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#0038A8] outline-none text-sm"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-slate-600 mb-1">To Date</label>
                                        <input
                                            type="date"
                                            value={toDate}
                                            onChange={(e) => setToDate(e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#0038A8] outline-none text-sm"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={applyDateFilter}
                                            className="px-4 py-2 bg-[#0038A8] text-white rounded-lg text-sm font-semibold hover:bg-[#002d86] transition-colors"
                                        >
                                            Apply
                                        </button>
                                        <button
                                            onClick={clearDateFilter}
                                            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-300 transition-colors"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="overflow-auto p-6" style={{ maxHeight: "calc(100vh - 400px)" }}>
                        {contextIsLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0038A8] mb-4"></div>
                                <p className="text-slate-400 font-medium">Loading proposals...</p>
                            </div>
                        ) : proposalsToDisplay.length > 0 ? (
                            <>
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 sticky top-0">
                                        <tr className="text-[10px] font-bold uppercase text-slate-400">
                                            <th className="px-4 py-3 rounded-tl-lg">#</th>
                                            <th className="px-4 py-3">Title</th>
                                            <th className="px-4 py-3">Description</th>
                                            <th className="px-4 py-3">Adviser</th>
                                            <th className="px-4 py-3">Co-Adviser</th>
                                            <th className="px-4 py-3">Organizer</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Date Submitted</th>
                                            <th className="px-4 py-3 rounded-tr-lg text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {proposalsToDisplay.map((proposalItem, idx) => {
                                            const statusStyle = getStatusBadge(proposalItem.status);
                                            const serialNumber = (currentPage - 1) * limit + idx + 1;
                                            return (
                                                <tr key={proposalItem._id || idx} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-4 py-4 text-slate-400 font-mono text-xs">{serialNumber}</td>
                                                    <td className="px-4 py-4">
                                                        <div className="font-bold text-slate-700 max-w-[200px] truncate" title={proposalItem.title}>
                                                            {proposalItem.title || "Untitled"}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="text-slate-500 max-w-[200px] truncate text-xs" title={proposalItem.description}>
                                                            {proposalItem.description || "N/A"}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-1">
                                                            <User size={12} className="text-slate-400" />
                                                            <span className="text-sm text-slate-600">
                                                                {proposalItem.adviserName && proposalItem.adviserName !== "N/A" 
                                                                    ? proposalItem.adviserName 
                                                                    : (proposalItem.adviserInfo?.first_name 
                                                                        ? `${proposalItem.adviserInfo.first_name} ${proposalItem.adviserInfo.last_name}`
                                                                        : "N/A")}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="text-sm text-slate-600">
                                                            {proposalItem.coAdviserName && proposalItem.coAdviserName !== "N/A" 
                                                                ? proposalItem.coAdviserName 
                                                                : (proposalItem.coAdviserInfo?.first_name 
                                                                    ? `${proposalItem.coAdviserInfo.first_name} ${proposalItem.coAdviserInfo.last_name}`
                                                                    : "N/A")}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="text-sm text-slate-600">
                                                            {proposalItem.organizerName && proposalItem.organizerName !== "N/A" 
                                                                ? proposalItem.organizerName 
                                                                : (proposalItem.organizerInfo?.studentID 
                                                                    ? proposalItem.organizerInfo.studentID
                                                                    : "N/A")}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={cn("inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase", statusStyle.bg, statusStyle.text, statusStyle.border)}>
                                                            {proposalItem.status || "pending"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar size={12} className="text-slate-400" />
                                                            <span className="text-xs text-slate-500">
                                                                {formatDate(proposalItem.created_at || proposalItem.createdAt)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <button
                                                            onClick={() => handleViewDetails(proposalItem)}
                                                            className="inline-flex items-center gap-1 rounded-lg bg-[#0038A8]/10 px-3 py-1.5 text-xs font-semibold text-[#0038A8] transition-all hover:bg-[#0038A8] hover:text-white"
                                                        >
                                                            <Eye size={14} /> View
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                                        <div className="text-sm text-slate-500">
                                            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalProposal)} of {totalProposal} entries
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={cn(
                                                    "p-2 rounded-lg border transition-colors",
                                                    currentPage === 1 
                                                        ? "border-slate-200 text-slate-300 cursor-not-allowed" 
                                                        : "border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-[#0038A8]"
                                                )}
                                            >
                                                <ChevronLeft size={18} />
                                            </button>
                                            
                                            <div className="flex gap-1">
                                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                                                            onClick={() => handlePageChange(pageNum)}
                                                            className={cn(
                                                                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                                                currentPage === pageNum
                                                                    ? "bg-[#0038A8] text-white"
                                                                    : "text-slate-600 hover:bg-slate-50 hover:text-[#0038A8]"
                                                            )}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={cn(
                                                    "p-2 rounded-lg border transition-colors",
                                                    currentPage === totalPages 
                                                        ? "border-slate-200 text-slate-300 cursor-not-allowed" 
                                                        : "border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-[#0038A8]"
                                                )}
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <FileSearch size={48} className="text-slate-300 mb-4" />
                                <p className="text-slate-400 font-medium">No proposals found</p>
                                <p className="text-xs text-slate-300 mt-1">
                                    {searchTerm ? "Try adjusting your search" : "Submit your first proposal to get started"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* DETAIL MODAL */}
            {showDetailModal && selectedProposal && (
                <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b p-6 bg-gradient-to-r from-[#0038A8] to-[#002d86]">
                            <div>
                                <h2 className="text-xl font-black text-white">PROPOSAL DETAILS</h2>
                                <p className="text-xs text-blue-200 mt-1">View complete information</p>
                            </div>
                            <button onClick={() => setShowDetailModal(false)} className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-all">
                                <X size={24} className="text-white" />
                            </button>
                        </div>

                        <div className="overflow-auto p-6" style={{ maxHeight: "calc(90vh - 80px)" }}>
                            <div className="space-y-6">
                                <div className="bg-slate-50 rounded-2xl p-5">
                                    <h3 className="text-sm font-bold text-[#0038A8] uppercase mb-4 border-b border-slate-200 pb-2">Basic Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Title</label>
                                            <p className="text-sm font-semibold text-slate-700">{selectedProposal.title || "N/A"}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Description</label>
                                            <p className="text-sm text-slate-600 leading-relaxed">{selectedProposal.description || "N/A"}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Status</label>
                                                <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase", getStatusBadge(selectedProposal.status).bg, getStatusBadge(selectedProposal.status).text)}>
                                                    {selectedProposal.status || "pending"}
                                                </span>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Submitted</label>
                                                <p className="text-sm text-slate-600">{formatDate(selectedProposal.created_at || selectedProposal.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-5">
                                    <h3 className="text-sm font-bold text-[#0038A8] uppercase mb-4 border-b border-slate-200 pb-2">Adviser Information</h3>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Adviser Name</label>
                                                <p className="text-sm text-slate-700">
                                                    {selectedProposal.adviserName && selectedProposal.adviserName !== "N/A" 
                                                        ? selectedProposal.adviserName 
                                                        : (selectedProposal.adviserInfo 
                                                            ? `${selectedProposal.adviserInfo.first_name || ""} ${selectedProposal.adviserInfo.last_name || ""}`.trim()
                                                            : "N/A")}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Email</label>
                                                <p className="text-sm text-slate-600">{selectedProposal.adviserInfo?.username || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-5">
                                    <h3 className="text-sm font-bold text-[#0038A8] uppercase mb-4 border-b border-slate-200 pb-2">Co-Adviser Information</h3>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Co-Adviser Name</label>
                                        <p className="text-sm text-slate-700">
                                            {selectedProposal.coAdviserName && selectedProposal.coAdviserName !== "N/A" 
                                                ? selectedProposal.coAdviserName 
                                                : (selectedProposal.coAdviserInfo 
                                                    ? `${selectedProposal.coAdviserInfo.first_name || ""} ${selectedProposal.coAdviserInfo.last_name || ""}`.trim()
                                                    : "Not assigned")}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-5">
                                    <h3 className="text-sm font-bold text-[#0038A8] uppercase mb-4 border-b border-slate-200 pb-2">Organizer Information</h3>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Organizer Name</label>
                                                <p className="text-sm text-slate-700">{selectedProposal.organizerName || "N/A"}</p>
                                            </div>
                                            {selectedProposal.organizerInfo && (
                                                <>
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Student ID</label>
                                                        <p className="text-sm text-slate-600">{selectedProposal.organizerInfo.studentID || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Gender</label>
                                                        <p className="text-sm text-slate-600">{selectedProposal.organizerInfo.gender || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Date of Birth</label>
                                                        <p className="text-sm text-slate-600">{formatDate(selectedProposal.organizerInfo.dob)}</p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Emergency Contact</label>
                                                        <p className="text-sm text-slate-600">
                                                            {selectedProposal.organizerInfo.emergency_contact_name} - {selectedProposal.organizerInfo.emergency_contact_number}
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {(selectedProposal.fileUrl || selectedProposal.fileName) && (
                                    <div className="bg-slate-50 rounded-2xl p-5">
                                        <h3 className="text-sm font-bold text-[#0038A8] uppercase mb-4 border-b border-slate-200 pb-2">Attached File</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <FileText size={24} className="text-slate-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700">{selectedProposal.fileName || "Proposal Document"}</p>
                                                    <p className="text-xs text-slate-400">Click to view or download</p>
                                                </div>
                                            </div>
                                            <a
                                                href={selectedProposal.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 rounded-lg bg-[#0038A8] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#002d86]"
                                            >
                                                <Download size={16} /> Open File
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

export default TitleProposal;