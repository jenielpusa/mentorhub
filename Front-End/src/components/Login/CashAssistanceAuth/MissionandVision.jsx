import { motion } from "framer-motion";
import { Target, Eye, Sparkles, ChevronRight } from "lucide-react";
import logo from "../../../assets/bipsulogo.png";

const MissionandVision = () => {
    return (
        <section id="about" className="relative py-20 overflow-hidden">
            {/* Ambient Background Glows - Nanatili para sa depth pero subtle na lang */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />

            <div className="container relative z-10 mx-auto px-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6 border-b border-white/10 pb-8">
                    <div className="max-w-2xl">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 mb-3"
                        >
                            <div className="h-[2px] w-6 bg-blue-500" />
                            <span className="text-[10px] font-black text-blue-400 tracking-[0.3em] uppercase">Identity</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                            The <span className="text-blue-500 italic">Core</span> of BiPSU
                        </h2>
                    </div>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-slate-400 text-xs max-w-[280px] md:text-right font-medium leading-relaxed"
                    >
                        Dedicated to weaving quality research and technological innovation across the region.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Left side: Content Panels */}
                    <div className="lg:col-span-7 space-y-4">
                        
                        {/* Mission Card - Transparent Glass Style */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="group relative p-px rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10"
                        >
                            <div className="relative z-10 p-7 md:p-9 bg-white/5 rounded-[1.9rem] backdrop-blur-xl transition-colors group-hover:bg-white/10">
                                <div className="flex flex-col sm:flex-row gap-6 items-start">
                                    <div className="p-4 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                        <Target size={28} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-2xl font-black text-white tracking-tight">MISSION</h3>
                                            <Sparkles size={14} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed italic">
                                            "BiPSU shall primarily provide <span className="text-blue-400 not-italic font-bold">advanced education</span>, professional instruction, and specialized training in various fields."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Vision Card - Transparent Glass Style */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="group relative p-px rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10"
                        >
                            <div className="relative z-10 p-7 md:p-9 bg-white/5 rounded-[1.9rem] backdrop-blur-xl transition-colors group-hover:bg-white/10">
                                <div className="flex flex-col sm:flex-row gap-6 items-start">
                                    <div className="p-4 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                        <Eye size={28} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-2xl font-black text-white tracking-tight">VISION</h3>
                                            <ChevronRight size={18} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                        <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed italic">
                                            "A <span className="text-blue-500 font-black not-italic">Premier State University</span> in the Region of Eastern Visayas, weaving quality research and innovation."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right side: Logo Showcase */}
                    <motion.div 
                        className="lg:col-span-5 relative flex items-center justify-center min-h-[350px] rounded-[2.5rem] bg-white/5 border border-white/10 overflow-hidden backdrop-blur-sm"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                    >
                        {/* Grid Overlay */}
                        <div className="absolute inset-0 opacity-5" 
                             style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
                        
                        {/* Rotating Rings */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="w-[75%] h-[75%] border border-white/10 rounded-full border-t-blue-500/30" 
                            />
                        </div>

                        <motion.img 
                            src={logo} 
                            alt="BiPSU Logo" 
                            className="relative z-10 w-40 md:w-56 object-contain filter drop-shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                        
                        <div className="absolute bottom-6 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                            <p className="text-[9px] font-bold text-blue-400 tracking-[0.2em] uppercase text-center">
                                Established Excellence
                            </p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default MissionandVision;