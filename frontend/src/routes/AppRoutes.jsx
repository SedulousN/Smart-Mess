import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Routes, Route } from "react-router-dom";   // ❌ Removed BrowserRouter here
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import MealCalendar from "../pages/MealCalendar";
import MealHistory from "../pages/MealHistory";
import MessMenu from "../pages/MessMenu";
import Notices from "../pages/Notices";
import Header from "../components/Header";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { Container } from 'react-bootstrap';  // Added Container for better layout

const AppRoutes = () => {
    return (
        <>
            <Header />
            <Container className="my-4">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    {/* <Route path="/meal-calendar" element={<MealCalendar />} /> */}
                    <Route path="/meal-history" element={<MealHistory />} />
                    <Route path="/mess-menu" element={<MessMenu />} />
                    <Route path="/notices" element={<Notices />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </Container>
        </>
    );
};

export default AppRoutes;
