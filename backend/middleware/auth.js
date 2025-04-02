import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Please login again." });
    }

    try {
        req.user = jwt.verify(token, "your_secret_key");
        next();
    } catch {
        res.status(401).json({ success: false, message: "Invalid token. Please login again." });
    }
};

export default authMiddleware;
