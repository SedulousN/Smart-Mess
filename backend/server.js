// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const qrRoutes = require('./routes/qrRoutes');

const app = express();
app.use(bodyParser.json());

// Enable CORS for all origins (or customize to only allow specific origins)
app.use(cors({
  origin: 'http://localhost:5173', // or use '*' to allow all origins
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/messDB')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


// Routes
app.use('/api/qr', qrRoutes);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
