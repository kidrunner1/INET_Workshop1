const Product = require("../models/product.model");
const mongoose = require("mongoose");

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        return res.status(200).json({
            status: 200,
            message: "สำเร็จ",
            data: products
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

const createProduct = async (req, res) => {
    try {
        const {
            name,
            price,
            stock,
            description
        } = req.body;

        if (!name || price === undefined || stock === undefined) {
            return res.status(400).json({
                status: 400,
                message: "name, price and stock are required",
                data: null
            });
        }

        if (typeof price !== "number" || price < 0) {
            return res.status(400).json({
                status: 400,
                message: "price must be a number and greater than or equal to 0",
                data: null
            });
        }

        if (!Number.isInteger(stock) || stock < 0) {
            return res.status(400).json({
                status: 400,
                message: "stock must be an integer and greater than or equal to 0",
                data: null
            });
        }

        const product = await Product.create({
            name,
            price,
            stock,
            description
        });

        return res.status(201).json({
            status: 201,
            message: "สร้างรายการสินค้าสำเร็จ",
            data: product
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

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 400,
                message: "ไม่พบสินค้า",
                data: null,
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

        return res.status(200).json({
            status: 200,
            message: "สำเร็จ",
            data: product
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({

            status: 500,
            message: "ขออภัย ระบบขัดข้องชั่วคราว กรุณาทำรายการใหม่อีกครั้ง",
            data: null
        });
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            price,
            stock,
            description
        } = req.body;

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

        if (
            !name ||
            price === undefined ||
            stock === undefined
        ) {
            return res.status(400).json({
                status: 400,
                message: "name, price and stock are required",
                data: null
            });
        }

        if (typeof price !== "number" || price < 0) {
            return res.status(400).json({
                status: 400,
                message: "price must be a number and greater than or equal to 0",
                data: null
            });
        }

        if (!Number.isInteger(stock) || stock < 0) {
            return res.status(400).json({
                status: 400,
                message: "stock must be an integer and greater than or equal to 0",
                data: null
            });
        }

        product.name = name;
        product.price = price;
        product.stock = stock;
        product.description = description ?? "";

        await product.save();

        return res.status(200).json({
            status: 200,
            message: "updated สำเร็จfully",
            data: product
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

const deleteProduct = async (req, res) => {
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

        await product.deleteOne();

        return res.status(200).json({
            status: 200,
            message: "deleted สำเร็จfully",
            data: product
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
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
};