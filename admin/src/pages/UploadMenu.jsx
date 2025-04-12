import { useEffect, useState } from 'react';
import axios from 'axios';

function UploadMenu() {
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [uploadedMenuUrl, setUploadedMenuUrl] = useState(null);
  const [fileType, setFileType] = useState(null);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setPreviewURL(URL.createObjectURL(uploadedFile));
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('menu', file);

    try {
      const res = await axios.post('http://localhost:5500/api/upload-mess-menu', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Mess menu uploaded successfully!');
      console.log(res.data);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Failed to upload mess menu.');
    }
  };

  useEffect(() => {
    const fileName = 'MessMenu';
    const extensions = ['pdf', 'jpg', 'jpeg', 'png'];

    const fetchFile = async () => {
      for (let ext of extensions) {
        const url = `http://localhost:5500/uploads/${fileName}.${ext}`;
        try {
          const res = await fetch(url, { method: 'HEAD' });
          if (res.ok) {
            setUploadedMenuUrl(`${url}?t=${Date.now()}`);
            setFileType(ext);
            break;
          }
        } catch (err) {
          console.error('Error checking file:', err);
        }
      }
    };

    fetchFile();
  }, []);

  return (
    <div className="App" style={{ display: 'flex', gap: '30px', padding: '40px' }}>
      {/* Left: Upload Form */}
      <div style={{ flex: 1 }}>
        <h2>Upload Mess Menu</h2>
        <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
        {previewURL && (
          <div style={{ marginTop: '20px' }}>
            {file?.type?.includes('pdf') ? (
              <embed src={previewURL} width="100%" height="400px" type="application/pdf" />
            ) : (
              <img src={previewURL} alt="Preview" style={{ maxWidth: '100%', height: 'auto' }} />
            )}
          </div>
        )}
        <button onClick={handleSubmit} style={{ marginTop: '20px' }}>
          Submit
        </button>
      </div>

      {/* Right: Current Menu Preview */}
      <div style={{ flex: 1 }}>
        <h3>Current Uploaded Menu</h3>
        {uploadedMenuUrl ? (
          fileType === 'pdf' ? (
            <embed src={uploadedMenuUrl} width="100%" height="400px" type="application/pdf" />
          ) : (
            <img src={uploadedMenuUrl} alt="Uploaded Menu" style={{ maxWidth: '100%', height: 'auto' }} />
          )
        ) : (
          <p>No menu uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default UploadMenu;
