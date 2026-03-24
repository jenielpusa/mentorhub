import { forwardRef, useContext, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { navbarLinks } from "@/constants";
import logoLight from "@/assets/logo-light.svg";
import logoDark from "@/assets/logo-dark.svg";
import { LogOut } from "lucide-react";
import { cn } from "@/utils/cn";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    const { logout, role } = useContext(AuthContext);

    // Define role permissions
    const rolePermissions = useMemo(
        () => ({
            admin: [
                "/",
                "/dashboard/Admin",
                "/dashboard/upload-manuscript",
                "/dashboard/archived",
                "/dashboard/student",
                "/dashboard/reports",
                "/dashboard/settings",
            ],
            student: [
                "/",
                "/dashboard/manuscript",
                "/dashboard/feedback",
                "/dashboard/schedule",
                "/dashboard/settings",
                "/dashboard/upload-manuscript",
            ],
            adviser: ["/", "/dashboard/upload-manuscript", "/dashboard/archived", "/dashboard/reports", "/dashboard/settings"],
            panelist: ["/", "/dashboard/message", "/dashboard/Defense-Schedule", "/dashboard/settings"],
            instructor: ["/", "/dashboard/format-guide", "/dashboard/Defense-Schedule", "/dashboard/settings", "/dashboard/advisees"],
        }),
        [],
    );

    // Filter navbar links based on user role
    const filteredNavLinks = useMemo(() => {
        if (!role) return []; // walang role, walang links

        const allowedPaths = rolePermissions[role] || [];
        return navbarLinks
            .map((group) => ({
                ...group,
                links: group.links.filter((link) => allowedPaths.includes(link.path)),
            }))
            .filter((group) => group.links.length > 0); // alisin ang grupo kung walang laman
    }, [role, rolePermissions]);

    return (
        <aside
            ref={ref}
            className={cn(
                // Base styles with CSS variables for theming
                "fixed z-[100] flex h-full flex-col overflow-x-hidden border-r",
                "bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] transition-all duration-300 ease-in-out",
                collapsed ? "w-[70px] items-center" : "w-[240px]",
                collapsed ? "max-md:-left-full" : "max-md:left-0",
                // Custom scrollbar (using arbitrary values for colors)
                "scrollbar-thin scrollbar-thumb-[var(--sidebar-accent)]/50 scrollbar-track-transparent",
            )}
            style={{
                "--sidebar-bg": "#0038A8",
                "--sidebar-text": "#f0f4ff",
                "--sidebar-accent": "#FFD700", // yellow
                "--sidebar-hover": "rgba(255, 215, 0, 0.15)",
                "--sidebar-active-bg": "#FFD700",
                "--sidebar-active-text": "#002B7F",
            }}
        >
            {/* Header with Logo */}
            <div
                className={cn("border-[var(--sidebar-accent)]/30 flex items-center border-b py-4", collapsed ? "justify-center px-2" : "gap-3 px-4")}
            >
                <img
                    src={logoLight}
                    alt="BiPSU Logo"
                    className="h-10 w-10 flex-shrink-0 object-contain"
                />
                {!collapsed && (
                    <p className="text-lg font-bold tracking-tight text-white">
                        BiPsu <span className="text-[var(--sidebar-accent)]">MentorHub</span>
                    </p>
                )}
            </div>

            {/* Navigation Links - filtered by role */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
                {filteredNavLinks.map((group) => (
                    <div
                        key={group.title}
                        className={cn("mb-6", collapsed ? "px-2" : "px-3")}
                    >
                        {!collapsed && (
                            <p className="text-[var(--sidebar-text)]/60 mb-2 px-3 text-xs font-semibold uppercase tracking-wider">{group.title}</p>
                        )}
                        <div className="space-y-1">
                            {group.links.map((link) => (
                                <NavLink
                                    key={link.label}
                                    to={link.path}
                                    title={collapsed ? link.label : undefined} // tooltip for collapsed mode
                                    className={({ isActive }) =>
                                        cn(
                                            "group relative flex items-center rounded-lg transition-all duration-200",
                                            "hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-accent)]",
                                            isActive
                                                ? "bg-[var(--sidebar-active-bg)] font-medium text-[var(--sidebar-active-text)] shadow-md"
                                                : "text-[var(--sidebar-text)]",
                                            collapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                                        )
                                    }
                                >
                                    <link.icon
                                        size={22}
                                        className={cn("flex-shrink-0 transition-transform group-hover:scale-110", collapsed && "mx-auto")}
                                    />
                                    {!collapsed && <span className="whitespace-nowrap">{link.label}</span>}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
                {/* Optional: kung walang laman ang filteredNavLinks, pwedeng magpakita ng placeholder */}
                {filteredNavLinks.length === 0 && (
                    <div className="px-4 py-6 text-center text-sm text-white/60">No available links for your role.</div>
                )}
            </div>

            {/* Logout Button */}
            <div className="border-[var(--sidebar-accent)]/30 border-t p-4">
                <button
                    onClick={logout}
                    className={cn(
                        "flex w-full items-center rounded-lg transition-colors duration-200",
                        "text-[var(--sidebar-text)]/80 hover:bg-red-500/20 hover:text-red-400",
                        collapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                    )}
                    title={collapsed ? "Logout" : undefined}
                >
                    <LogOut
                        size={20}
                        className="flex-shrink-0"
                    />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};
