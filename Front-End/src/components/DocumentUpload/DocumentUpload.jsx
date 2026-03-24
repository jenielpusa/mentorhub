import { useState, useRef, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { Send, FileText, Lightbulb, ClipboardCheck, AlertCircle, List, ChevronDown, Eye, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { AdminDisplayContext } from "../../contexts/AdminContext/AdminContext";
import { DocumenContext } from "../../contexts/DocumentContext/DocumentContext";
import StatusModal from "../../ReusableFolder/SuccessandField";

const TitleProposal = () => {
    const { AddDocument, documents } = useContext(DocumenContext); // Inasahan na may 'documents' sa context
    const { faculty, fetchFaculty } = useContext(AdminDisplayContext);

    // UI States
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showTableModal, setShowTableModal] = useState(false); // State para sa Table Modal
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

    const [adviserSearch, setAdviserSearch] = useState("");
    const [coAdviserSearch, setCoAdviserSearch] = useState("");
    const [showAdviserDropdown, setShowAdviserDropdown] = useState(false);
    const [showCoAdviserDropdown, setShowCoAdviserDropdown] = useState(false);

    const adviserRef = useRef(null);
    const coAdviserRef = useRef(null);

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
                // Reset Fields
                setTitle(""); setDescription(""); setSelectedFile(null); setAdviserSearch(""); setCoAdviserSearch(""); setAdviserId(""); setCoAdviserId("");
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

                {/* VIEW TITLE BUTTON */}
                <button 
                    onClick={() => setShowTableModal(true)}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#0038A8] px-4 py-2 text-sm font-bold text-[#0038A8] transition-all hover:bg-[#0038A8] hover:text-white"
                >
                    <Eye size={18} /> View Submitted Titles
                </button>
            </div>

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

            {/* POPUP MODAL FOR TABLE */}
            {showTableModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-4xl max-h-[80vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b p-6">
                            <h2 className="text-xl font-black text-[#0038A8]">SUBMITTED PROPOSALS</h2>
                            <button onClick={() => setShowTableModal(false)} className="rounded-full p-2 hover:bg-slate-100">
                                <X size={24} className="text-slate-500" />
                            </button>
                        </div>
                        
                        {/* Modal Body - Table */}
                        <div className="overflow-auto p-6">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400">
                                    <tr>
                                        <th className="px-4 py-3">Title</th>
                                        <th className="px-4 py-3">Adviser</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {/* Halimbawa ng pag-map mula sa context documents */}
                                    {documents && documents.length > 0 ? (
                                        documents.map((doc, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50">
                                                <td className="px-4 py-4 font-bold text-slate-700">{doc.title}</td>
                                                <td className="px-4 py-4 text-slate-500">{doc.adviserId?.first_name || "N/A"}</td>
                                                <td className="px-4 py-4">
                                                    <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-600 uppercase">
                                                        {doc.status || "Pending"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-right text-slate-400">
                                                    {new Date(doc.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-10 text-center text-slate-400 italic">No proposals found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
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