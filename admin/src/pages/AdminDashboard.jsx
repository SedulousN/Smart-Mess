import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-light p-4 min-vh-100">
          <h5 className="text-center mb-4">Admin Panel</h5>
          <ul className="nav">
            <li className="nav-item mb-3">
              <Link to="upload-menu" className="nav-link btn btn-outline-primary w-100">
                📁 Upload Menu
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link to="announce-notice" className="nav-link btn btn-outline-info w-100">
                📢 Announce Notice
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link to="feedback" className="nav-link btn btn-outline-success w-100">
                📝 View Feedback
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link to="meal-summary" className="nav-link btn btn-outline-warning w-100">
                🍽️ Meal Summary
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content - Dynamic via Outlet */}
        <div className="col-md-9 col-lg-10 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
