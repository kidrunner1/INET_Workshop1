const mongoose = require("mongoose");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

const getMyCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId })
            .populate("items.productId");

        if (!cart) {
            return res.status(200).json({
                status: 200,
                message: "success",
                data: {
                    userId,
                    items: []
                }
            });
        }

        return res.status(200).json({
            status: 200,
            message: "success",
            data: cart
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

const addCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        // ตรวจข้อมูลที่รับมา
        if (!productId || quantity === undefined) {
            return res.status(400).json({
                status: 400,
                message: "productId and quantity are required",
                data: null
            });
        }

        // ตรวจรูปแบบ Product ID
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                status: 400,
                message: "invalid product id",
                data: null
            });
        }

        // quantity ต้องเป็นจำนวนเต็ม และมากกว่า 0
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                status: 400,
                message: "quantity must be a positive integer",
                data: null
            });
        }

        // ตรวจว่า Product มีจริงหรือไม่
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(400).json({
                status: 400,
                message: "product not found",
                data: null
            });
        }

        // จำนวนที่ต้องการต้องไม่เกิน Stock
        if (quantity > product.stock) {
            return res.status(400).json({
                status: 400,
                message: "insufficient stock",
                data: null
            });
        }

        // หา Cart ของ User คนนี้
        let cart = await Cart.findOne({ userId });

        // ถ้ายังไม่มี Cart ให้สร้างใหม่
        if (!cart) {
            cart = await Cart.create({
                userId,
                items: [
                    {
                        productId,
                        quantity
                    }
                ]
            });

            await cart.populate(
                "items.productId",
                "name price stock description imageUrl category"
            );

            return res.status(201).json({
                status: 201,
                message: "product added to cart",
                data: cart
            });
        }

        // ตรวจว่าสินค้านี้อยู่ใน Cart แล้วหรือยัง
        const existingItem = cart.items.find(
            (item) => item.productId.toString() === productId
        );

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;

            // หลังจากบวกแล้ว ห้ามเกิน Stock
            if (newQuantity > product.stock) {
                return res.status(400).json({
                    status: 400,
                    message: "quantity exceeds available stock",
                    data: null
                });
            }

            existingItem.quantity = newQuantity;

            await cart.save();

            await cart.populate(
                "items.productId",
                "name price stock description imageUrl category"
            );

            return res.status(200).json({
                status: 200,
                message: "cart quantity updated",
                data: cart
            });
        }

        // ถ้ายังไม่มี Product นี้ใน Cart ให้เพิ่มใหม่
        cart.items.push({
            productId,
            quantity
        });

        await cart.save();

        await cart.populate(
            "items.productId",
            "name price stock description imageUrl category"
        );

        return res.status(201).json({
            status: 201,
            message: "product added to cart",
            data: cart
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

const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { quantity } = req.body;

        // ตรวจ Product ID
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                status: 400,
                message: "invalid product id",
                data: null
            });
        }

        // quantity ต้องมีค่า
        if (quantity === undefined) {
            return res.status(400).json({
                status: 400,
                message: "quantity is required",
                data: null
            });
        }

        // quantity ต้องเป็นจำนวนเต็ม และมากกว่า 0
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                status: 400,
                message: "quantity must be a positive integer",
                data: null
            });
        }

        // ตรวจว่า Product มีจริง
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(400).json({
                status: 400,
                message: "product not found",
                data: null
            });
        }

        // จำนวนใหม่ต้องไม่เกิน Stock
        if (quantity > product.stock) {
            return res.status(400).json({
                status: 400,
                message: "quantity exceeds available stock",
                data: null
            });
        }

        // หา Cart ของ User
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(400).json({
                status: 400,
                message: "cart not found",
                data: null
            });
        }

        // หาสินค้าใน Cart
        const cartItem = cart.items.find(
            (item) => item.productId.toString() === productId
        );

        if (!cartItem) {
            return res.status(400).json({
                status: 400,
                message: "product not found in cart",
                data: null
            });
        }

        // เปลี่ยนจำนวน
        cartItem.quantity = quantity;

        await cart.save();

        // ดึงรายละเอียด Product กลับไปให้ Frontend
        await cart.populate(
            "items.productId",
            "name price stock description imageUrl category"
        );

        return res.status(200).json({
            status: 200,
            message: "cart updated successfully",
            data: cart
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
const removeCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        // ตรวจ Product ID
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                status: 400,
                message: "invalid product id",
                data: null
            });
        }

        // หา Cart ของ User
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(400).json({
                status: 400,
                message: "cart not found",
                data: null
            });
        }

        // ตรวจว่าสินค้าอยู่ใน Cart หรือไม่
        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(400).json({
                status: 400,
                message: "product not found in cart",
                data: null
            });
        }

        // ลบสินค้าออกจาก array
        cart.items.splice(itemIndex, 1);

        await cart.save();

        await cart.populate(
            "items.productId",
            "name price stock description imageUrl category"
        );

        return res.status(200).json({
            status: 200,
            message: "product removed from cart",
            data: cart
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

const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(200).json({
                status: 200,
                message: "cart is already empty",
                data: {
                    userId,
                    items: []
                }
            });
        }

        cart.items = [];

        await cart.save();

        return res.status(200).json({
            status: 200,
            message: "cart cleared successfully",
            data: cart
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

module.exports = {
    getMyCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart
};