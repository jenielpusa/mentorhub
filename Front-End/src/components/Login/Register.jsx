import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AdminDisplayContext } from "../../contexts/AdminContext/AdminContext";
import { DepartmentContext } from "../../contexts/DepartmentContext/DepartmentContext";

const RegisterFormModal = ({ isOpen, onClose, role, inline = false }) => {
    const { AddAdmin } = useContext(AdminDisplayContext);
    const { departments } = useContext(DepartmentContext);

    const [formData, setFormData] = useState({
        id_number: "",
        department: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        suffix: "",
        gender: "Select Gender", // default placeholder
        dob: "",
        role: role,
        email: "",
        password: "",
        address: "",
        confirm_password: "",
        emergency_contact_name: "",
        emergency_contact_number: "",
        contact_number: "",
        specialty: "",
    });

    const [isMember, setIsMember] = useState(false); // State for checkbox
    const [passwordError, setPasswordError] = useState("");
    const [genderError, setGenderError] = useState(""); // for student gender validation

    useEffect(() => {
        if (!isOpen && !inline) {
            resetForm();
        }
    }, [isOpen, inline]);

    useEffect(() => {
        setFormData((prev) => ({ ...prev, role: role }));
    }, [role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear specific errors when user changes the field
        if (name === "password" || name === "confirm_password") {
            setPasswordError("");
        }
        if (name === "gender") {
            setGenderError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Gender validation for students
        if (role === "student") {
            if (!formData.gender || formData.gender === "Select Gender") {
                setGenderError("Please select a gender.");
                return;
            }
        }

        if (formData.password !== formData.confirm_password) {
            setPasswordError("Passwords do not match!");
            return;
        }

        const { confirm_password, ...dataToSend } = formData;
        
        // If member checkbox is checked, change the role to "member"
        if (isMember) {
            dataToSend.role = "member";
        }

        await AddAdmin(dataToSend);

        console.log(`Submitting ${isMember ? "member" : dataToSend.role} data:`, dataToSend);

        setTimeout(() => {
            onClose();
        }, 1000);
    };

    const resetForm = () => {
        setFormData({
            id_number: "",
            department: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            suffix: "",
            gender: "Select Gender",
            dob: "",
            email: "",
            password: "",
            address: "",
            confirm_password: "",
            emergency_contact_name: "",
            emergency_contact_number: "",
            contact_number: "",
            specialty: "",
            role: role,
        });
        setIsMember(false); // Reset checkbox
        setPasswordError("");
        setGenderError("");
    };

    // Inline mode (compact version)
    if (inline) {
        return (
            <div className="h-full w-full overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-yellow-50/30 p-3">
                <RegisterFormContent
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    passwordError={passwordError}
                    genderError={genderError}
                    role={role}
                    onBackToLogin={onClose}
                    departments={departments}
                    compact={true}
                    isMember={isMember}
                    setIsMember={setIsMember}
                />
            </div>
        );
    }

    // Modal mode (compact version)
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/50 p-3 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, y: 20, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative mx-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-gradient-to-br from-blue-50 via-white to-yellow-50/30 p-4 shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-3 top-3 rounded-full bg-blue-100 p-1.5 text-blue-900 transition-colors hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <RegisterFormContent
                            formData={formData}
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                            passwordError={passwordError}
                            genderError={genderError}
                            role={role}
                            departments={departments}
                            compact={true}
                            isMember={isMember}
                            setIsMember={setIsMember}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Compact form content component
const RegisterFormContent = ({ 
    formData, 
    handleChange, 
    handleSubmit, 
    passwordError, 
    genderError,
    role, 
    onBackToLogin,
    departments,
    compact = false,
    isMember,
    setIsMember
}) => {
    // Compact styling adjustments
    const inputClasses = compact
        ? "w-full rounded-lg border-2 border-blue-100 bg-white px-3 py-1.5 text-sm text-blue-900 placeholder-blue-300 shadow-sm transition-all focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-400/10"
        : "w-full rounded-lg border-2 border-blue-100 bg-white px-3 py-2 text-blue-900 placeholder-blue-300 shadow-sm transition-all focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-400/10";
    
    const labelClasses = compact
        ? "ml-1 text-[10px] font-bold uppercase tracking-widest text-blue-900"
        : "ml-1 text-xs font-bold uppercase tracking-widest text-blue-900";
    
    const selectClasses = compact
        ? "w-full appearance-none rounded-lg border-2 border-blue-100 bg-white px-3 py-1.5 text-sm text-blue-900 shadow-sm transition-all focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-400/10"
        : "w-full appearance-none rounded-lg border-2 border-blue-100 bg-white px-3 py-2 text-blue-900 shadow-sm transition-all focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-400/10";

    const idLabel = role === "student" ? "Student ID" : "Employee ID";

    return (
        <>
            {onBackToLogin && (
                <div className="mb-2">
                    <button
                        type="button"
                        onClick={onBackToLogin}
                        className="group flex items-center gap-1.5 text-blue-900 transition hover:text-yellow-600"
                    >
                        <div className="rounded-lg bg-blue-100 p-1 group-hover:bg-yellow-200">
                            <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Back to Login</span>
                    </button>
                </div>
            )}

            <h2 className={`mb-4 text-center font-bold text-blue-950 ${compact ? "text-lg" : "text-2xl"}`}>
                Register{" "}
                <span className="text-yellow-500">
                    {role === "student" 
                        ? (isMember ? "Member" : "Student") 
                        : role === "instructor" 
                            ? "Instructor" 
                            : role === "adviser" 
                                ? "Adviser" 
                                : "Panelist"}
                </span>
            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-3"
            >
                {/* Member Checkbox - Show only for student role */}
                {role === "student" && (
                    <div className="flex items-center space-x-2 rounded-lg bg-blue-50/50 p-2">
                        <input
                            type="checkbox"
                            id="memberCheckbox"
                            checked={isMember}
                            onChange={(e) => setIsMember(e.target.checked)}
                            className="h-4 w-4 rounded border-blue-300 text-yellow-500 focus:ring-2 focus:ring-yellow-400"
                        />
                        <label htmlFor="memberCheckbox" className="text-sm font-medium text-blue-900">
                            Register as Member (instead of Student)
                        </label>
                    </div>
                )}

                {/* Show role info if member is checked */}
                {role === "student" && isMember && (
                    <div className="rounded-lg bg-yellow-50 p-2 text-center">
                        <p className="text-xs text-yellow-800">
                            This user will be registered as a <strong>Member</strong> instead of Student
                        </p>
                    </div>
                )}

                {/* ID Field */}
                <div className="space-y-1">
                    <label className={labelClasses}>{idLabel}</label>
                    <input
                        type="text"
                        name="id_number"
                        value={formData.id_number}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                        placeholder={`Enter ${idLabel.toLowerCase()}`}
                    />
                </div>

                {/* Department Dropdown */}
                <div className="space-y-1">
                    <label className={labelClasses}>Department</label>
                    <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        className={selectClasses}
                    >
                        <option value="" disabled>Select Department</option>
                        {departments && departments.length > 0 ? (
                            departments.map((dept) => (
                                <option key={dept._id} value={dept._id}>
                                    {dept.departmentName}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>No departments available</option>
                        )}
                    </select>
                </div>

                {/* Conditional fields: Student vs Others */}
                {role === "student" ? (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className={labelClasses}>First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                                placeholder="First name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Middle Name</label>
                            <input
                                type="text"
                                name="middle_name"
                                value={formData.middle_name}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder="Middle name (opt)"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                                placeholder="Last name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Suffix</label>
                            <input
                                type="text"
                                name="suffix"
                                value={formData.suffix}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder="Jr., III (opt)"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className={`${selectClasses} ${genderError ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                            >
                                <option value="Select Gender" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {genderError && <p className="mt-0.5 text-[10px] text-red-500">{genderError}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                                placeholder="your.email@example.com"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                                placeholder="Enter password"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Confirm Password</label>
                            <input
                                type="password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                required
                                className={`${inputClasses} ${passwordError ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                                placeholder="Confirm password"
                            />
                            {passwordError && <p className="mt-0.5 text-[10px] text-red-500">{passwordError}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Emergency Contact Name</label>
                            <input
                                type="text"
                                name="emergency_contact_name"
                                value={formData.emergency_contact_name}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                                placeholder="Contact person"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Emergency Contact Number</label>
                            <input
                                type="text"
                                name="emergency_contact_number"
                                value={formData.emergency_contact_number}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                                placeholder="Contact number"
                            />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className={labelClasses}>Full Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                                placeholder="Enter address"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className={labelClasses}>First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                                placeholder="First name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Middle Name</label>
                            <input
                                type="text"
                                name="middle_name"
                                value={formData.middle_name}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder="Middle name (opt)"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                                placeholder="Last name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Suffix</label>
                            <input
                                type="text"
                                name="suffix"
                                value={formData.suffix}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder="Jr., III (opt)"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                                placeholder="your.email@example.com"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                                placeholder="Enter password"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Confirm Password</label>
                            <input
                                type="password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                required
                                className={`${inputClasses} ${passwordError ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                                placeholder="Confirm password"
                            />
                            {passwordError && <p className="mt-0.5 text-[10px] text-red-500">{passwordError}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Contact Number</label>
                            <input
                                type="text"
                                name="contact_number"
                                value={formData.contact_number}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                                placeholder="Enter contact number"
                            />
                        </div>
                        {role === "instructor" && (
                            <div className="space-y-1 md:col-span-2">
                                <label className={labelClasses}>Specialty</label>
                                <input
                                    type="text"
                                    name="specialty"
                                    value={formData.specialty}
                                    onChange={handleChange}
                                    required
                                    className={inputClasses}
                                    placeholder="e.g., Mathematics"
                                />
                            </div>
                        )}
                        {role === "panelist" && (
                            <div className="space-y-1 md:col-span-2">
                                <label className={labelClasses}>Expertise</label>
                                <input
                                    type="text"
                                    name="specialty"
                                    value={formData.specialty}
                                    onChange={handleChange}
                                    required
                                    className={inputClasses}
                                    placeholder="Enter expertise"
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-4 flex justify-center">
                    <button
                        type="submit"
                        className="transform rounded-full border-b-4 border-blue-950 bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-2 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 hover:from-blue-800 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-yellow-400/50 active:scale-95"
                    >
                        Register
                    </button>
                </div>
            </form>
        </>
    );
};

export default RegisterFormModal;