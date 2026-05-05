import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Shield, Eye, EyeOff, Fingerprint, ChevronRight } from "lucide-react";
import { useState } from "react";
import RoleRegistration from "./RoleRegistration";
import RegisterFormModal from "../Register";

const LoginForm = ({
    show,
    values,
    handleInput,
    handleLoginSubmit,
    isLoading,
    className = "",
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [registerStep, setRegisterStep] = useState('role');
    const [selectedRole, setSelectedRole] = useState('');

    const flipVariants = {
        front: { rotateY: 0, transition: { duration: 0.7, type: "spring", stiffness: 200, damping: 25 } },
        back: { rotateY: 180, transition: { duration: 0.7, type: "spring", stiffness: 200, damping: 25 } },
    };

    return (
        <AnimatePresence mode="wait">
            {show && (
                <motion.div
                    key="login-form-main"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`relative w-full ${className}`}
                    style={{ perspective: "2000px" }}
                >
                    <motion.div
                        className="relative w-full"
                        style={{ transformStyle: "preserve-3d" }}
                        animate={isFlipped ? "back" : "front"}
                        variants={flipVariants}
                    >
                        {/* FRONT SIDE - LOGIN */}
                        <motion.div
                            className="w-full rounded-3xl bg-slate-900/80 p-5 md:p-7 backdrop-blur-xl border border-white/10 shadow-2xl"
                            style={{ backfaceVisibility: "hidden" }}
                        >
                            <LoginHeader />
                            
                            <LoginFormContent
                                values={values}
                                handleInput={handleInput}
                                handleLoginSubmit={handleLoginSubmit}
                                isLoading={isLoading}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                            />

                            <div className="mt-5 space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                                    <div className="relative flex justify-center text-[10px]">
                                        <span className="bg-[#0f172a] px-3 text-slate-500 uppercase tracking-[0.2em] font-bold">OR</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => { setIsFlipped(true); setRegisterStep('role'); }}
                                    className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-blue-600/10"
                                >
                                    <div className="text-left">
                                        <p className="text-xs font-bold text-white">Create Account</p>
                                        <p className="text-[10px] text-slate-400">Request portal access</p>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-500 group-hover:text-blue-500 transition-all" />
                                </button>
                                
                                <SecurityFooter />
                            </div>
                        </motion.div>

                        {/* BACK SIDE - REGISTRATION */}
                        <motion.div
                            className="absolute inset-0 w-full rounded-3xl bg-slate-900 p-6 border border-white/10 shadow-2xl"
                            style={{ backfaceVisibility: "hidden", rotateY: 180 }}
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

const LoginHeader = () => (
    <div className="mb-4">
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <Shield className="text-blue-500" size={20} />
                <h3 className="text-xl font-bold text-white tracking-tight">
                    Portal <span className="text-blue-500">Login</span>
                </h3>
            </div>
            <p className="text-xs text-slate-400">Enter your credentials to continue.</p>
        </div>
    </div>
);

const LoginFormContent = ({ values, handleInput, handleLoginSubmit, isLoading, showPassword, setShowPassword }) => (
    <form className="space-y-3" onSubmit={handleLoginSubmit}>
        <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 ml-1">Email Address</label>
            <div className="group relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleInput}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-blue-500 transition-all"
                    placeholder="example@email.com"
                    required
                />
            </div>
        </div>

        <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 ml-1">Password</label>
            <div className="group relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={values.password}
                    onChange={handleInput}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white outline-none focus:border-blue-500 transition-all"
                    placeholder="Enter password"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        </div>

        <motion.button
            type="submit"
            disabled={isLoading}
            className={`relative mt-2 w-full rounded-lg py-2.5 text-sm font-bold text-white shadow-lg ${
                isLoading ? "bg-slate-700" : "bg-blue-600 hover:bg-blue-500 active:scale-[0.98]"
            }`}
            whileHover={!isLoading ? { y: -1 } : {}}
        >
            <div className="flex items-center justify-center gap-2">
                {isLoading ? (
                    <>
                        <Fingerprint className="animate-pulse" size={18}/>
                        <span>Verifying...</span>
                    </>
                ) : (
                    <span>Sign In</span>
                )}
            </div>
        </motion.button>
    </form>
);

const SecurityFooter = () => (
    <div className="flex items-center justify-center gap-2 pt-2 opacity-50">
        <Shield size={12} className="text-slate-400" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Encrypted Security</span>
    </div>
);

export default LoginForm;