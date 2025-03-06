import React from "react";

const history = [
    { date: "2024-03-01", meal: "Breakfast", status: "Claimed" },
    { date: "2024-03-01", meal: "Lunch", status: "Missed" },
    { date: "2024-03-01", meal: "Dinner", status: "Claimed" },
];

const MealHistory = () => {
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
                        {history.map((item, index) => (
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MealHistory;
