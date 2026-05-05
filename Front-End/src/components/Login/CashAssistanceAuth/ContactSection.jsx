import { motion } from "framer-motion";
import { 
    Phone, Mail, MapPin, Globe, Clock, 
    ShieldCheck, MessageSquare, Headphones, 
    Library, ChevronRight
} from "lucide-react";

const ContactSection = () => {
    const contactInfo = [
        {
            icon: Headphones,
            title: "Research Support",
            info: "(053) 500-9035",
            description: "Direct line to University Research Office",
            color: "from-blue-600 to-blue-800"
        },
        {
            icon: Mail,
            title: "Academic Email",
            info: "research@bipsu.edu.ph",
            description: "For manuscript & repository inquiries",
            color: "from-cyan-500 to-blue-600"
        },
        {
            icon: MapPin,
            title: "Main Campus",
            info: "Naval, Biliran Province",
            description: "P.I. Garcia St., Naval, Biliran",
            color: "from-blue-700 to-slate-900"
        },
        {
            icon: Globe,
            title: "BiPSU Portal",
            info: "www.bipsu.edu.ph",
            description: "Official University Website",
            color: "from-blue-500 to-cyan-400"
        }
    ];

    const academicOffices = [
        { office: "University Library", contact: "lib.support@bipsu.edu.ph", status: "Open" },
        { office: "Graduate School Office", contact: "gradschool@bipsu.edu.ph", status: "By Appointment" },
        { office: "IT Services (MIS)", contact: "mis@bipsu.edu.ph", status: "24/7 Monitoring" },
        { office: "Intellectual Property Office", contact: "ipo@bipsu.edu.ph", status: "Active" }
    ];

    return (
        <section id="contact" className="relative overflow-hidden py-12 md:py-16 lg:py-20">
            {/* Minimalist Background Glows */}
            <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-blue-600/10 blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px] -z-10" />

            <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
                {/* Main Glass Container */}
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8 lg:rounded-[2.5rem]">
                    
                    {/* Header Section */}
                    <div className="mb-8 text-center md:mb-10 lg:mb-12">
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5"
                        >
                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400"></div>
                            <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-blue-300 sm:text-xs">Connect With Us</span>
                        </motion.div>
                        
                        <h2 className="mb-3 text-2xl font-black tracking-tighter text-white sm:text-3xl md:text-4xl lg:text-5xl">
                            Academic <span className="text-blue-500 italic">Support</span> Channels
                        </h2>
                        
                        <p className="mx-auto max-w-xl text-xs text-slate-400 font-medium sm:text-sm md:text-base">
                            Need help with your research manuscript? Our <span className="text-blue-400">MentorHub</span> technical team and research coordinators are here to assist you.
                        </p>
                    </div>

                    {/* Primary Contacts Grid */}
                    <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:mb-12 lg:grid-cols-4 lg:gap-6">
                        {contactInfo.map((contact, index) => (
                            <ModernContactCard key={index} contact={contact} index={index} />
                        ))}
                    </div>

                    {/* Secondary Info & Offices */}
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                        {/* University Offices List */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md md:p-6 lg:rounded-3xl"
                        >
                            <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-white md:text-lg">
                                <Library className="h-4 w-4 text-blue-400 md:h-5 md:w-5" /> University Offices
                            </h3>
                            <div className="space-y-2">
                                {academicOffices.map((office, idx) => (
                                    <div key={idx} className="flex items-center justify-between rounded-xl bg-white/5 p-3 transition-all hover:bg-blue-600/10 border border-transparent hover:border-blue-500/20 group sm:p-4">
                                        <div>
                                            <h4 className="text-xs font-bold text-white transition-colors group-hover:text-blue-400 sm:text-sm">{office.office}</h4>
                                            <p className="text-[0.6rem] text-slate-500 sm:text-xs">{office.contact}</p>
                                        </div>
                                        <span className="rounded-full bg-blue-600/20 border border-blue-500/30 px-2 py-0.5 text-[0.5rem] font-bold uppercase tracking-tight text-blue-300 sm:px-3 sm:py-1 sm:text-[0.6rem]">
                                            {office.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Info Cards Column */}
                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                            <InfoCard 
                                icon={Clock}
                                title="Office Hours"
                                description="Monday - Friday: 8:00 AM - 5:00 PM"
                                note="Online repository accessible 24/7"
                                color="from-blue-600 to-blue-900"
                            />
                            <InfoCard 
                                icon={ShieldCheck}
                                title="Data Security"
                                description="All research manuscripts are encrypted"
                                note="BiPSU Data Privacy Compliant"
                                color="from-slate-700 to-slate-900"
                            />
                            <InfoCard 
                                icon={MessageSquare}
                                title="Live Support"
                                description="Response time: Within 24 hours"
                                note="Available during regular business hours"
                                color="from-blue-500 to-cyan-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Sub-components
const ModernContactCard = ({ contact, index }) => {
    const Icon = contact.icon;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-500 hover:border-blue-500/50 sm:p-5 md:rounded-3xl"
        >
            <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${contact.color} p-2.5 shadow-lg group-hover:scale-110 transition-transform duration-500 sm:p-3`}>
                <Icon className="text-white" size={20} />
            </div>
            <h3 className="mb-1 text-sm font-bold text-white sm:text-base">{contact.title}</h3>
            <p className="mb-1 text-xs font-bold text-blue-400 break-words sm:text-sm">{contact.info}</p>
            <p className="text-[0.65rem] leading-snug text-slate-500 sm:text-xs">{contact.description}</p>
        </motion.div>
    );
};

const InfoCard = ({ icon: Icon, title, description, note, color }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-all hover:bg-white/10 sm:gap-4 sm:p-4 md:rounded-2xl"
    >
        <div className={`shrink-0 rounded-xl bg-gradient-to-r ${color} p-2.5 shadow-md transition-transform group-hover:rotate-6 sm:p-3`}>
            <Icon className="h-4 w-4 text-white sm:h-5 sm:w-5" />
        </div>
        <div>
            <h3 className="text-xs font-bold text-white sm:text-sm">{title}</h3>
            <p className="text-[0.65rem] text-slate-400 sm:text-xs">{description}</p>
            <p className="mt-0.5 text-[0.5rem] font-black uppercase tracking-widest text-blue-400/80 sm:text-[0.6rem]">{note}</p>
        </div>
        <ChevronRight className="ml-auto h-4 w-4 text-slate-700 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
    </motion.div>
);

export default ContactSection;