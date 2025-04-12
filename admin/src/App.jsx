import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminFeedback from './pages/AdminFeedback';
import UploadMenu from './pages/UploadMenu'; // We'll move your mess menu uploader into this

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadMenu />} />
        <Route path="/admin/feedback" element={<AdminFeedback />} />
      </Routes>
    </Router>
  );
}

export default App;
