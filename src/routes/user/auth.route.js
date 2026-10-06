const express = require("express");

const { registerUser, LoginUser } = require("../../controllers/auth.controller");
const {
    authMiddleware
} = require("../../middlewares/auth.middleware"); 
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", LoginUser)

router.get("/me", authMiddleware, (req, res) => {
    return res.status(200).json({
        status: 200,
        message: "สำเร็จ",
        data: req.user
    })
});

module.exports = router;