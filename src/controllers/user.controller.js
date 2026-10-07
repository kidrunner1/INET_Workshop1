const mongoose = require("mongoose");
const User = require("../models/user.model");

const approveUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 400,
                message: "รหัสผู้ใช้งานไม่ถูกต้อง",
                data: null
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({
                status: 400,
                message: "ไม่พบผู้ใช้งานนี้",
                data: null
            });
        }

        if (user.status === "approved") {
            return res.status(400).json({
                status: 400,
                message: "ผู้ใช้งานถูกอนุมัติไปแล้ว",
                data: null
            });
        }

        user.status = "approved";

        await user.save();

        return res.status(200).json({
            status: 200,
            message: "ผู้ใช้งานได้รับการอนุมัติเรียบร้อยแล้ว",
            data: {
                _id: user._id,
                username: user.username,
                role: user.role,
                status: user.status,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: 500,
            message: "ขออภัย ระบบขัดข้องชั่วคราว กรุณาทำรายการใหม่อีกครั้ง",
            data: null
        });
    }
};

module.exports = {
    approveUser
};