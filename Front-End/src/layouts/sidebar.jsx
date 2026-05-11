import { forwardRef, useContext, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { navbarLinks } from "@/constants";
import logoLight from "@/assets/bipsulogo.png";
import { LogOut } from "lucide-react";
import { cn } from "@/utils/cn";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    const { logout, role } = useContext(AuthContext);

    const rolePermissions = useMemo(() => ({
        admin: ["/", "/dashboard/Admin", "/dashboard/upload-manuscript", "/dashboard/archived", "/dashboard/student", "/dashboard/reports", "/dashboard/settings"],
        student: ["/", "/dashboard/manuscript", "/dashboard/feedback", "/dashboard/schedule", "/dashboard/settings", "/dashboard/upload-manuscript"],
        member: ["/", "/dashboard/manuscript", "/dashboard/feedback", "/dashboard/schedule", "/dashboard/settings"],
        adviser: ["/", "/dashboard/upload-manuscript", "/dashboard/archived", "/dashboard/reports", "/dashboard/settings"],
        panelist: ["/", "/dashboard/message", "/dashboard/Defense-Schedule", "/dashboard/settings"],
        instructor: ["/", "/dashboard/format-guide", "/dashboard/Defense-Schedule", "/dashboard/settings", "/dashboard/advisees"],
    }), []);

    const filteredNavLinks = useMemo(() => {
        if (!role) return [];
        const allowedPaths = rolePermissions[role] || [];
        return navbarLinks
            .map((group) => ({
                ...group,
                links: group.links.filter((link) => allowedPaths.includes(link.path)),
            }))
            .filter((group) => group.links.length > 0);
    }, [role, rolePermissions]);

    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-[100] flex h-screen flex-col border-r border-white/10 shadow-2xl transition-all duration-500 ease-in-out",
                "bg-[#002B7F] text-slate-100", 
                collapsed ? "w-[85px]" : "w-[260px]", 
                collapsed ? "max-md:-left-full" : "max-md:left-0"
            )}
        >
            {/* --- LOGO SECTION --- */}
            {/* Ang height ng div ay nagbabago mula h-20 (collapsed) patungong h-32 (expanded) */}
            <div className={cn(
                "flex items-center justify-center border-b border-white/5 transition-all duration-500 ease-in-out overflow-hidden",
                collapsed ? "h-20" : "h-36" 
            )}>
                <img 
                    src={logoLight} 
                    alt="Logo" 
                    className={cn(
                        "object-contain transition-all duration-500 ease-in-out",
                        collapsed ? "h-10 w-10" : "h-24 w-24" // Mula 40px lalakihan natin sa 96px (h-24)
                    )} 
                />
            </div>

            {/* --- NAVIGATION --- */}
            <nav className="flex-1 overflow-y-auto py-6 no-scrollbar">
                {filteredNavLinks.map((group) => (
                    <div key={group.title} className="mb-6">
                        {!collapsed && (
                            <p className="mb-3 px-6 text-[10px] font-bold uppercase tracking-[2px] text-white/30">
                                {group.title}
                            </p>
                        )}
                        
                        <div className="flex flex-col gap-2 px-2">
                            {group.links.map((link) => (
                                <NavLink
                                    key={link.label}
                                    to={link.path}
                                    className={({ isActive }) => cn(
                                        "group flex transition-all duration-300",
                                        collapsed 
                                            ? "flex-col items-center justify-center rounded-xl py-2 px-1 text-center" 
                                            : "flex-row items-center gap-4 rounded-xl px-4 py-3",
                                        isActive 
                                            ? "bg-yellow-400 text-[#002B7F] shadow-lg shadow-yellow-400/20" 
                                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                                    )}
                                >
                                    <link.icon size={collapsed ? 20 : 22} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
                                    
                                    <span className={cn(
                                        "font-medium transition-all duration-300",
                                        collapsed 
                                            ? "mt-1.5 text-[9px] uppercase tracking-tighter leading-none w-full break-words" 
                                            : "text-[14px]"
                                    )}>
                                        {link.label}
                                    </span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* --- LOGOUT --- */}
            <div className="p-3 border-t border-white/5 bg-black/10">
                <button
                    onClick={logout}
                    className={cn(
                        "group flex w-full transition-all duration-300",
                        collapsed 
                            ? "flex-col items-center justify-center py-2 text-red-400" 
                            : "flex-row items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-400",
                        "hover:bg-red-500/10 rounded-xl"
                    )}
                >
                    <LogOut size={20} className="shrink-0" />
                    <span className={cn(
                        "font-bold transition-all duration-300",
                        collapsed ? "mt-1 text-[9px] uppercase tracking-tighter" : "text-sm"
                    )}>
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";
Sidebar.propTypes = { collapsed: PropTypes.bool };