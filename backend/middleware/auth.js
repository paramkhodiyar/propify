const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Not Authenticated!' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = payload.id;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token is not Valid!' });
    }
};

const authorizeRoles = (...roles) => {
    return async (req, res, next) => {
        try {
            if (!req.userId) {
                return res.status(401).json({ message: 'Not Authenticated!' });
            }

            const user = await prisma.user.findUnique({
                where: { id: req.userId },
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found!' });
            }

            if (!roles.includes(user.role)) {
                return res.status(403).json({ message: 'Access Denied! Insufficient Permissions.' });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error("Authorization Error:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
}

module.exports = { verifyToken, authorizeRoles };
