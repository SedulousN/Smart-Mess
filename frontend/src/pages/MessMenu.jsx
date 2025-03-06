import React from "react";

const menu = {
    Monday: { Breakfast: "Poha", Lunch: "Dal-Rice", Snacks: "Samosa", Dinner: "Paneer Butter Masala" },
    Tuesday: { Breakfast: "Idli", Lunch: "Rajma-Chawal", Snacks: "Pakora", Dinner: "Veg Biryani" },
};

const MessMenu = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-4">Mess Menu</h1>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Day</th>
                            <th className="border p-2">Breakfast</th>
                            <th className="border p-2">Lunch</th>
                            <th className="border p-2">Snacks</th>
                            <th className="border p-2">Dinner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(menu).map(([day, meals]) => (
                            <tr key={day} className="text-center">
                                <td className="border p-2 font-bold">{day}</td>
                                <td className="border p-2">{meals.Breakfast}</td>
                                <td className="border p-2">{meals.Lunch}</td>
                                <td className="border p-2">{meals.Snacks}</td>
                                <td className="border p-2">{meals.Dinner}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MessMenu;
