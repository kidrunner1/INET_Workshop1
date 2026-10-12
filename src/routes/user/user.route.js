const express = require("express");

const {
    approveUser,
    getUsers
} = require("../../controllers/user.controller");

const {
    authMiddleware,
    adminMiddleware
} = require("../../middlewares/auth.middleware");
const validateRequest =
    require("../../middlewares/validate.middleware");

const {
    userIdParamSchema
} = require("../../validations/request.schemas");
const router = express.Router();

router.put(
    "/users/:id/approve",
    authMiddleware,
    adminMiddleware,
    validateRequest(userIdParamSchema),
    approveUser
);

router.get(
    "/admin/users",
    authMiddleware,
    adminMiddleware,
    getUsers
);

module.exports = router;