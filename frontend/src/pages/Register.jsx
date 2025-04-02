import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [studentID, setStudentID] = useState('');
    const [qrCodePath, setQRCodePath] = useState(''); // Store QR code path
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5500/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, studentID }),
            });

            const data = await response.json();

            if (response.ok) {
                setQRCodePath(data.qrCodePath); // Store QR code path
                navigate('/login');
            } else {
                setErrorMessage(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setErrorMessage('Error during registration. Please try again.');
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Register</h2>
                {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}
                {qrCodePath && (
                    <div className="text-center my-3">
                        <img src={`http://localhost:5500${qrCodePath}`} alt="QR Code" width="150" />
                        <p>Scan this QR Code for identification</p>
                    </div>
                )}

                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label htmlFor="studentID" className="form-label">Student ID</label>
                        <input
                            type="text"
                            id="studentID"
                            className="form-control"
                            value={studentID}
                            onChange={(e) => setStudentID(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Register</button>
                </form>
                <div className="text-center mt-3">
                    <p className="mb-0">Already have an account? <Link to="/login" className="text-primary text-decoration-none">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
