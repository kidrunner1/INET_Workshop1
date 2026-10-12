const mongoose = require("mongoose");

const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

const checkout = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const userId = req.user.id;

        // 1. หา Cart ของ User
        const cart = await Cart.findOne({
            userId
        }).session(session);

        if (!cart || cart.items.length === 0) {
            await session.abortTransaction();

            return res.status(400).json({
                status: 400,
                message: "cart is empty",
                data: null
            });
        }

        const orderItems = [];
        let totalPrice = 0;

        // 2. ตรวจและลด Stock ทีละสินค้า
        for (const cartItem of cart.items) {
            /*
              ใช้เงื่อนไข stock >= quantity
              เพื่อป้องกันการซื้อเกิน Stock
            */
            const product = await Product.findOneAndUpdate(
                {
                    _id: cartItem.productId,
                    stock: {
                        $gte: cartItem.quantity
                    }
                },
                {
                    $inc: {
                        stock: -cartItem.quantity
                    }
                },
                {
                    new: true,
                    session
                }
            );

            if (!product) {
                await session.abortTransaction();

                return res.status(400).json({
                    status: 400,
                    message: "product not found or insufficient stock",
                    data: null
                });
            }

            const subtotal =
                product.price * cartItem.quantity;

            orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                subtotal
            });

            totalPrice += subtotal;
        }

        // 3. สร้าง Order
        const order = new Order({
            userId,
            items: orderItems,
            totalPrice,
            status: "pending"
        });

        await order.save({
            session
        });

        // 4. ล้าง Cart
        cart.items = [];

        await cart.save({
            session
        });

        // 5. ทุกอย่างผ่าน
        await session.commitTransaction();

        return res.status(201).json({
            status: 201,
            message: "order created successfully",
            data: order
        });

    } catch (error) {
        await session.abortTransaction();

        console.error(error);

        return res.status(500).json({
            status: 500,
            message: "internal server error",
            data: null
        });

    } finally {
        await session.endSession();
    }
};

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.find({
            userId
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            status: 200,
            message: "success",
            data: orders
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

const getMyOrderById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                status: 400,
                message: "invalid order id",
                data: null
            });
        }

        const order = await Order.findOne({
            _id: id,
            userId
        });

        if (!order) {
            return res.status(400).json({
                status: 400,
                message: "order not found",
                data: null
            });
        }

        return res.status(200).json({
            status: 200,
            message: "success",
            data: order
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
    checkout,
    getMyOrders,
    getMyOrderById

};