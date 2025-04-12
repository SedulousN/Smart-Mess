import React, { useEffect, useState } from 'react';

const MessMenu = () => {
  const [menuUrl, setMenuUrl] = useState(null);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    const fileName = 'MessMenu'; // base name
    const possibleExtensions = ['pdf', 'jpg', 'jpeg', 'png'];

    // Try loading one of the possible files
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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Mess Menu</h1>
      {menuUrl ? (
        fileType === 'pdf' ? (
          <embed src={`${menuUrl}?t=${Date.now()}`} width="100%" height="600px" type="application/pdf" />
        ) : (
          <img src={`${menuUrl}?t=${Date.now()}`} alt="Mess Menu" className="w-full h-auto rounded-md shadow" />
        )
      ) : (
        <p>No mess menu uploaded yet.</p>
      )}
    </div>
  );
};

export default MessMenu;
