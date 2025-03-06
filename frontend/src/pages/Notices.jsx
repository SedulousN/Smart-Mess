import React from "react";

const notices = [
    { date: "2024-03-04", message: "Special meal on Friday for Holi!" },
    { date: "2024-03-02", message: "Mess closed on Sunday for maintenance." },
];

const Notices = () => {
    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-4">Notices</h1>
            <ul className="space-y-3">
                {notices.map((notice, index) => (
                    <li key={index} className="p-3 bg-gray-100 rounded-lg shadow-sm">
                        <strong>{notice.date}</strong>: {notice.message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notices;
