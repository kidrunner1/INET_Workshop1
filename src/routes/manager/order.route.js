const express = require("express");

const {
    getOrders,
    getProductOrders,
    createProductOrder
} = require("../../controllers/order.controller");

const {
    authMiddleware
} = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get(
    "/orders",
    authMiddleware,
    getOrders
);

router.get(
    "/products/:id/orders",
    authMiddleware,
    getProductOrders
);

router.post(
    "/products/:id/orders",
    authMiddleware,
    createProductOrder
);

module.exports = router;