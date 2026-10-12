const express = require("express");

const authRoutes =
    require("./routes/user/auth.route");


const userRoutes =
    require("./routes/user/user.route");

const cartRoutes =
    require("./routes/user/cart.route");

const orderRoutes =
    require("./routes/user/order.route");

const productRoutes =
    require("./routes/manager/product.route");

const adminOrderRoutes =
    require("./routes/manager/order.route");

const cors = require("cors");
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: [
        "GET", "POST", "PUT", "DELETE"
    ], allowedHeaders: [
        "Content-Type", "Authorization"
    ]
}));

app.use(express.json());

app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);

app.use("/api/v1", cartRoutes);
app.use("/api/v1", orderRoutes);

app.use("/api/v1", productRoutes);
app.use("/api/v1", adminOrderRoutes);

module.exports = app;