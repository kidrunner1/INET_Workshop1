const express = require("express");

const {
    getAllOrders,
    getOrderById,
    updateOrderStatus
} = require("../../controllers/adminOrder.controller");

const {
    authMiddleware,
    adminMiddleware
} = require("../../middlewares/auth.middleware");
const validateRequest =
    require("../../middlewares/validate.middleware");

const {
    orderIdParamSchema,
    updateOrderStatusSchema
} = require("../../validations/request.schemas");
const router = express.Router();

router.get(
    "/admin/orders",
    authMiddleware,
    adminMiddleware,
    getAllOrders
);

router.get(
    "/admin/orders/:id",
    authMiddleware,
    adminMiddleware,
    validateRequest(orderIdParamSchema),
    getOrderById
);

router.put(
    "/admin/orders/:id/status",
    authMiddleware,
    adminMiddleware,
    validateRequest(updateOrderStatusSchema),
    updateOrderStatus
);

module.exports = router;