import { useEffect, useContext } from "react";
import socket from "./socket.js";
import { AuthContext } from "./contexts/AuthContext.jsx";
// Halimbawa: Dito nakatago ang 'students' state at 'setStudents' function
import { StudentContext } from "./contexts/StudentContext/StudentContext.jsx";
import { AdminDisplayContext } from "./contexts/AdminContext/AdminContext.jsx";

const SocketListener = () => {
    const { role, linkId } = useContext(AuthContext);
    const { setStudents } = useContext(StudentContext);
    const { setAdmins, FetchAdminData } = useContext(AdminDisplayContext);

    useEffect(() => {
        if (!linkId || !role) return;

        socket.emit("register-user", linkId, role);

        const handleStatusUpdate = (payload) => {
            console.log("⚡ Received Payload:", payload);

            // DITO ANG SOLUSYON PARA MAGBAGO ANG UI:
            if (setStudents) {
                setStudents((prevStudents) => {
                    // Hinahanap ang student sa array at pinapalitan ang statusAccount
                    return prevStudents.map((student) =>
                        student._id === payload.userId ? { ...student, statusAccount: payload.newStatus } : student,
                    );
                });

                console.log("✅ UI State Updated for:", payload.fullName);
            }
            // DITO ANG SOLUSYON PARA MAGBAGO ANG UI:
            if (setAdmins) {
                setAdmins((prevStudents) => {
                    // Hinahanap ang student sa array at pinapalitan ang statusAccount
                    return prevStudents.map((student) =>
                        student._id === payload.userId ? { ...student, statusAccount: payload.newStatus } : student,
                    );
                });

                console.log("✅ UI State Updated for:", payload.fullName);
            }
        };

        if (role === "admin") {
            socket.on("admin:account-status-updated", handleStatusUpdate);
        }

        return () => {
            socket.off("admin:account-status-updated", handleStatusUpdate);
        };
    }, [linkId, role, setStudents]); // Siguraduhin na kasama ang setStudents dito

    return null;
};

export default SocketListener;
