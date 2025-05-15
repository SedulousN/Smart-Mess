// pages/AnnounceNotice.jsx
import React, { useState } from "react";
import axios from "axios";

const AnnounceNotice = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      return alert("Both fields are required.");
    }

    try {
      await axios.post("https://smart-mess-bcdl.onrender.com/api/notices", {
        title,
        message,
        timestamp: new Date().toISOString(),
      });
      alert("Notice announced successfully!");
      setTitle("");
      setMessage("");
    } catch (err) {
      console.error("Failed to post notice:", err);
      alert("Something went wrong.");
    }
  };

  return (
      <div className="container">
        <h2 className="text-center mb-4">📢 Announce a New Notice</h2>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-header bg-info text-white">New Notice</div>
              <div className="card-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Notice Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  className="form-control mb-3"
                  rows="5"
                  placeholder="Notice Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <button className="btn btn-success w-100" onClick={handleSubmit}>
                  Announce Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AnnounceNotice;
