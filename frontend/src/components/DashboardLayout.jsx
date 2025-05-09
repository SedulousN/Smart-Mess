import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

const DashboardLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <div className="container-fluid py-4">
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white">Navigation</div>
                        <div className="list-group list-group-flush">
                            <Link to="profile" className="list-group-item">👤 Profile</Link>
                            <Link to="meal-history" className="list-group-item">📅 Meal History</Link>
                            <Link to="mess-menu" className="list-group-item">🍽️ Mess Menu</Link>
                            <Link to="notices" className="list-group-item">📢 Notices</Link>
                            <button className="list-group-item list-group-item-danger text-center" onClick={handleLogout}>
                                🚪 Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="col-md-9">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
