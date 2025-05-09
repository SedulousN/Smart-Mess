import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import UploadMenu from "./pages/UploadMenu";
import AdminFeedback from "./pages/AdminFeedback";
import MealData from "./pages/MealData";
import AnnounceNotice from "./pages/AnnounceNotice";
import MealSummary from "./pages/MealSummary";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to /admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Admin Routes with nested layout */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={
            <div className="text-center">
              <h2>Welcome to the Admin Dashboard</h2>
              <p>Select an option from the sidebar to manage the mess system.</p>
            </div>
          } />
          <Route path="upload-menu" element={<UploadMenu />} />
          <Route path="/admin/announce-notice" element={<AnnounceNotice />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="meal-summary" element={<MealSummary />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
