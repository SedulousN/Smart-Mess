import React from 'react';               // ✅ React imports first
import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';    // ✅ Bootstrap CSS next
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // ✅ Bootstrap JS next

import AppRoutes from './routes/AppRoutes';  // ✅ Component imports after Bootstrap
import { BrowserRouter } from 'react-router-dom';

import './index.css';                // ✅ Your custom CSS (if any) should come last

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

