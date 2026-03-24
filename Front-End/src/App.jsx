import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import AdminManagement from "./components/User/Admin/MainAdminManagement";
import StudentManagement from "./components/User/Student/StudentTable";
import ArchiveComponent from "./components/Archived/ArchivedMain";
import DocumentUpload from "./components/DocumentUpload/DocumentUpload";
import Login from "./components/Login/Login";
import ResetPassword from "./components/Login/ResetPassword";
import PublicRoute from "./components/PublicRoute/PublicRoute";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <Navigate
                    to="/login"
                    replace
                />
            ),
        },
        {
            element: <PublicRoute />,
            children: [
                { path: "login", element: <Login /> },
                { path: "reset-password/:token", element: <ResetPassword /> },
            ],
        },
        {
            element: <PublicRoute />,
            children: [
                { path: "login", element: <Login /> },
                { path: "reset-password/:token", element: <ResetPassword /> },
            ],
        },
        {
            element: <PrivateRoute />,
            children: [
                {
                    path: "dashboard",
                    element: <Layout />,
                    children: [
                        {
                            index: true,
                            element: <DashboardPage />,
                        },
                        {
                            path: "/dashboard/student",
                            element: <StudentManagement/>,
                        },

                        {
                            path: "/dashboard/manuscript",
                            element: <h1 className="title">Manuscript</h1>,
                        },
                        {
                            path: "/dashboard/feedback",
                            element: <h1 className="title">Feedback</h1>,
                        },
                        {
                            path: "/dashboard/message",
                            element: <h1 className="title">Message</h1>,
                        },
                        {
                            path: "/dashboard/schedule",
                            element: <h1 className="title">Schedule</h1>,
                        },
                        {
                            path: "new-customer",
                            element: <h1 className="title">New Customer</h1>,
                        },
                        {
                            path: "/dashboard/manuscript",
                            element: <h1 className="title">Manuscript</h1>,
                        },
                        {
                            path: "/dashboard/feedback",
                            element: <h1 className="title">Feedback</h1>,
                        },
                        {
                            path: "/dashboard/schedule",
                            element: <h1 className="title">Schedule</h1>,
                        },
                        {
                            path: "new-customer",
                            element: <h1 className="title">New Customer</h1>,
                        },
                        {
                            path: "Admin",
                            element: <AdminManagement />,
                        },
                        {
                            path: "products",
                            element: <h1 className="title">Products</h1>,
                        },
                        {
                            path: "/dashboard/format-guide",
                            element: <h1 className="title">Format & Guide</h1>,
                        },
                        {
                            path: "/dashboard/advisees",
                            element: <h1 className="title">advisees</h1>,
                        },
                        {
                            path: "/dashboard/Defense-Schedule",
                            element: <h1 className="title">advisees</h1>,
                        },

                        {
                            path: "upload-manuscript",
                            element: <DocumentUpload />,
                        },
                        {
                            path: "/dashboard/archived",
                            element: <ArchiveComponent />,
                        },
                        {
                            path: "settings",
                            element: <h1 className="title">Settings</h1>,
                        },
                    ],
                },
            ],
        },
        {
            path: "*",
            element: (
                <Navigate
                    to="/login"
                    replace
                />
            ),
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}
export default App;
