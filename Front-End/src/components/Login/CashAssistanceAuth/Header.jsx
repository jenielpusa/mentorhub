import { motion } from "framer-motion";
import logo from "../../../assets/bipsulogo.png";

const Header = () => {
    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-2xl"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="container mx-auto px-6 sm:px-12 lg:px-20 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo Section - Primary Focus */}
                    <LogoSection />
                </div>
            </div>
        </motion.header>
    );
};

const LogoSection = () => (
    <motion.div 
        className="flex items-center gap-4 group cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
    >
        <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full group-hover:bg-blue-500/40 transition-all" />
            <img 
                src={logo} 
                alt="BiPSU Logo" 
                className="relative h-11 w-11 object-contain transition-transform group-hover:scale-105" 
            />
        </div>

        <div className="flex flex-col leading-tight">
            <h1 className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Republic of the Philippines
            </h1>
            <p className="text-white font-black text-base md:text-xl tracking-tighter uppercase">
                BiPSU <span className="text-blue-500 italic">MentorHub</span>
            </p>
            <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-cyan-500 animate-pulse" />
                <p className="hidden md:block text-[8px] text-blue-400/60 uppercase tracking-[0.3em] font-bold">
                    Manuscript & Thesis System
                </p>
            </div>
        </div>
    </motion.div>
);

export default Header;