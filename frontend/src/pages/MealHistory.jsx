import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const MealHistory = () => {
    const [mealHistory, setMealHistory] = useState([]);
    const [loading, setLoading] = useState(true);  // To show a loading state while fetching

    useEffect(() => {
        const fetchMealHistory = async () => {
            const token = localStorage.getItem("token");
            
            if (token) {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken?.userId; // Extract userId from decoded token

                if (!userId) {
                    console.error("User ID not found in token");
                    return;
                }

                try {
                    const response = await axios.get('http://localhost:5500/api/qr/history', {
                        params: { userId: userId }  // Send the userId to the backend to fetch meal history
                    });
                    setMealHistory(response.data);
                } catch (error) {
                    console.error("Error fetching meal history:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                console.error("Token not found");
                setLoading(false);
            }
        };

        fetchMealHistory();
    }, []); // Empty dependency array to run once after the component mounts

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold mb-4">Loading Meal History...</h1>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-4">Meal History</h1>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Date</th>
                            <th className="border p-2">Meal</th>
                            <th className="border p-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mealHistory.length > 0 ? (
                            mealHistory.map((item, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border p-2">{item.date}</td>
                                    <td className="border p-2">{item.meal}</td>
                                    <td
                                        className={`border p-2 ${
                                            item.status === "Claimed" ? "text-green-500" : "text-red-500"
                                        }`}
                                    >
                                        {item.status}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center p-4">No meal history found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MealHistory;
