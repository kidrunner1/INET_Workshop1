const express = require("express");

const {
    checkout,
    getMyOrders,
    getMyOrderById
} = require("../../controllers/order.controller");

const {
    authMiddleware
} = require("../../middlewares/auth.middleware");
const validateRequest =
    require("../../middlewares/validate.middleware");

const {
    checkoutSchema,
    orderIdParamSchema
} = require("../../validations/request.schemas");
const router = express.Router();

router.post(
    "/orders",
    authMiddleware,
    validateRequest(checkoutSchema),
    checkout
);

router.get(
    "/orders/me",
    authMiddleware,
    getMyOrders
);

router.get(
    "/orders/:id",
    authMiddleware,
    validateRequest(orderIdParamSchema),
    getMyOrderById
);

module.exports = router;