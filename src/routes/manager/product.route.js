// src/routes/product.route.js

const express = require("express");

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
    getProducts
);


// เพิ่ม Product
// admin เท่านั้น
router.post(
    "/products",
    authMiddleware,
    adminMiddleware,
    createProduct
);

// ดู Product 1 รายการ
// user และ admin ดูได้
router.get(
    "/products/:id",
    authMiddleware,
    getProductById
);

// แก้ไข Product
// admin เท่านั้น
router.put(
    "/products/:id",
    authMiddleware,
    adminMiddleware,
    updateProduct
);

// ลบ Product
// admin เท่านั้น
router.delete(
    "/products/:id",
    authMiddleware,
    adminMiddleware,
    deleteProduct
);


module.exports = router;