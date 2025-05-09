import React, { useEffect, useState } from "react";
import axios from "axios";

const MealSummary = () => {
  const [groupedSummary, setGroupedSummary] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5500/api/admin/meal-summary")
      .then((res) => {
        const rawData = res.data;

        // Group by date
        const grouped = {};
        rawData.forEach(({ date, mealType, count }) => {
          if (!grouped[date]) {
            grouped[date] = {
              breakfast: 0,
              lunch: 0,
              snacks: 0,
              dinner: 0,
            };
          }
          grouped[date][mealType.toLowerCase()] = count;
        });

        setGroupedSummary(grouped);
      })
      .catch((err) => console.error("Meal summary fetch error:", err));
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🍽️ Meal Summary</h2>
      <div className="card shadow">
        <div className="card-body table-responsive">
          {Object.keys(groupedSummary).length === 0 ? (
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
                {Object.entries(groupedSummary).map(([date, meals], idx) => (
                  <tr key={idx}>
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
