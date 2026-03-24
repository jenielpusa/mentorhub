import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X, AlertTriangle } from "lucide-react";

export default function StatusModal({
  isOpen,
  onClose,
  status = "success",
  error = null,
  title = null,
  message = null,
  duration = null,
  isProduction = false,
}) {
  const isSuccess = status === "success";
  
  const defaultTitle = isSuccess ? "Success!" : "System Alert";
  const defaultMessage = isSuccess 
    ? "Ang iyong request ay matagumpay na naproseso. Maari ka nang magpatuloy."
    : "Nagkaroon ng problema sa pagproseso. Pakisubukang muli o makipag-ugnayan sa administrator.";
  
  const getSafeErrorMessage = () => {
    if (!error) return null;
    if (isProduction) return "An unexpected error occurred. Please try again later.";
    return error;
  };
  
  const safeError = getSafeErrorMessage();

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: { duration: 0.2 }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (isSuccess && duration) {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => (document.body.style.overflow = 'unset');
  }, [isOpen, duration, isSuccess, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with BiPSU Blue tint */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            className="fixed inset-0 bg-[#002855]/60 backdrop-blur-md z-[9999]"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4 pointer-events-none">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_20px_50px_rgba(0,40,85,0.3)] max-w-md w-full pointer-events-auto relative border-t-8 border-[#FFB81C]"
            >
              {/* BiPSU Header Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#002855] rounded-t-2xl opacity-20" />
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition-all duration-200"
              >
                <X size={20} />
              </button>

              <div className="p-8">
                {/* Icon Container with BiPSU Blue & Yellow Glow */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`relative mx-auto mb-6 w-24 h-24 flex items-center justify-center rounded-3xl rotate-12 shadow-xl
                    ${isSuccess 
                      ? "bg-[#002855] border-4 border-[#FFB81C]" 
                      : "bg-red-600 border-4 border-red-200"
                    }`}
                >
                  <div className="rotate-[-12deg]">
                    {isSuccess ? (
                      <CheckCircle size={44} className="text-[#FFB81C]" strokeWidth={2.5} />
                    ) : (
                      <XCircle size={44} className="text-white" strokeWidth={2.5} />
                    )}
                  </div>
                </motion.div>

                {/* Title */}
                <h2 className="text-2xl font-black mb-2 text-[#002855] dark:text-white text-center uppercase tracking-tight">
                  {title || defaultTitle}
                </h2>

                {/* Message */}
                <div className="text-slate-600 dark:text-slate-300 text-center mb-8">
                  <p className="text-sm md:text-base leading-relaxed">{message || defaultMessage}</p>
                  
                  {!isSuccess && safeError && (
                    <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 text-left">
                      <div className="flex gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <code className="text-xs text-red-700 dark:text-red-400 font-mono break-all">
                          {safeError}
                        </code>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action button - BiPSU Yellow for Success / Blue for Error */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <button
                    onClick={onClose}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg
                      ${isSuccess
                        ? "bg-[#FFB81C] text-[#002855] hover:bg-[#e5a619] shadow-[#FFB81C]/30"
                        : "bg-[#002855] text-white hover:bg-[#001d3d] shadow-[#002855]/30"
                      }`}
                  >
                    {isSuccess ? "Magpatuloy" : "Subukan Muli"}
                  </button>
                </motion.div>
                
                {/* Auto-close bar */}
                {isSuccess && duration && (
                  <div className="mt-6 w-24 mx-auto">
                    <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: duration / 1000, ease: "linear" }}
                        className="h-full bg-[#FFB81C]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}