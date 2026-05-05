import { useTheme } from "@/hooks/use-theme";
import { Bell, Menu, X, Moon, Sun } from "lucide-react";
import PropTypes from "prop-types";

export const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex items-center gap-x-4">
                {/* Collapse/Menu Toggle */}
                <button
                    className="flex size-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label="Toggle Sidebar"
                >
                    {collapsed ? (
                        <Menu size={24} className="transition-all" />
                    ) : (
                        <X size={24} className="transition-all" />
                    )}
                </button>
                
                {/* Opsyonal: Lagyan ng Dashboard Title o Brand dito */}
                <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Dashboard
                </h1>
            </div>

            <div className="flex items-center gap-x-2">
                {/* Theme Toggle */}
                <button
                    className="flex size-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    title="Palitan ang Tema"
                >
                    <Sun size={20} className="dark:hidden" />
                    <Moon size={20} className="hidden dark:block" />
                </button>

                {/* Notifications */}
                <button className="relative flex size-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                    <Bell size={20} />
                    <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900"></span>
                </button>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};