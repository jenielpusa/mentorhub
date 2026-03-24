import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginStatusModal({
  isOpen,
  onClose,
  status = "success",
  customMessage,
  autoClose = true, 
  autoCloseTime = 1000,
}) {
  const isSuccess = status === "success";

  // Auto-close logic
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseTime, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.35, type: "spring", stiffness: 260, damping: 20 }}
            className="relative bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border-b-8 border-yellow-400"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-blue-600 transition-colors duration-200 text-xl"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Icon Section */}
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`w-24 h-24 flex items-center justify-center rounded-full border-4 shadow-inner
                  ${isSuccess ? "bg-blue-50 border-blue-100" : "bg-yellow-50 border-yellow-100"}`}
              >
                {isSuccess ? (
                  <svg
                    className="w-12 h-12 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3.5}
                  >
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl font-black text-yellow-500"
                  >
                    !
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Text Content */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <h2
                className={`text-3xl font-extrabold mb-3 tracking-tight ${
                  isSuccess ? "text-blue-900" : "text-yellow-600"
                }`}
              >
                {isSuccess ? "Welcome Back!" : "Access Denied"}
              </h2>
              <p className="text-slate-500 text-sm md:text-base mb-8 leading-relaxed px-2 font-medium">
                {customMessage ||
                  (isSuccess
                    ? "Login successful! You are now being redirected to your dashboard."
                    : "We couldn't find an account with those details. Please try again.")}
              </p>
            </motion.div>

            {/* Action Button */}
            <motion.button
              whileHover={{
                scale: 1.02,
                backgroundColor: isSuccess ? "#1e40af" : "#eab308",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className={`w-full py-4 px-6 rounded-2xl text-lg font-bold transition-all duration-200 shadow-lg
                ${isSuccess ? "bg-blue-600 text-white" : "bg-yellow-400 text-blue-900"}`}
            >
              {isSuccess ? "Proceed to Home" : "Check Credentials"}
            </motion.button>

            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl -z-10 pointer-events-none">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-100 rounded-full opacity-30 blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 rounded-full opacity-30 blur-2xl"></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}