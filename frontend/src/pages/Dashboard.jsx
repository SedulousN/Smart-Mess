import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import messMenuImage from "../assets/Mess-menu.jpg";

const Dashboard = () => {
    const [mealType, setMealType] = useState("");
    const [rating, setRating] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [qrCode, setQrCode] = useState("");
    const [userGreeting, setUserGreeting] = useState("");

    const checkTokenValidity = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp > currentTime) {
                    return decodedToken.studentID;
                }
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
        return null;
    };

    useEffect(() => {
        const studentID = checkTokenValidity();
        if (studentID) {
            setIsLoggedIn(true);
            axios.get(`/api/students/${studentID}/qrcode`)
                .then((response) => setQrCode(response.data.qrCodePath))
                .catch((error) => console.error("Error fetching QR code:", error));
        }

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
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        window.location.href = "/login";
    };

    const handleSubmitFeedback = () => {
        if (rating === 0 || feedbackMessage.trim() === "") {
            alert("Please select a rating and enter a message.");
            return;
        }

        const studentID = checkTokenValidity();
        axios.post("https://smart-mess-bcdl.onrender.com/api/feedback", {
            studentID,
            rating,
            message: feedbackMessage,
            mealType,
            timestamp: new Date().toISOString(),
        })
            .then(() => {
                alert("Thank you for your feedback!");
                setRating(0);
                setFeedbackMessage("");
            })
            .catch((error) => {
                console.error("Error submitting feedback:", error);
                alert("Failed to submit feedback. Please try again.");
            });
    };

    return (
        <div className="container py-5">
            <h1 className="text-center text-primary mb-4">Smart Mess Dashboard</h1>

            {isLoggedIn && (
                <h5 className="text-center text-secondary mb-4">{userGreeting}, welcome back!</h5>
            )}

            <div className="row">
                {/* Navigation Links */}
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white">
                            Navigation
                        </div>
                        <div className="list-group list-group-flush">
                            <Link to="/profile" className="list-group-item">👤 Profile</Link>
                            {/* <Link to="/meal-calendar" className="list-group-item">📖 Meal Calendar</Link> */}
                            <Link to="/meal-history" className="list-group-item">📅 Meal History</Link>
                            <Link to="/mess-menu" className="list-group-item">🍽️ Mess Menu</Link>
                            <Link to="/notices" className="list-group-item">📢 Notices</Link>

                            {isLoggedIn ? (
                                <button className="list-group-item list-group-item-danger text-center" onClick={handleLogout}>
                                    🚪 Logout
                                </button>
                            ) : (
                                <>
                                    <Link to="/login" className="list-group-item">🔐 Login</Link>
                                    <Link to="/register" className="list-group-item">📝 Register</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* QR Code & Feedback Section */}
                <div className="col-md-8">
                    {/* QR Code Card */}
                    {qrCode && (
                        <div className="card shadow-sm mb-4">
                            <div className="card-body text-center">
                                <h5 className="card-title">🎫 Your QR Code</h5>
                                <img src={qrCode} alt="QR Code" className="img-fluid rounded w-50 mt-3" />
                            </div>
                        </div>
                    )}

                    {/* Feedback Card */}
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-center mb-3">⭐ Rate Your {mealType}</h5>
                            <div className="d-flex justify-content-center mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        className={`btn btn-outline-warning mx-1 ${star <= rating ? "text-warning" : ""}`}
                                        onClick={() => setRating(star)}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            <textarea
                                className="form-control mb-3"
                                rows="3"
                                placeholder="Leave your feedback..."
                                value={feedbackMessage}
                                onChange={(e) => setFeedbackMessage(e.target.value)}
                            ></textarea>
                            <div className="text-center">
                                <button
                                    className="btn btn-success"
                                    disabled={rating === 0 || feedbackMessage.trim() === ""}
                                    onClick={handleSubmitFeedback}
                                >
                                    Submit Feedback
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
