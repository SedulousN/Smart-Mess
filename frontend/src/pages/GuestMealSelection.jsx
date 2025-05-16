import React, { useState, useEffect } from 'react';

const mealPrices = {
    Breakfast: 30,
    Lunch: 80,
    Snacks: 30,
    Dinner: 80
};

const GuestMealSelection = () => {
    const [selectedMeals, setSelectedMeals] = useState([]);
    const [qrCodePath, setQRCodePath] = useState('');
    const [error, setError] = useState('');
    const [isPaying, setIsPaying] = useState(false);
    const [total, setTotal] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState('');

    useEffect(() => {
        const sum = selectedMeals.reduce((acc, meal) => acc + mealPrices[meal], 0);
        setTotal(sum);
    }, [selectedMeals]);

    const handleCheckboxChange = (meal) => {
        setSelectedMeals((prev) =>
            prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
        );
    };

    const simulatePayment = () => {
        return new Promise((resolve) => {
            setPaymentStatus("Processing UPI Payment...");
            setTimeout(() => {
                resolve("Payment successful!");
            }, 2000); // simulate 2 seconds delay
        });
    };

    const handlePaymentAndGenerateQR = async () => {
        if (selectedMeals.length === 0) {
            setError("Please select at least one meal.");
            return;
        }

        setError('');
        setIsPaying(true);
        setQRCodePath('');
        setPaymentStatus('');

        try {
            const result = await simulatePayment();
            setPaymentStatus(result);

            // Generate QR
            const qrRes = await fetch('https://smart-mess-bcdl.onrender.com/api/guest/generate-qr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ meals: selectedMeals })
            });

            const qrData = await qrRes.json();

            if (qrRes.ok) {
                setQRCodePath(`https://smart-mess-bcdl.onrender.com${qrData.qrCodePath}`);
            } else {
                setError(qrData.message || "Failed to generate QR code.");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong.");
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Guest Meal Selection</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {paymentStatus && <div className="alert alert-info">{paymentStatus}</div>}

            <div className="form-check">
                {Object.keys(mealPrices).map((meal) => (
                    <div key={meal}>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id={meal}
                            checked={selectedMeals.includes(meal)}
                            onChange={() => handleCheckboxChange(meal)}
                        />
                        <label className="form-check-label" htmlFor={meal}>
                            {meal} - ₹{mealPrices[meal]}
                        </label>
                    </div>
                ))}
            </div>

            <h5 className="mt-3">Total: ₹{total}</h5>

            <button className="btn btn-success mt-3" onClick={handlePaymentAndGenerateQR} disabled={isPaying}>
                {isPaying ? 'Processing Payment...' : 'Pay & Get QR Code'}
            </button>

            {qrCodePath && (
                <div className="mt-4 text-center">
                    <img src={qrCodePath} alt="Guest QR Code" width="180" />
                    <p className="mt-2">Show this QR code at the mess counter</p>
                </div>
            )}
        </div>
    );
};

export default GuestMealSelection;
