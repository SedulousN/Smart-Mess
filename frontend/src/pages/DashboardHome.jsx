import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const DashboardHome = () => {
  const [userGreeting, setUserGreeting] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [studentID, setStudentID] = useState(null);
  const [mealType, setMealType] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
        if (hour < 12) {
            setUserGreeting("Good Morning");
            setMealType("Breakfast");
        } else if (hour < 17) {
            setUserGreeting("Good Afternoon");
            setMealType("Lunch");
        } else if (hour < 20) {
            setUserGreeting("Good Evening");
            setMealType("Snacks");
        } else {
            setUserGreeting("Good Night");
            setMealType("Dinner");
        }

    // Decode token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded?.studentID || decoded?.userId;
        if (id) {
          setStudentID(id);
          fetchUserFeedback(id);
        }
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const fetchUserFeedback = (id) => {
    axios
      .get(`https://smart-mess-bcdl.onrender.com/api/feedback/${id}`)
      .then((res) => setFeedbacks(res.data.reverse())) // Assuming array is oldest-first
      .catch((err) => console.error("Failed to fetch feedback", err));
  };

  const handleSubmitFeedback = () => {
    if (!studentID || rating === 0 || message.trim() === "") {
      return alert("Please fill in all fields.");
    }

    axios
      .post("https://smart-mess-bcdl.onrender.com/api/feedback", {
        studentID,
        rating,
        message,
        mealType,
        timestamp: new Date().toISOString(),
      })
      .then(() => {
        alert("Thank you for your feedback!");
        setRating(0);
        setMessage("");
        fetchUserFeedback(studentID);
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
        alert("Submission failed. Please try again.");
      });
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title text-center">🎉 {userGreeting}, welcome to the Smart Mess Dashboard!</h2>
        <p className="text-center text-muted mb-4">We’d love to hear your thoughts about your experience.</p>

        {/* ⭐ Star Rating */}
        <div className="text-center mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`btn btn-sm mx-1 ${star <= rating ? "btn-warning" : "btn-outline-warning"}`}
              onClick={() => setRating(star)}
            >
              ★
            </button>
          ))}
        </div>

        {/* 📝 Message Input */}
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Write your feedback here..."
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="text-center mb-4">
          <button
            className="btn btn-success"
            disabled={rating === 0 || message.trim() === ""}
            onClick={handleSubmitFeedback}
          >
            Submit Feedback
          </button>
        </div>

        {/* 📋 Feedback History */}
        <h5 className="text-center mb-3">Your Previous Feedback</h5>
        {feedbacks.length === 0 ? (
          <p className="text-center text-muted">No feedback submitted yet.</p>
        ) : (
          <ul className="list-group">
            {feedbacks.map((fb, index) => (
              <li key={index} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>Rating:</strong>{" "}
                    {"★".repeat(fb.rating)}{" "}
                    {"☆".repeat(5 - fb.rating)}
                  </div>
                  <div className="text-muted small">
                    {new Date(fb.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="mt-2">{fb.message}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
