import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "@/hooks/use-click-outside";
import { Sidebar } from "@/layouts/sidebar";
import { Header } from "@/layouts/header";
import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";

// Siguraduhing tama ang path ng logo mo sa assets folder
import BipsuLogo from "@/assets/bipsulogo.png"; 

const Layout = () => {
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const [collapsed, setCollapsed] = useState(!isDesktopDevice);
    const sidebarRef = useRef(null);

    useEffect(() => {
        setCollapsed(!isDesktopDevice);
    }, [isDesktopDevice]);

    useClickOutside([sidebarRef], () => {
        if (!isDesktopDevice && !collapsed) {
            setCollapsed(true);
        }
    });

    return (
        /* Original background color */
        <div className="relative min-h-screen bg-slate-200 transition-colors dark:bg-slate-950 overflow-hidden font-sans">
            
            {/* LAYER 1: MALAKING LOGO WATERMARK (Clear, No Blur layer on top) */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
                <img 
                    src={BipsuLogo} 
                    alt="BiPSU Watermark" 
                    className="w-[850px] h-[850px] object-contain opacity-10 grayscale brightness-100"
                />
            </div>

            {/* MOBILE OVERLAY */}
            <div className={cn(
                "pointer-events-none fixed inset-0 z-[60] bg-black opacity-0 transition-opacity",
                !collapsed && "max-md:pointer-events-auto max-md:opacity-30",
            )} />

            {/* SIDEBAR */}
            <Sidebar ref={sidebarRef} collapsed={collapsed} className="z-[70]" />

            {/* CONTENT WRAPPER */}
            <div className={cn(
                "relative z-20 transition-[margin] duration-300 flex flex-col min-h-screen", 
                collapsed ? "md:ml-[70px]" : "md:ml-[240px]"
            )}>
                {/* Header with Glassmorphism Effect */}
                <Header
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    className="sticky top-0 z-50 bg-white/40 backdrop-blur-md border-b border-white/20 shadow-sm"
                />
                
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6 custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;