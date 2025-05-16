import { useEffect, useState } from "react";
import axios from "axios";
// import '../AdminFeedback.css'; // Optional for custom styling

const AdminFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        axios.get("https://smart-mess-bcdl.onrender.com/api/feedback")
            .then(res => setFeedbacks(res.data))
            .catch(err => {
                console.error("Failed to fetch feedbacks:", err);
            });
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">All Student Feedback</h2>

            <div className="row">
                {feedbacks.length === 0 ? (
                    <p className="text-muted text-center">No feedback submitted yet.</p>
                ) : (
                    feedbacks.map((fb) => (
                        <div key={fb._id} className="col-md-6 mb-4">
                            <div className="card shadow">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        Meal: <strong>{fb.mealType}</strong>
                                    </h5>
                                    <h6 className="card-subtitle mb-2 text-muted">
                                        Student ID: {fb.studentID}
                                    </h6>
                                    <p className="mb-2">
                                        Rating:{" "}
                                        {[...Array(fb.rating)].map((_, i) => (
                                            <span key={i} style={{ color: "#f5c518" }}>★</span>
                                        ))}
                                        {[...Array(5 - fb.rating)].map((_, i) => (
                                            <span key={i} style={{ color: "#ccc" }}>★</span>
                                        ))}
                                    </p>
                                    <p className="card-text">"{fb.message}"</p>
                                    <small className="text-muted">
                                        {new Date(fb.timestamp).toLocaleString()}
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminFeedback;
