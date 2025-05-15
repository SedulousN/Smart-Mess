import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

const QRScanner = () => {
    const [result, setResult] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(null); // Track success/failure for styling
    const videoRef = useRef(null);
    
    const scanningEnabledRef = useRef(true);
    const isProcessingRef = useRef(false);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();

        navigator.mediaDevices.enumerateDevices()
            .then((devices) => {
                const videoInputDevices = devices.filter(device => device.kind === "videoinput");
                if (videoInputDevices.length > 0) {
                    const selectedDeviceId = videoInputDevices[0].deviceId;
                    
                    codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
                        if (result && scanningEnabledRef.current && !isProcessingRef.current) {
                            scanningEnabledRef.current = false;
                            isProcessingRef.current = true;
                            setResult(result.text);
                            validateQRCode(result.text);
                        }
                    });
                }
            })
            .catch((err) => console.error("Error accessing camera:", err));

        return () => {
            codeReader.reset();
        };
    }, []); // Run only once on mount

    const validateQRCode = async (qrData) => {
        const studentID = qrData.split("-")[0];
        console.log(studentID);
    
        try {
            const response = await fetch("http://localhost:5500/api/qr/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentID }),
            });
            const data = await response.json();
    
            if (data.success) {
                playBeepSound(true); // Play success sound
                setIsSuccess(true);
            } else {
                playBeepSound(false); // Play error sound
                setIsSuccess(false);
            }
    
            setMessage(data.message);
    
            // Reset scanner after 3 seconds
            setTimeout(() => {
                scanningEnabledRef.current = true;
                isProcessingRef.current = false;
                setMessage("");
                setIsSuccess(null);
            }, 3000);
        } catch (error) {
            playBeepSound(false);
            setIsSuccess(false);
            setMessage("Validation failed!");
            console.error("API Error:", error);
        }
    };
    

    const playBeepSound = (success) => {
        const beepSound = new Audio(success ? "/sounds/success-beep.mp3" : "/sounds/error-beep.mp3");
        beepSound.play();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6 shadow-md">QR Code Scanner</h1>
                <video ref={videoRef} className="border-4 border-gray-300 rounded-lg shadow-md w-full h-64 object-cover mb-4"></video>
                <p className="mt-4 text-xl font-semibold text-gray-700">{result}</p>
                {message && (
                    <p className={`mt-2 text-lg ${isSuccess ? "text-green-500" : "text-red-500"}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default QRScanner;
