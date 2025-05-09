import React, { useEffect, useState } from "react";
import axios from "axios";

const Notices = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5500/api/notices")
      .then((res) => {
        setNotices(res.data);
      })
      .catch((err) => {
        console.error("Error fetching notices:", err);
      });
  }, []);

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4 display-6">📢 Notices</h2>
          {notices.length === 0 ? (
            <p className="text-muted">No current notices available.</p>
          ) : (
            <ul className="list-group">
              {notices.map((notice, index) => (
                <li key={index} className="list-group-item">
                  <strong>{new Date(notice.timestamp).toLocaleDateString()}</strong>: {notice.title} — {notice.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notices;
