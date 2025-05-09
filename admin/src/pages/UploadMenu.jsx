import React, { useState } from "react";
import axios from "axios";

const UploadMenu = () => {
  const [menuFile, setMenuFile] = useState(null);

  const handleMenuUpload = async () => {
    if (!menuFile) return alert("Please select a file.");

    const formData = new FormData();
    formData.append("menu", menuFile);

    try {
      await axios.post("http://localhost:5500/api/upload-mess-menu", formData);
      alert("Menu uploaded successfully!");
      setMenuFile(null);
    } catch (err) {
      console.error("Menu upload error:", err);
      alert("Upload failed.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📁 Upload Mess Menu</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              Upload New Menu File
            </div>
            <div className="card-body">
              <input
                type="file"
                className="form-control mb-3"
                onChange={(e) => setMenuFile(e.target.files[0])}
              />
              <button className="btn btn-success w-100" onClick={handleMenuUpload}>
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMenu;
