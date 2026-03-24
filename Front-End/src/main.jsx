import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { AdminDisplayProvider } from "./contexts/AdminContext/AdminContext.jsx";
import { DepartmentProvider } from "./contexts/DepartmentContext/DepartmentContext.jsx";
import { StudentProvider } from "./contexts/StudentContext/StudentContext.jsx";
import { DocumenProvider } from "./contexts/DocumentContext/DocumentContext.jsx";
import SocketListener from "./SocketListener";
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <DocumenProvider>
                <StudentProvider>
                    <DepartmentProvider>
                        <AdminDisplayProvider>
                            <App />
                            <SocketListener />
                        </AdminDisplayProvider>
                    </DepartmentProvider>
                </StudentProvider>
            </DocumenProvider>
        </AuthProvider>
    </StrictMode>,
);
