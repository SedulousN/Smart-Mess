import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import messMenuImage from "../assets/Mess-menu.jpg"; // Add your mess menu image here

const Dashboard = () => {
    const [mealType, setMealType] = useState("");
    const [rating, setRating] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [qrCode, setQrCode] = useState("");

    const checkTokenValidity = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp > currentTime) {
                    return decodedToken.studentID;
                }
            } catch (error) {
                console.error('Error decoding token:', error);
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
                .catch((error) => console.error('Error fetching QR code:', error));
        }

        const currentHour = new Date().getHours();
        if (currentHour >= 8 && currentHour < 12) {
            setMealType("Breakfast");
        } else if (currentHour >= 12 && currentHour < 17) {
            setMealType("Lunch");
        } else if (currentHour >= 17 && currentHour < 20) {
            setMealType("Snacks");
        } else {
            setMealType("Dinner");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        window.location.href = '/login';
    };

    const handleSubmitFeedback = () => {
        alert(`Thank you for rating ${mealType} as ${rating} stars!`);
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Left Section: Mess Menu Image */}
                <div className="col-md-4 text-center">
                    <img 
                        src={messMenuImage} 
                        alt="Mess Menu" 
                        className="img-fluid rounded shadow-lg"
                    />
                </div>

                {/* Right Section: Links */}
                <div className="col-md-8">
                    <h1 className="text-primary text-center mb-4">Smart Mess Dashboard</h1>

                    <div className="list-group">
                        <Link to="/profile" className="list-group-item list-group-item-action">Profile</Link>
                        <Link to="/meal-calendar" className="list-group-item list-group-item-action">Meal Calendar</Link>
                        <Link to="/meal-history" className="list-group-item list-group-item-action">Meal History</Link>
                        <Link to="/mess-menu" className="list-group-item list-group-item-action">Mess Menu</Link>
                        <Link to="/notices" className="list-group-item list-group-item-action">Notices</Link>

                        {isLoggedIn ? (
                            <button
                                className="list-group-item list-group-item-action text-danger"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="list-group-item list-group-item-action">Login</Link>
                                <Link to="/register" className="list-group-item list-group-item-action">Register</Link>
                            </>
                        )}
                    </div>

                    {qrCode && (
                        <div className="mt-4 text-center">
                            <h2>Your QR Code</h2>
                            <img src={qrCode} alt="QR Code" className="img-thumbnail w-50" />
                        </div>
                    )}

                    <div className="mt-4 card p-4 text-center">
                        <h2>Rate Your {mealType}</h2>
                        <div className="d-flex justify-content-center mt-3">
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
                        <button
                            className="btn btn-primary mt-3"
                            onClick={handleSubmitFeedback}
                            disabled={rating === 0}
                        >
                            Submit Feedback
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
