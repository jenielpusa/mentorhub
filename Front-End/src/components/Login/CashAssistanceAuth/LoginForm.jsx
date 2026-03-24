import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Shield, ArrowLeft, Eye, EyeOff, GraduationCap } from "lucide-react";
import { useState } from "react";
import logoTap from "../../../assets/bipsulogo.png";
import RoleRegistration from "./RoleRegistration";
import RegisterFormModal from "../Register";

const LoginForm = ({
    show,
    values,
    handleInput,
    handleLoginSubmit,
    isLoading,
    handleBackToHome,
    setForgotPassword,
    position = "right",
    className = "",
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [registerStep, setRegisterStep] = useState('role');
    const [selectedRole, setSelectedRole] = useState('');

    const slideInVariants = {
        hidden: { x: position === "right" ? "100%" : "-100%", opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
        exit: { x: position === "right" ? "100%" : "-100%", opacity: 0, transition: { duration: 0.5, ease: "easeIn" } },
    };

    const flipVariants = {
        front: { rotateY: 0 },
        back: { rotateY: 180 },
    };

    return (
        <AnimatePresence mode="wait">
            {show && (
                <motion.div
                    key="login-form"
                    className={`flex w-full items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 via-white to-yellow-50/30 p-4 shadow-2xl md:p-6 ${className}`}  // reduced padding
                    variants={slideInVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{ minHeight: "auto", perspective: "1200px" }} // removed fixed minHeight
                >
                    <motion.div
                        className="w-full max-w-md lg:max-w-lg" // narrower width for compact look
                        style={{ transformStyle: "preserve-3d" }}
                        animate={isFlipped ? "back" : "front"}
                        variants={flipVariants}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                        {/* FRONT SIDE - LOGIN FORM */}
                        <motion.div
                            style={{
                                backfaceVisibility: "hidden",
                                position: "relative",
                                width: "100%",
                            }}
                        >
                            <BackButton
                                handleBackToHome={handleBackToHome}
                                position={position}
                            />
                            <LoginHeader logo={logoTap} />
                            <LoginFormContent
                                values={values}
                                handleInput={handleInput}
                                handleLoginSubmit={handleLoginSubmit}
                                isLoading={isLoading}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                                setForgotPassword={setForgotPassword}
                            />
                            <div className="mt-4 text-center"> {/* reduced top margin */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsFlipped(true);
                                        setRegisterStep('role');
                                        setSelectedRole('');
                                    }}
                                    className="text-sm font-semibold text-blue-900 transition hover:text-yellow-600"
                                >
                                    Don't have an account? <span className="underline">Create one</span>
                                </button>
                            </div>
                            <SecurityFooter />
                        </motion.div>

                        {/* BACK SIDE - Role Selection or Registration Form */}
                        <motion.div
                            style={{
                                backfaceVisibility: "hidden",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                rotateY: 180,
                            }}
                        >
                            {registerStep === 'role' ? (
                                <RoleRegistration
                                    onSelectRole={(role) => {
                                        setSelectedRole(role);
                                        setRegisterStep('form');
                                    }}
                                    onBack={() => setIsFlipped(false)}
                                />
                            ) : (
                                <RegisterFormModal
                                    inline={true}
                                    isOpen={true}
                                    onClose={() => setIsFlipped(false)}
                                    role={selectedRole}
                                />
                            )}
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ---------------- BACK BUTTON ----------------
const BackButton = ({ handleBackToHome, position }) => (
    <button
        onClick={handleBackToHome}
        className="group mb-4 flex items-center gap-2 text-blue-900 transition hover:text-blue-700" // reduced margin-bottom
    >
        <motion.div
            className="rounded-lg bg-blue-100 p-2 group-hover:bg-yellow-200"
            whileHover={{ x: position === "right" ? -5 : 5 }}
            transition={{ duration: 0.3 }}
        >
            <ArrowLeft className="h-4 w-4" /> {/* slightly smaller icon */}
        </motion.div>
        <span className="text-xs font-semibold uppercase tracking-wider">Back to Home</span> {/* smaller text */}
    </button>
);

// ---------------- LOGIN HEADER ----------------
const LoginHeader = ({ logo }) => (
    <motion.div
        className="mb-4 text-center" // reduced margin-bottom
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
    >
        <div className="mb-2 flex justify-center"> {/* reduced margin-bottom */}
            <img
                src={logo}
                alt="BiPSU Logo"
                className="h-16 w-16 object-contain drop-shadow-xl" // smaller logo
            />
        </div>
        <h3 className="mb-1 text-2xl font-black tracking-tighter text-blue-950"> {/* smaller title */}
            Mentor<span className="text-yellow-500">Hub</span>
        </h3>
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-blue-800/70"> {/* smaller text */}
            <GraduationCap size={14} />
            <p>Research & Manuscript Portal</p>
        </div>
    </motion.div>
);

// ---------------- FORM CONTENT ----------------
const LoginFormContent = ({ values, handleInput, handleLoginSubmit, isLoading, showPassword, setShowPassword, setForgotPassword }) => (
    <form
        className="space-y-3" // reduced spacing between elements
        onSubmit={handleLoginSubmit}
    >
        <EmailInput
            value={values.email}
            onChange={handleInput}
            disabled={isLoading}
        />
        <PasswordInput
            value={values.password}
            onChange={handleInput}
            disabled={isLoading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
        />

        <div className="flex items-center justify-between">
            <ShowPasswordCheckbox
                showPassword={showPassword}
                setShowPassword={setShowPassword}
            />
            <button
                type="button"
                className="text-xs font-bold uppercase text-blue-900 transition hover:text-yellow-600"
                onClick={() => setForgotPassword && setForgotPassword(true)}
            >
                Forgot?
            </button>
        </div>

        <LoginButton isLoading={isLoading} />
    </form>
);

// ---------------- INPUTS ----------------
const EmailInput = ({ value, onChange, disabled }) => (
    <div className="space-y-1"> {/* reduced label spacing */}
        <label className="ml-1 text-xs font-bold uppercase tracking-widest text-blue-900">Institutional Email</label>
        <div className="relative">
            <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400"
                size={16} // smaller icon
            />
            <input
                type="email"
                name="email"
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full rounded-xl border-2 border-blue-50 bg-white py-2.5 pl-9 pr-4 text-sm text-blue-900 placeholder-blue-300 shadow-sm transition-all focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 disabled:opacity-50" // reduced padding, smaller font
                placeholder="username@bipsu.edu.ph"
                required
            />
        </div>
    </div>
);

const PasswordInput = ({ value, onChange, disabled, showPassword, setShowPassword }) => (
    <div className="space-y-1">
        <label className="ml-1 text-xs font-bold uppercase tracking-widest text-blue-900">Secure Password</label>
        <div className="relative">
            <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400"
                size={16}
            />
            <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full rounded-xl border-2 border-blue-50 bg-white py-2.5 pl-9 pr-10 text-sm text-blue-900 placeholder-blue-300 shadow-sm transition-all focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 disabled:opacity-50"
                placeholder="••••••••"
                required
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 transition hover:text-blue-600"
            >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
    </div>
);

// ---------------- CHECKBOX & BUTTON ----------------
const ShowPasswordCheckbox = ({ showPassword, setShowPassword }) => (
    <div className="flex items-center">
        <input
            id="show-password"
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-blue-200 text-blue-900 focus:ring-yellow-400"
        />
        <label
            htmlFor="show-password"
            className="ml-2 cursor-pointer text-xs font-bold uppercase text-blue-800/60"
        >
            Remember Me
        </label>
    </div>
);

const LoginButton = ({ isLoading }) => (
    <motion.button
        type="submit"
        disabled={isLoading}
        className={`w-full rounded-xl px-4 py-3 font-bold text-white shadow-xl transition-all duration-300 ${ // reduced vertical padding
            isLoading
                ? "cursor-not-allowed bg-blue-300"
                : "border-b-4 border-blue-950 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 active:scale-95"
        }`}
        whileHover={{ scale: isLoading ? 1 : 1.01 }}
        whileTap={{ scale: isLoading ? 1 : 0.99 }}
    >
        {isLoading ? "AUTHENTICATING..." : "ACCESS PORTAL"}
    </motion.button>
);

// ---------------- SECURITY FOOTER ----------------
const SecurityFooter = () => (
    <motion.div className="mt-6 border-t border-blue-100 pt-4 text-center"> {/* reduced margins */}
        <div className="mb-1 flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-widest text-blue-900/40"> {/* smaller text */}
            <Shield className="h-2.5 w-2.5" />
            <span>BiPSU Identity Management System Secure</span>
        </div>
        <p className="text-[9px] font-medium text-blue-900/30">© 2026 BILIRAN ISLAND STATE UNIVERSITY • WOVEN FOR QUALITY</p>
    </motion.div>
);

export default LoginForm;