import { ChartColumn, Home, NotepadText, Package, PackagePlus, Settings, ShoppingBag, UserCheck, UserPlus, Users } from "lucide-react";

export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label: "Dashboard",
                icon: Home,
                path: "/",
            },
            {
                label: "Reports",
                icon: NotepadText,
                path: "/dashboard/reports",
            },
            {
                label: "Manuscript",
                icon: NotepadText,
                path: "/dashboard/manuscript",
            },
            {
                label: "Feedback",
                icon: NotepadText,
                path: "/dashboard/feedback",
            },
            {
                label: "Schedule",
                icon: NotepadText,
                path: "/dashboard/schedule",
            },
            {
                label: "Format & Guides",
                icon: NotepadText,
                path: "/dashboard/format-guide",
            },
            {
                label: "Defense Schedule",
                icon: NotepadText,
                path: "/dashboard/Defense-Schedule",
            },
            {
                label: "My Advisees",
                icon: NotepadText,
                path: "/dashboard/advisees",
            },
             {
                label: "Message",
                icon: NotepadText,
                path: "/dashboard/message",
            },
        ],
    },
    {
        title: "User Management",
        links: [
            {
                label: "Student Account",
                icon: Users,
                path: "/dashboard/student",
            },
            {
                label: "Accounts",
                icon: UserCheck,
                path: "/dashboard/Admin",
            },
        ],
    },
    {
        title: "Files",
        links: [
            {
                label: "Propose Title",
                icon: PackagePlus,
                path: "/dashboard/upload-manuscript",
            },
            {
                label: "Archived File",
                icon: ShoppingBag,
                path: "/dashboard/archived",
            },
        ],
    },
    {
        title: "Settings",
        links: [
            {
                label: "Settings",
                icon: Settings,
                path: "/dashboard/settings",
            },
        ],
    },
];
