const express = require("express");

const { registerUser, LoginUser } = require("../../controllers/auth.controller");
const {
    authMiddleware
} = require("../../middlewares/auth.middleware");
const validateRequest =
    require("../../middlewares/validate.middleware");

const {
    registerSchema,
    loginSchema
} = require("../../validations/request.schemas");


const router = express.Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), LoginUser)

router.get("/me", authMiddleware, (req, res) => {
    return res.status(200).json({
        status: 200,
        message: "สำเร็จ",
        data: req.user
    })
});

module.exports = router;