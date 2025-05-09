// components/AdminLayout.jsx
import React from "react";
import { Link } from "react-router-dom";

const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div className="bg-light p-3 border-end" style={{ width: "250px" }}>
        <h5>Admin Panel</h5>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/admin/upload-menu" className="nav-link">📁 Upload Menu</Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/announce-notice" className="nav-link">📢 Announce Notice</Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/feedback" className="nav-link">📝 View Feedback</Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/meal-summary" className="nav-link">🍽️ View Meal Summary</Link>
          </li>
        </ul>
      </div>

      <div className="flex-grow-1 p-4 bg-light">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
