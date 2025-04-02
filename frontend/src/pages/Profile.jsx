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
            console.log("Decoded Token:", decodedToken);  // 🔍 Check if `userId` exists
            const userId = decodedToken?.userId; // Ensure this matches your backend's JWT payload
    
            if (!userId) {
                console.error("User ID not found in token");
                return;
            }
    
            axios.get(`http://localhost:5500/api/users/${userId}`)
                .then(response => {
                    console.log("Profile Data:", response.data);  // 🔎 Check profile data
                    setUser(response.data);
                })
                .catch(error => console.error("Error fetching profile data:", error));
    
            axios.get(`http://localhost:5500/api/users/${userId}/qrcode`)
                .then(response => {
                    console.log("QR Code Data:", response.data);  // 🔎 Check QR Code path
                    setQrCode(response.data.qrCodePath);
                })
                .catch(error => console.error("Error fetching QR code:", error));
        }
    }, []);
    
    return (
        
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            <div className="space-y-3">
                <p><strong>Name:</strong> {user.username || "N/A"}</p>
                <p><strong>Roll Number:</strong> {user.studentID || "N/A"}</p>
                <p><strong>Email:</strong> {user.email || "N/A"}</p>
            </div>

            {qrCode && (
                <div className="mt-6 text-center">
                    <h2 className="text-2xl font-semibold text-gray-800">Your QR Code</h2>
                    <img 
                        src={`http://localhost:5500${qrCode}`}   // 👈 Corrected QR Code URL
                        alt="QR Code" 
                        className="mx-auto w-48 h-48 border-4 border-blue-500 rounded-lg"
                    />
                </div>
            )}

            <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default Profile;
