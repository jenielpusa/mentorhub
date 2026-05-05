import { useContext, useRef, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
    ShieldCheck, 
    GraduationCap, 
    BookOpen, 
    FileText, 
    Library, 
    Award, 
    PenTool 
} from "lucide-react";

import { AuthContext } from "../../../contexts/AuthContext";
import LoginForm from "../CashAssistanceAuth/LoginForm";
import LoginStatusModal from "../../../ReusableFolder/LogInStatusModal";

const HeroSection = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const sectionRef = useRef(null);
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [formValues, setFormValues] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [loginStatus, setLoginStatus] = useState({ 
        show: false, 
        status: "", 
        message: "" 
    });

    // Inilagay sa useMemo para hindi mag-trigger ng unnecessary effect re-runs
    const slides = useMemo(() => [
        {
            image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1920&h=1080&fit=crop",
            title: "Thesis Collection",
            subtitle: "Undergraduate Research",
            icon: GraduationCap,
            description: "Pioneering research that shapes the future of academic excellence"
        },
        {
            image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&h=1080&fit=crop",
            title: "Manuscript Archive",
            subtitle: "Faculty Publications",
            icon: BookOpen,
            description: "Peer-reviewed manuscripts advancing knowledge frontiers"
        },
        {
            image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1920&h=1080&fit=crop",
            title: "Research Repository",
            subtitle: "Institutional Knowledge Base",
            icon: Library,
            description: "Centralized digital hub for scholarly works"
        },
        {
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4a4173?w=1920&h=1080&fit=crop",
            title: "Digital Library",
            subtitle: "E-Theses & Dissertations",
            icon: FileText,
            description: "Preserving academic legacy through digital transformation"
        },
        {
            image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1920&h=1080&fit=crop",
            title: "Academic Archive",
            subtitle: "Research Excellence",
            icon: Award,
            description: "Celebrating intellectual contributions and discoveries"
        }
    ], []);

    // Auto-rotate logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 6000);
        
        return () => clearInterval(timer);
    }, [slides.length]);

    // Parallax Effects
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const mainOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await login(formValues.email, formValues.password);
            
            if (response.success) {
                setLoginStatus({ 
                    show: true, 
                    status: "success", 
                    message: "Login successful! Welcome to MentorHub." 
                });
            } else {
                setLoginStatus({
                    show: true,
                    status: "error",
                    message: response.message || "Authentication failed. Please check your credentials.",
                });
            }
        } catch (error) {
            setLoginStatus({ 
                show: true, 
                status: "error", 
                message: "An unexpected error occurred." 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        const wasSuccess = loginStatus.status === "success";
        setLoginStatus(prev => ({ ...prev, show: false }));
        
        if (wasSuccess) {
            navigate("/dashboard");
        }
    };

    const currentSlide = slides[currentIndex];
    const SlideIcon = currentSlide.icon;

    return (
        <section
            ref={sectionRef}
            className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950"
        >
            {/* Background Layer: Images & Overlays */}
            <motion.div 
                className="absolute inset-0 z-0" 
                style={{ y: bgY, opacity: mainOpacity }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2 }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${currentSlide.image})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-indigo-950/70" />
                        
                        {/* Pattern Overlays */}
                        <div 
                            className="absolute inset-0 opacity-10" 
                            style={{
                                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 29px, rgba(59,130,246,0.1) 29px, rgba(59,130,246,0.1) 30px)`
                            }} 
                        />
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* Floating Elements (Icons & Particles) */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                {[BookOpen, GraduationCap, FileText].map((Icon, idx) => (
                    <motion.div
                        key={idx}
                        className="absolute opacity-10"
                        animate={{ 
                            y: [0, -100, 0],
                            rotate: [0, 360],
                            opacity: [0.05, 0.15, 0.05]
                        }}
                        transition={{ 
                            duration: 15 + idx * 5, 
                            repeat: Infinity, 
                            ease: "linear" 
                        }}
                        style={{ 
                            left: `${20 + idx * 30}%`, 
                            top: `${30 + idx * 10}%` 
                        }}
                    >
                        <Icon size={120} className="text-blue-500" />
                    </motion.div>
                ))}
            </div>

            {/* Main Content - Pinadagdagan ng lapad ang container */}
            <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24 py-12 max-w-7xl lg:max-w-[90rem]">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20 xl:gap-24">
                    
                    {/* Content Left - Pinadagdagan ng lapad at margin */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full lg:w-[55%] text-center lg:text-left ml-0 lg:-ml-8 xl:-ml-12"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-sm"
                            >
                                <SlideIcon size={14} />
                                {currentSlide.title}
                            </motion.div>
                        </AnimatePresence>

                        <h1 className="mb-6 text-6xl font-black tracking-tighter text-white md:text-8xl leading-none">
                            Mentor<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Hub</span>
                        </h1>

                        <h2 className="mb-4 text-2xl font-bold text-slate-100 md:text-4xl">
                            {currentSlide.subtitle}
                        </h2>

                        <p className="mb-8 max-w-xl text-slate-300 md:text-lg leading-relaxed lg:text-xl">
                            Access a comprehensive collection of <span className="text-blue-400">theses</span> and <span className="text-indigo-400">academic manuscripts</span> from BiPSU's brightest minds.
                        </p>

                        {/* Stats */}
                        <div className="flex justify-center lg:justify-start gap-8 md:gap-12 border-t border-white/10 pt-8">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-white">2,500+</div>
                                <div className="text-[10px] uppercase tracking-wider text-slate-500">Theses</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-white">1,200+</div>
                                <div className="text-[10px] uppercase tracking-wider text-slate-500">Manuscripts</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-white">500+</div>
                                <div className="text-[10px] uppercase tracking-wider text-slate-500">Researchers</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Login Form Right - Pinadagdagan ng lapad at margin */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md lg:max-w-lg xl:max-w-xl mr-0 lg:-mr-8 xl:-mr-12"
                    >
                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-2xl shadow-2xl">
                            <LoginForm
                                show={true}
                                values={formValues}
                                handleInput={handleInput}
                                handleLoginSubmit={handleLoginSubmit}
                                isLoading={isLoading}
                                handleBackToHome={() => navigate("/")} 
                                position="right"
                                loginStatus={loginStatus}
                            />
                        </div>
                        
                        <div className="mt-6 flex items-center justify-center gap-3 text-slate-500">
                            <ShieldCheck size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                BiPSU Secure Access
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Pagination Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 transition-all duration-500 rounded-full ${
                            idx === currentIndex ? "w-8 bg-blue-500" : "w-2 bg-white/20"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>

            <LoginStatusModal
                isOpen={loginStatus.show}
                onClose={handleModalClose}
                status={loginStatus.status}
                customMessage={loginStatus.message}
            />
        </section>
    );
};

export default HeroSection;