import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const meals = ["Breakfast", "Lunch", "Snacks", "Dinner"];

const MealHistory = () => {
    const [mealHistory, setMealHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [weeksInMonth, setWeeksInMonth] = useState([]);
    const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

    // Generate weeks of a given month/year
    const generateWeeks = (month, year) => {
        const weeks = [];
        let start = new Date(year, month, 1);

        while (start.getMonth() === month) {
            const weekStart = new Date(start);
            const week = [];

            for (let i = 0; i < 7; i++) {
                const day = new Date(weekStart);
                day.setDate(start.getDate() + i);
                if (day.getMonth() !== month) break;
                week.push(day);
            }

            weeks.push(week);
            start.setDate(start.getDate() + 7);
        }

        return weeks;
    };

    useEffect(() => {
        const weeks = generateWeeks(selectedMonth, selectedYear);
        setWeeksInMonth(weeks);
        setSelectedWeekIndex(0); // Reset to first week when month/year changes
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        const fetchMealHistory = async () => {
            const token = localStorage.getItem("token");

            if (!token) return;

            const decodedToken = jwtDecode(token);
            const userId = decodedToken?.userId;
            if (!userId) return;

            try {
                const response = await axios.get("http://localhost:5500/api/qr/history", {
                    params: { userId }
                });
                setMealHistory(response.data || []);
            } catch (error) {
                console.error("Error fetching meal history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMealHistory();
    }, [selectedMonth, selectedYear]);

    const getMealStatus = (date, meal) => {
        const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const entry = mealHistory.find(m => m.date === dateStr && m.meal === meal);
        return entry ? entry.status : "Missed";
    };


    const currentWeek = weeksInMonth[selectedWeekIndex] || [];

    if (loading) return <div className="p-4 text-center"><div className="spinner-border" /></div>;

    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center fw-bold">Meal History - {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' })}</h2>

            <div className="row mb-4">
                <div className="col-md-4">
                    <label className="form-label">Month</label>
                    <select
                        className="form-select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i}>
                                {new Date(0, i).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <label className="form-label">Year</label>
                    <select
                        className="form-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        {[2023, 2024, 2025].map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <label className="form-label">Week</label>
                    <select
                        className="form-select"
                        value={selectedWeekIndex}
                        onChange={(e) => setSelectedWeekIndex(Number(e.target.value))}
                    >
                        {weeksInMonth.map((week, i) => (
                            <option key={i} value={i}>
                                Week {i + 1} ({week[0]?.toLocaleDateString()} - {week[week.length - 1]?.toLocaleDateString()})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered text-center align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Date</th>
                            {meals.map((meal, index) => (
                                <th key={index}>{meal}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentWeek.map((date, i) => (
                            <tr key={i}>
                                <th>
                                    {date.toLocaleDateString(undefined, {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "short"
                                    })}
                                </th>
                                {meals.map((meal, j) => {
                                    const status = getMealStatus(date, meal);
                                    const colorClass = status === "Claimed" ? "bg-success text-white" : "bg-danger text-white";
                                    return (
                                        <td key={j} className={colorClass}>
                                            {status}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MealHistory;
