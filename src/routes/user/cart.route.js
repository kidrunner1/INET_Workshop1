const express = require("express");

const {
    getMyCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart
} = require("../../controllers/cart.controller");

const {
    authMiddleware
} = require("../../middlewares/auth.middleware");
const validateRequest = require("../../middlewares/validate.middleware")
const {
    addCartItemSchema,
    updateCartItemSchema,
    cartItemParamSchema
} = require("../../validations/request.schemas");

const router = express.Router();

router.get(
    "/cart",
    authMiddleware,
    getMyCart
);

router.post(
    "/cart/items",
    authMiddleware,
    validateRequest(addCartItemSchema),
    addCartItem
);

router.put(
    "/cart/items/:productId",
    authMiddleware,
    validateRequest(updateCartItemSchema),
    updateCartItem
);

router.delete(
    "/cart/items/:productId",
    authMiddleware,
    validateRequest(cartItemParamSchema),
    removeCartItem
);

router.delete(
    "/cart",
    authMiddleware,
    clearCart
);

module.exports = router;