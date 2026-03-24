import { motion } from "framer-motion";
import { Target, Eye, ShieldCheck, Award } from "lucide-react";
import logo from "../../../assets/bipsulogo.png";

const MissionandVision = () => {
    return (
        <section id="about" className="relative">
            {/* Background Decorative Circles */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />

            <div className="container relative z-10 mx-auto px-6 sm:px-16 lg:px-24">
                
                {/* Header Title */}
                <div className="mb-20 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 mb-4 px-5 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20"
                    >
                        <Award size={16} className="text-yellow-400" />
                        <span className="text-xs font-bold text-yellow-400 tracking-[0.2em] uppercase">Institutional Profile</span>
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                        About <span className="text-yellow-500">BiPSU</span>
                    </h2>
                </div>

                {/* Main Content: Left (M&V) | Right (Logo) */}
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left Side: Mission & Vision */}
                    <motion.div 
                        className="space-y-8"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Mission Card */}
                        <div className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-all duration-500 backdrop-blur-sm">
                            <div className="flex items-start gap-6">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-900/50 group-hover:scale-110 transition-transform">
                                    <Target className="text-white" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-yellow-500 mb-3 tracking-wide uppercase">Mission</h3>
                                    <p className="text-blue-100/80 leading-relaxed text-lg italic">
                                        "BiPSU shall primarily provide advanced education, higher technological, professional instruction and training in various fields."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Vision Card */}
                        <div className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-all duration-500 backdrop-blur-sm">
                            <div className="flex items-start gap-6">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg shadow-yellow-900/50 group-hover:scale-110 transition-transform">
                                    <Eye className="text-blue-950" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-yellow-500 mb-3 tracking-wide uppercase">Vision</h3>
                                    <p className="text-blue-100/80 leading-relaxed text-lg italic">
                                        "A premier State University in the Region of Eastern Visayas, weaving quality research and innovation."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side: Logo Section */}
                    <motion.div 
                        className="relative flex justify-center items-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                    >
                        {/* Rotating Circle - set to z-0 para nasa likod */}
                        <motion.div 
                            className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] border-2 border-dashed border-yellow-500/20 rounded-full z-0"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        />
                        
                        {/* Logo - nasa harap (z-10) */}
                        <motion.img 
                            src={logo} 
                            alt="BiPSU Large Logo" 
                            className="relative z-10 h-64 w-64 md:h-[400px] md:w-[400px] object-contain drop-shadow-[0_0_50px_rgba(234,179,8,0.3)]"
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default MissionandVision;