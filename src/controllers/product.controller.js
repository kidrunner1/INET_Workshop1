const Product = require("../models/product.model");
const mongoose = require("mongoose");

const getProducts = async (req, res) => {
    try {
        const {
            search = "",
            category = "",
            page = 1,
            limit = 12
        } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const filter = {};

        if (search.trim()) {
            filter.name = {
                $regex: search.trim(),
                $options: "i"
            };
        }

        if (category.trim()) {
            filter.category = category.trim();
        }

        const skip =
            (pageNumber - 1) * limitNumber;

        const [products, total] = await Promise.all([
            Product.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),

            Product.countDocuments(filter)
        ]);

        const totalPages =
            Math.ceil(total / limitNumber);

        return res.status(200).json({
            status: 200,
            message: "success",
            data: {
                products,
                pagination: {
                    page: pageNumber,
                    limit: limitNumber,
                    total,
                    totalPages
                }
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: 500,
            message: "internal server error",
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
            description,
            imageUrl,
            category
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
            description,
            imageUrl,
            category
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
            description,
            imageUrl,
            category
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
        product.imageUrl = imageUrl ?? "";
        product.category = category ?? "general";

        await product.save();

        return res.status(200).json({
            status: 200,
            message: "อัปเดตรายการสินค้าสำเร็จ",
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
            message: "ลบรายการสินค้าสำเร็จ",
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