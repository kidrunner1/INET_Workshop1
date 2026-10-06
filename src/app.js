const express = require("express");

const authRoutes = require("./routes/user/auth.route");
const userRoutes = require("./routes/user/user.route");
const productRoutes = require("./routes/manager/product.route");
const orderRoutes = require("./routes/manager/order.route");

const app = express();

app.use(express.json());

app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", orderRoutes);


module.exports = app;