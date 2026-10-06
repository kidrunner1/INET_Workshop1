const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                status: 401,
                message: "ไม่มีสิทธิ์เข้าถึงข้อมูล",
                data: null
            });
        }

        const [type, token] = authHeader.split(" ");

        if (type !== "Bearer" || !token) {
            return res.status(401).json({
                status: 401,
                message: "ไม่มีสิทธิ์เข้าถึงข้อมูล",
                data: null
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({
            status: 401,
            message: "เซสชันไม่ถูกต้องหรือหมดอายุแล้ว",
            data: null
        });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({
            status: 401,
            message: "สงวนสิทธิ์เฉพาะผู้ดูแลระบบเท่านั้น",
            data: null
        });
    }

    next();
}

module.exports = {
    authMiddleware,
    adminMiddleware
};