import React from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const meals = ["Breakfast", "Lunch", "Snacks", "Dinner"];

const MealCalendar = () => {
    const mealStatus = {
        Monday: { Breakfast: true, Lunch: false, Snacks: true, Dinner: false },
        Tuesday: { Breakfast: false, Lunch: false, Snacks: false, Dinner: false },
        Wednesday: { Breakfast: false, Lunch: false, Snacks: false, Dinner: false },
        Thrusday: { Breakfast: false, Lunch: false, Snacks: false, Dinner: false },
        Friday: { Breakfast: false, Lunch: false, Snacks: false, Dinner: false },
        Saturday: { Breakfast: false, Lunch: false, Snacks: false, Dinner: false },
        Sunday: { Breakfast: false, Lunch: true, Snacks: false, Dinner: false }
        // Add more data for remaining days...
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-4">Meal Calendar</h1>
            <div className="grid grid-cols-5 gap-4">
                <div></div> {/* Empty space for alignment */}
                {meals.map((meal) => (
                    <div key={meal} className="text-center font-bold">{meal}</div>
                ))}
                {days.map((day) => (
                    <>
                        <div key={day} className="font-semibold">{day}</div>
                        {meals.map((meal) => (
                            <div
                                key={`${day}-${meal}`}
                                className={`p-2 rounded-lg text-center ${
                                    mealStatus[day]?.[meal] ? "bg-green-500" : "bg-red-500"
                                } text-white`}
                            >
                                {mealStatus[day]?.[meal] ? "✔" : "✘"}
                            </div>
                        ))}
                    </>
                ))}
            </div>
        </div>
    );
};

export default MealCalendar;
