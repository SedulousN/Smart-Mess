import { Link } from "react-router-dom";

const Header = () => {
    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-around">
            <Link to="/" className="hover:underline">Dashboard</Link>
            <Link to="/profile" className="hover:underline">Profile</Link>
            <Link to="/meal-calendar" className="hover:underline">Meal Calendar</Link>
            <Link to="/meal-history" className="hover:underline">Meal History</Link>
            <Link to="/mess-menu" className="hover:underline">Mess Menu</Link>
            <Link to="/notices" className="hover:underline">Notices</Link>
        </nav>
    );
};

export default Header;
