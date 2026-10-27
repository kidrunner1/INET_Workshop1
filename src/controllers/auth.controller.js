const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { username, password, firstName, lastName, email, phone } = req.body;
        // Wait for unique indexes before accepting a new account.
        await User.init();
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            const field = existingUser.username === username ? "username" : "email";
            const message = field === "username" ? "ชื่อผู้ใช้นี้มีผู้ใช้งานแล้ว" : "อีเมลนี้มีผู้ใช้งานแล้ว";
            return res.status(409).json({
                status: 409, message, data: [{ field: "body." + field, message }],
            });
        }
        const user = await User.create({
            username, firstName, lastName, email, phone: phone || undefined,
            password: await bcrypt.hash(password, 10),
            role: "user", status: "pending",
        });
        return res.status(201).json({
            status: 201, message: "สมัครสมาชิกสำเร็จ กรุณารอแอดมินอนุมัติบัญชี",
            data: {
                _id: user._id, username: user.username,
                firstName: user.firstName, lastName: user.lastName,
                email: user.email, phone: user.phone,
                role: user.role, status: user.status,
                createdAt: user.createdAt, updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            const field = error.keyPattern?.email ? "email" : "username";
            const message = field === "email" ? "อีเมลนี้มีผู้ใช้งานแล้ว" : "ชื่อผู้ใช้นี้มีผู้ใช้งานแล้ว";
            return res.status(409).json({
                status: 409, message, data: [{ field: "body." + field, message }],
            });
        }
        return res.status(500).json({
            status: 500, message: "เกิดข้อผิดพลาดในการสร้างผู้ใช้งาน กรุณาลองอีกครั้ง", data: null,
        });
    }
};

const LoginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: 400,
                message: "Username และ Password ต้องไม่ว่าง",
                data: null
            });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({
                status: 400,
                message: "ชื่อผู้ใช้ หรือ รหัสผ่าน ไม่ถูกต้อง",
                data: null
            })
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );
        if (!isPasswordValid) {
            return res.status(400).json({
                status: 400,
                message: "ชื่อผู้ใช้ หรือ รหัสผ่าน ไม่ถูกต้อง",
                data: null
            });
        }

        if (user.status !== "approved") {
            return res.status(401).json({
                status: 401,
                message: "ชื่อผู้ใช้นี้ยังไม่ได้รับการยืนยัน",
                data: null
            });
        }
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            status: 200,
            message: "สำเร็จ",
            data: {
                token,
                user: {
                    _id: user._id,
                    username: user.username, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone,
                    role: user.role,
                    status: user.status
                }
            }
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: 500,
            message: "เกิดข้อผิดพลาดในส่วนของเซิฟเวอร์",
            data: null
        });
    }
};


module.exports = {
    registerUser,
    LoginUser
}
