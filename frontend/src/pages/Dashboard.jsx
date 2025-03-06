import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Dashboard = () => {
    const [mealType, setMealType] = useState(""); // Determines which meal is currently active
    const [rating, setRating] = useState(0); // Stores user rating

    useEffect(() => {
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

    const handleSubmitFeedback = () => {
        alert(`Thank you for rating ${mealType} as ${rating} stars!`);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
                    Smart Mess Dashboard
                </h1>

                {/* Cards for Pages */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card title="Profile" link="/profile" />
                    <Card title="Meal Calendar" link="/meal-calendar" />
                    <Card title="Meal History" link="/meal-history" />
                    <Card title="Mess Menu" link="/mess-menu" />
                    <Card title="Notices" link="/notices" />
                </div>

                {/* Meal Feedback Form */}
                <div className="mt-12 bg-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-semibold text-gray-800">Rate Your {mealType}</h2>
                    <div className="flex justify-center mt-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                className={`text-3xl mx-2 ${star <= rating ? "text-yellow-500" : "text-gray-400"}`}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    <button
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        onClick={handleSubmitFeedback}
                        disabled={rating === 0}
                    >
                        Submit Feedback
                    </button>
                </div>
            </div>
        </div>
    );
};

// **Card Component for Each Page**
const Card = ({ title, link }) => (
    <Link to={link} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
        <h3 className="text-xl font-semibold text-gray-800 text-center">{title}</h3>
    </Link>
);

export default Dashboard;
