import React, { useEffect, useState } from 'react';

const MessMenu = () => {
  const [menuUrl, setMenuUrl] = useState(null);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    const fileName = 'MessMenu';
    const possibleExtensions = ['pdf', 'jpg', 'jpeg', 'png'];

    const checkFile = async () => {
      for (let ext of possibleExtensions) {
        const url = `http://localhost:5500/uploads/${fileName}.${ext}`;
        try {
          const res = await fetch(url, { method: 'HEAD' });
          if (res.ok) {
            setMenuUrl(url);
            setFileType(ext);
            break;
          }
        } catch (err) {
          console.error('Error checking file:', err);
        }
      }
    };

    checkFile();
  }, []);

  return (
    <div className="container my-4">
      <div className="card shadow">
        <div className="card-body text-center">
          <h2 className="card-title mb-4">📋 Mess Menu</h2>

          {menuUrl ? (
            fileType === 'pdf' ? (
              <div className="ratio ratio-4x3">
                <embed
                  src={`${menuUrl}?t=${Date.now()}`}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                />
              </div>
            ) : (
              <img
                src={`${menuUrl}?t=${Date.now()}`}
                alt="Mess Menu"
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: '900px' }}
              />
            )
          ) : (
            <p className="text-muted">No mess menu uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessMenu;
