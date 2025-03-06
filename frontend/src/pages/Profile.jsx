import React from "react";

const Profile = () => {
    const user = {
        name: "John Doe",
        rollNumber: "21BCS123",
        email: "johndoe@example.com",
        hostel: "A-Block",
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            <div className="space-y-3">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Roll Number:</strong> {user.rollNumber}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Hostel:</strong> {user.hostel}</p>
            </div>
            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">Logout</button>
        </div>
    );
};

export default Profile;
