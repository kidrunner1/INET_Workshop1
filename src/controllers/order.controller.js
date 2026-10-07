const Order = require("../models/order.model");
const mongoose = require("mongoose");
const Product = require("../models/product.model");

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();

        return res.status(200).json({
            status: 200,
            message: "สำเร็จ",
            data: orders
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


const getProductOrders = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 400,
                message: "ไม่พบสินค้า",
                data: null
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(400).json({
                status: 400,
                message: "ไม่พบสินค้า",
                data: null
            });
        }

        const orders = await Order.find({
            productId: id
        });

        return res.status(200).json({
            status: 200,
            message: "สำเร็จ",
            data: orders
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

const createProductOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 400,
                message: "ไม่พบสินค้า",
                data: null
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(400).json({
                status: 400,
                message: "ไม่พบสินค้า",
                data: null
            });
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                status: 400,
                message: "• กรุณาระบุจำนวนสินค้าให้ถูกต้อง",
                data: null
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                status: 400,
                message: "จำนวนสินค้าไม่เพียงพอ",
                data: null
            });
        }

        const totalPrice = product.price * quantity;

        const order = await Order.create({
            productId: product._id,
            name: product.name,
            quantity,
            price: product.price,
            totalPrice
        });

        product.stock = product.stock - quantity;

        await product.save();

        return res.status(201).json({
            status: 201,
            message: "สร้างรายการสำเร็จ",
            data: order
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
    getOrders,
    getProductOrders,
    createProductOrder
};