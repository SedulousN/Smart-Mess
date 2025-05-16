
# 🍽️ Smart Mess Management System

An automated system that streamlines mess operations in educational institutions using QR code scanning, real-time analytics, and an interactive dashboard. Built with React.js, Node.js, Express, and MongoDB.

---

## 🚀 Features

- 🔍 **QR Code-based Meal Claiming**  
  Students can scan personalized QR codes to claim their meals securely and quickly.

- 📊 **Student Dashboard**  
  View personal profile, mess menu, meal calendar, meal history, and notices from a centralized dashboard.

- ✅ **Real-Time Meal Validation**  
  Backend checks if the student has already claimed a meal, preventing duplicate entries.

- 🗓️ **Meal Calendar**  
  Visual representation of weekly meals with real-time claim tracking (✔️ for claimed, ❌ for missed).

- 🍱 **Live Menu & Notices**  
  Display current and upcoming mess menus and admin announcements.

- ⭐ **Feedback System**  
  Students can rate their current meal based on time slots (Breakfast, Lunch, Snacks, Dinner).

---

## 🛠️ Tech Stack

| Frontend | Backend       | Database | Others           |
|----------|---------------|----------|------------------|
| React.js | Node.js       | MongoDB  | TailwindCSS      |
| Vite     | Express.js    | Mongoose | QR Code (`qrcode` package) |
| React Router | Body-parser |         | ZXing QR Scanner |

---

## 📁 Folder Structure

```
smart-mess-management/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── qrcodes/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── MealCalendar.jsx
│   │   │   ├── MealHistory.jsx
│   │   │   ├── MessMenu.jsx
│   │   │   └── Notices.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── tailwind.config.js
│
└── README.md
```

---

## ⚙️ Installation

### Prerequisites

- Node.js
- MongoDB

### Backend Setup

```bash
cd backend
npm install
node server.js
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Make sure your MongoDB server is running and update the MongoDB URI in the backend if needed.

---

## 🔐 Login/Signup

- Students can sign up using their roll number.
- Upon login, a QR code is generated for meal scanning.
- Admins can view meal data and update menus/notices (admin panel can be added in future iterations).

---

## 📦 API Endpoints (Sample)

| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| POST   | `/api/qr/generate`     | Generate QR code for student    |
| POST   | `/api/qr/validate`     | Validate scanned QR             |
| GET    | `/api/meal/calendar`   | Fetch weekly meal calendar      |
| POST   | `/api/feedback/submit` | Submit meal feedback            |

---

## 📸 Screenshots

_Screenshots of our dashboard, calendar and notices view here._

![image](https://github.com/user-attachments/assets/30461e54-c407-4f2a-bd1d-4a11128791ee)
![image](https://github.com/user-attachments/assets/42345e0f-60cf-4b75-9695-ec30a1e78547)
![image](https://github.com/user-attachments/assets/445dd1cd-c39a-4bd2-92b7-d29e768d813d)




---

## 🙌 Contributors

- Nitin Kumar Singh(https://github.com/SedulousN)
- Shreyansh Goyal(https://github.com/shreyansh-1911)

---

## 📃 License

This project is licensed under the MIT License.
