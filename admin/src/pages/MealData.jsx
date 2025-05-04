import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MealData = () => {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5500/api/admin/meal-summary');
        setSummary(res.data);
      } catch (error) {
        console.error('Error fetching meal data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Meal Summary</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Date</th>
            <th>Meal</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.meal}</td>
              <td>{entry.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MealData;
