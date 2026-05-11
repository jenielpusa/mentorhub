import React, { useContext } from "react";
import ResearchAnalytics from "../../components/DashboardComponent/AdminDashboard/ResearchAnalytics";
import StudentDashboard from "../../components/DashboardComponent/StudentDashboard/StudentMainDashboard";
import PanAdvice from "../../components/DashboardComponent/panelistandadviser";
import AdviserDashboard from "../../components/DashboardComponent/AdvicerDashboard/AdviserDashboard";
import { AuthContext } from "../../contexts/AuthContext";
import Instructor from "../../components/DashboardComponent/InstructorDashboard/InstructorDashboard";

const App = () => {
    const { role } = useContext(AuthContext);

    // Helper function para i-render ang tamang component base sa role
    const renderDashboard = () => {
        switch (role?.toLowerCase()) {
            case "admin":
                return <ResearchAnalytics />;
            case "student":
                return <StudentDashboard />;
            case "member":
                return <StudentDashboard />;
            case "adviser":
                return <AdviserDashboard />;
            case "instructor":
                return <Instructor />;
            case "panelist":
                return <PanAdvice />;
            default:
                return <div className="mt-10 text-center">Access Denied o Hindi Kilalang Role.</div>;
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden p-4 font-sans transition-colors duration-300 md:p-8">
            <div className="relative">{renderDashboard()}</div>
        </div>
    );
};

export default App;
