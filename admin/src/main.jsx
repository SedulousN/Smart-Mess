import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'bootstrap/dist/css/bootstrap.min.css';    // ✅ Bootstrap CSS next
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // ✅ Bootstrap JS next

import './index.css';                // ✅ Your custom CSS (if any) should come last
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
