import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminFeedback from './pages/AdminFeedback';
import UploadMenu from './pages/UploadMenu'; // We'll move your mess menu uploader into this
import MealData from './pages/MealData';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadMenu />} />
        <Route path="/admin/feedback" element={<AdminFeedback />} />
        <Route path="/admin/mealdata" element={<MealData />} />
      </Routes>
    </Router>
  );
}

export default App;
