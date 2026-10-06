const express = require("express");

const {
    approveUser
} = require("../../controllers/user.controller");

const {
    authMiddleware,
    adminMiddleware
} = require("../../middlewares/auth.middleware");

const router = express.Router();

router.put(
    "/users/:id/approve",
    authMiddleware,
    adminMiddleware,
    approveUser
);

module.exports = router;