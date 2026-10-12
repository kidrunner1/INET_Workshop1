// src/routes/product.route.js

const express = require("express");
const validateRequest =
    require("../../middlewares/validate.middleware");

const {
    createProductSchema,
    updateProductSchema,
    productIdParamSchema,
    productQuerySchema
} = require("../../validations/request.schemas");
const {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../../controllers/product.controller");

const {
    authMiddleware,
    adminMiddleware
} = require("../../middlewares/auth.middleware");

const router = express.Router();


// ดู Product ทั้งหมด
// user และ admin ดูได้
router.get(
    "/products",
    authMiddleware,
    validateRequest(productQuerySchema),
    getProducts
);


// เพิ่ม Product
// admin เท่านั้น
router.post(
    "/products",
    authMiddleware,
    adminMiddleware,
    validateRequest(createProductSchema),
    createProduct
);

// ดู Product 1 รายการ
// user และ admin ดูได้
router.get(
    "/products/:id",
    authMiddleware,
    validateRequest(productIdParamSchema),
    getProductById
);

// แก้ไข Product
// admin เท่านั้น
router.put(
    "/products/:id",
    authMiddleware,
    adminMiddleware,
    validateRequest(updateProductSchema),
    updateProduct
);

// ลบ Product
// admin เท่านั้น
router.delete(
    "/products/:id",
    authMiddleware,
    adminMiddleware,
    validateRequest(productIdParamSchema),
    deleteProduct
);


module.exports = router;