import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "@/hooks/use-click-outside";
import { Sidebar } from "@/layouts/sidebar";
import { Header } from "@/layouts/header";
import { cn } from "@/utils/cn";
import { useRef, useState } from "react";
import BipsuLogo from "@/assets/bipsulogo.png"; 

const Layout = () => {
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    
    // Default: Naka-close (true) para sa lahat ng devices
    const [collapsed, setCollapsed] = useState(true);
    const sidebarRef = useRef(null);

    // Isasara lang ang sidebar sa mobile kapag nag-click sa labas
    useClickOutside([sidebarRef], () => {
        if (!isDesktopDevice && !collapsed) {
            setCollapsed(true);
        }
    });

    return (
        <div className="relative min-h-screen bg-slate-50 transition-colors dark:bg-slate-950 overflow-hidden font-sans">
            
            {/* WATERMARK: Sobrang subtle para hindi makagulo sa data */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
                <img 
                    src={BipsuLogo} 
                    alt="BiPSU Watermark" 
                    className="w-[600px] h-[600px] object-contain opacity-[0.03] grayscale"
                />
            </div>

            {/* MOBILE OVERLAY: Lalabas lang sa mobile view (max-md) */}
            <div className={cn(
                "fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
                collapsed ? "pointer-events-none opacity-0" : "opacity-100",
            )} />

            {/* SIDEBAR: Pass the collapsed state */}
            <Sidebar ref={sidebarRef} collapsed={collapsed} />

            {/* CONTENT WRAPPER */}
            <div className={cn(
                "relative z-20 transition-all duration-500 ease-in-out flex flex-col min-h-screen", 
                collapsed ? "md:ml-[85px]" : "md:ml-[260px]"
            )}>
                <Header
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm dark:bg-slate-900/80"
                />
                
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-[1600px] mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;