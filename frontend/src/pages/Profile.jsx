import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
    const [user, setUser] = useState({});
    const [qrCode, setQrCode] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken?.userId;

            if (!userId) {
                console.error("User ID not found in token");
                return;
            }

            axios.get(`http://localhost:5500/api/users/${userId}`)
                .then(response => setUser(response.data))
                .catch(error => console.error("Error fetching profile data:", error));

            axios.get(`http://localhost:5500/api/users/${userId}/qrcode`)
                .then(response => setQrCode(response.data.qrCodePath))
                .catch(error => console.error("Error fetching QR code:", error));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-body">
                    <h1 className="card-title display-5 mb-4">Profile</h1>
                    <ul className="list-group list-group-flush mb-4">
                        <li className="list-group-item"><strong>Name:</strong> {user.username || "N/A"}</li>
                        <li className="list-group-item"><strong>Roll Number:</strong> {user.studentID || "N/A"}</li>
                        <li className="list-group-item"><strong>Email:</strong> {user.email || "N/A"}</li>
                    </ul>

                    {qrCode && (
                        <div className="text-center mt-4">
                            <h5 className="mb-3">Your QR Code</h5>
                            <img 
                                src={`http://localhost:5500${qrCode}`} 
                                alt="QR Code" 
                                className="img-thumbnail"
                                style={{ width: "200px", height: "200px" }}
                            />
                        </div>
                    )}

                    <div className="text-end mt-4">
                        <button 
                            className="btn btn-danger"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
