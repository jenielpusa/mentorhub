import React, { useRef } from "react";
import logo from "../../../assets/bipsulogo.png";
import { Mail, Phone, MapPin, Globe, ExternalLink, ArrowUp, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";

const FooterQuickAccess = ({ onNavigateToSection }) => {
    const bipsulinks = [
        { name: "BiPSU Official Website", url: "https://bipsu.edu.ph" },
        { name: "CHED Portal", url: "https://ched.gov.ph" },
        { name: "DOST Research", url: "https://www.dost.gov.ph" },
        { name: "PhilGEPS", url: "https://www.philgeps.gov.ph" },
        { name: "GOV.PH", url: "https://www.gov.ph" },
    ];

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const top = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: "smooth" });
        }
    };

    const handleNavigate = (pageId) => {
        if (onNavigateToSection) {
            onNavigateToSection(pageId);
            return;
        }
        scrollToSection(pageId);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const socialLinks = [
        { icon: Facebook, url: "https://facebook.com/bipsu", label: "Facebook" },
        { icon: Twitter, url: "https://twitter.com/bipsu", label: "Twitter" },
        { icon: Linkedin, url: "https://linkedin.com/school/bipsu", label: "LinkedIn" },
        { icon: Youtube, url: "https://youtube.com/bipsu", label: "YouTube" },
    ];

    return (
        <footer className="relative bg-slate-950 border-t border-slate-800 pt-16 pb-8 text-slate-300">
            
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div 
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59,130,246,0.15) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                
                {/* Main Footer Grid - Simplified */}
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
                    
                    {/* Brand Section - 4 columns */}
                    <div className="lg:col-span-4 space-y-5">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="BiPSU Logo" className="h-12 w-12 object-contain" />
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    Mentor<span className="text-blue-500">Hub</span>
                                </h3>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                    BiPSU Research Portal
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            The official digital repository and management system for Biliran Island State University's research manuscripts and intellectual properties.
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex gap-3 pt-2">
                            {socialLinks.map((social, idx) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={idx}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg bg-slate-800/50 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 transition-all duration-300 hover:scale-105"
                                        aria-label={social.label}
                                    >
                                        <Icon size={18} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links - 2 columns */}
                    <div className="lg:col-span-2">
                        <h4 className="mb-5 text-xs font-bold uppercase tracking-wider text-blue-500">
                            Navigation
                        </h4>
                        <ul className="space-y-3">
                            {["Home", "About Us", "Departments", "Research Hub"].map((item, idx) => (
                                <li key={idx}>
                                    <button 
                                        onClick={() => handleNavigate(item.toLowerCase().replace(" ", ""))}
                                        className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-blue-500 transition-colors" />
                                        {item}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info - 3 columns */}
                    <div className="lg:col-span-3">
                        <h4 className="mb-5 text-xs font-bold uppercase tracking-wider text-blue-500">
                            Contact
                        </h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-start gap-3 hover:text-slate-300 transition-colors">
                                <MapPin size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                <span>P.I. Garcia St., Naval, Biliran, 6560</span>
                            </li>
                            <li className="flex items-center gap-3 hover:text-slate-300 transition-colors">
                                <Phone size={16} className="text-blue-500 shrink-0" />
                                <span>(053) 500-9035</span>
                            </li>
                            <li className="flex items-center gap-3 hover:text-slate-300 transition-colors">
                                <Mail size={16} className="text-blue-500 shrink-0" />
                                <span>research@bipsu.edu.ph</span>
                            </li>
                        </ul>
                    </div>

                    {/* Resources - 3 columns */}
                    <div className="lg:col-span-3">
                        <h4 className="mb-5 text-xs font-bold uppercase tracking-wider text-blue-500">
                            Resources
                        </h4>
                        <ul className="space-y-2">
                            {bipsulinks.slice(0, 4).map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-slate-400 hover:text-blue-400 flex items-center gap-2 group transition-colors duration-200"
                                    >
                                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar - Minimal */}
                <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <p className="text-slate-500">
                            © {new Date().getFullYear()} Biliran Island State University
                        </p>
                        <p className="text-slate-600 text-[10px]">
                            Capstone Project | Version 2.0
                        </p>
                    </div>
                    
                    <div className="flex gap-6">
                        <span className="text-slate-600 hover:text-blue-500 cursor-pointer transition-colors text-[10px] uppercase tracking-wider">
                            Privacy
                        </span>
                        <span className="text-slate-600 hover:text-blue-500 cursor-pointer transition-colors text-[10px] uppercase tracking-wider">
                            Terms
                        </span>
                        <span className="text-slate-600 hover:text-blue-500 cursor-pointer transition-colors text-[10px] uppercase tracking-wider">
                            Ethics
                        </span>
                    </div>
                </div>
            </div>

            {/* Modern Scroll to Top */}
            <button
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 p-2.5 rounded-full bg-blue-600/90 backdrop-blur-sm text-white shadow-lg hover:shadow-blue-600/30 transition-all duration-300 hover:scale-110 hover:bg-blue-700 z-50"
                aria-label="Scroll to top"
            >
                <ArrowUp size={18} />
            </button>
        </footer>
    );
};

export default FooterQuickAccess;