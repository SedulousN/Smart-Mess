import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";
import DashboardHome from "../pages/DashboardHome";
import Profile from "../pages/Profile";
import MealCalendar from "../pages/MealCalendar";
import MealHistory from "../pages/MealHistory";
import MessMenu from "../pages/MessMenu";
import Notices from "../pages/Notices";
import Header from "../components/Header";
import Login from "../pages/Login";
import Register from "../pages/Register";

const AppRoutes = () => {
    return (
        <>
            <Header />
            <Routes>
                {/* Redirect root path to /dashboard */}
                <Route path="/dashboard" element={<Navigate to="/dashboard" replace />} />

                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Dashboard with Nested Routes */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="profile" element={<Profile />} />
                    {/* <Route path="meal-calendar" element={<MealCalendar />} /> */}
                    <Route path="meal-history" element={<MealHistory />} />
                    <Route path="mess-menu" element={<MessMenu />} />
                    <Route path="notices" element={<Notices />} />
                </Route>
            </Routes>
        </>
    );
};

export default AppRoutes;
