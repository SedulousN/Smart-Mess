import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ["#00C49F", "#FF8042"];
const TOTAL_STUDENTS = 100; // Update dynamically if needed

const MealSummary = () => {
  const [mealSummaries, setMealSummaries] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: 0,
    lunch: 0,
    snacks: 0,
    dinner: 0,
  });

  useEffect(() => {
    axios.get("http://localhost:5500/api/admin/meal-summary")
      .then((res) => {
        const summaries = {};

        res.data.forEach(({ date, mealType, count }) => {
          const type = mealType.toLowerCase();
          if (!summaries[date]) {
            summaries[date] = { breakfast: 0, lunch: 0, snacks: 0, dinner: 0 };
          }
          summaries[date][type] = count;
        });

        setMealSummaries(summaries);

        const firstDate = Object.keys(summaries)[0];
        if (firstDate) {
          setSelectedDate(firstDate);
          setSelectedMeals(summaries[firstDate]);
        }
      })
      .catch((err) => console.error("Meal summary fetch error:", err));
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedMeals(mealSummaries[date]);
  };

  const mealTypes = ["breakfast", "lunch", "snacks", "dinner"];

  const getPieData = (mealType) => {
    const consumed = selectedMeals[mealType] || 0;
    const remaining = Math.max(TOTAL_STUDENTS - consumed, 0);
    return [
      { name: "Consumed", value: consumed },
      { name: "Remaining", value: remaining }
    ];
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🍽️ Meal Summary</h2>

      {/* Pie Charts */}
      <div className="row">
        {mealTypes.map((type, idx) => (
          <div className="col-md-6 mb-4" key={idx}>
            <div className="card shadow">
              <div className="card-body">
                <h5 className="text-center text-capitalize">
                  {type} - {selectedDate || "No date selected"}
                </h5>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={getPieData(type)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {getPieData(type).map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card shadow">
        <div className="card-body table-responsive">
          {Object.keys(mealSummaries).length === 0 ? (
            <p className="text-center">No meal summary available.</p>
          ) : (
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Breakfast</th>
                  <th>Lunch</th>
                  <th>Snacks</th>
                  <th>Dinner</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(mealSummaries).map(([date, meals], idx) => (
                  <tr
                    key={idx}
                    onClick={() => handleDateSelect(date)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: selectedDate === date ? "#e9f5ff" : "transparent",
                    }}
                  >
                    <td>{date}</td>
                    <td>{meals.breakfast || 0}</td>
                    <td>{meals.lunch || 0}</td>
                    <td>{meals.snacks || 0}</td>
                    <td>{meals.dinner || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealSummary;
