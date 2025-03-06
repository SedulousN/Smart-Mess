import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import MealCalendar from "../pages/MealCalendar";
import MealHistory from "../pages/MealHistory";
import MessMenu from "../pages/MessMenu";
import Notices from "../pages/Notices";
import Header from "../components/Header";

const AppRoutes = () => {
    return (
        <Router>
            <Header /> {/* Always present on all pages */}
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/meal-calendar" element={<MealCalendar />} />
                <Route path="/meal-history" element={<MealHistory />} />
                <Route path="/mess-menu" element={<MessMenu />} />
                <Route path="/notices" element={<Notices />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
