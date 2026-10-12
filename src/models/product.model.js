const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        stock: {
            type: Number,
            required: true,
            min: 0
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        imageUrl: {
            type: String,
            default: "",
            trim: true
        },

        category: {
            type: String,
            default: "general",
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model(
    "Product",
    productSchema
);

module.exports = Product;