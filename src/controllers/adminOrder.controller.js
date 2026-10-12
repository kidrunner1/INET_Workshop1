const mongoose = require("mongoose");

const Order = require("../models/order.model");
const Product = require("../models/product.model");

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate(
                "userId",
                "username role status"
            )
            .sort({
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

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                status: 400,
                message: "invalid order id",
                data: null
            });
        }

        const order = await Order.findById(id)
            .populate(
                "userId",
                "username role status"
            );

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

const updateOrderStatus = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            await session.abortTransaction();

            return res.status(400).json({
                status: 400,
                message: "invalid order id",
                data: null
            });
        }

        if (!status) {
            await session.abortTransaction();

            return res.status(400).json({
                status: 400,
                message: "status is required",
                data: null
            });
        }

        const order = await Order.findById(id)
            .session(session);

        if (!order) {
            await session.abortTransaction();

            return res.status(400).json({
                status: 400,
                message: "order not found",
                data: null
            });
        }

        const allowedTransitions = {
            pending: [
                "confirmed",
                "cancelled"
            ],

            confirmed: [
                "processing",
                "cancelled"
            ],

            processing: [
                "shipped"
            ],

            shipped: [
                "completed"
            ],

            completed: [],

            cancelled: []
        };

        const allowedNextStatuses =
            allowedTransitions[order.status];

        if (
            !allowedNextStatuses ||
            !allowedNextStatuses.includes(status)
        ) {
            await session.abortTransaction();

            return res.status(400).json({
                status: 400,
                message:
                    `cannot change status from ${order.status} to ${status}`,
                data: null
            });
        }

        // Cancel → คืน Stock ทุก Item
        if (status === "cancelled") {
            for (const item of order.items) {
                await Product.updateOne(
                    {
                        _id: item.productId
                    },
                    {
                        $inc: {
                            stock: item.quantity
                        }
                    },
                    {
                        session
                    }
                );
            }
        }

        order.status = status;

        await order.save({
            session
        });

        await session.commitTransaction();

        await order.populate(
            "userId",
            "username role status"
        );

        return res.status(200).json({
            status: 200,
            message: "order status updated successfully",
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

module.exports = {
    getAllOrders,
    getOrderById,
    updateOrderStatus
};