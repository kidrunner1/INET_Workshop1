const { z } = require("zod");

// MongoDB ObjectId = 24 ตัวอักษร hexadecimal
const objectId = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "invalid object id");

// ===============================
// Authentication
// ===============================

const registerSchema = z.object({
    body: z
        .object({
            username: z
                .string()
                .trim()
                .min(3, "username must be at least 3 characters")
                .max(50, "username is too long"),

            password: z
                .string()
                .min(6, "password must be at least 6 characters")
                .max(100, "password is too long")
        })
        .strict()
});

const loginSchema = z.object({
    body: z
        .object({
            username: z
                .string()
                .trim()
                .min(1, "username is required"),

            password: z
                .string()
                .min(1, "password is required")
        })
        .strict()
});

// ===============================
// User
// ===============================

const userIdParamSchema = z.object({
    params: z.object({
        id: objectId
    })
});

// ===============================
// Product
// ===============================

const productBodySchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, "name is required")
            .max(120, "name is too long"),

        price: z
            .number()
            .finite()
            .min(0, "price cannot be negative"),

        stock: z
            .number()
            .int("stock must be an integer")
            .min(0, "stock cannot be negative"),

        description: z
            .string()
            .trim()
            .max(1000, "description is too long")
            .optional(),

        imageUrl: z
            .string()
            .trim()
            .max(2048, "image url is too long")
            .optional(),

        category: z
            .string()
            .trim()
            .min(1, "category cannot be empty")
            .max(80, "category is too long")
            .optional()
    })
    .strict();

const createProductSchema = z.object({
    body: productBodySchema
});

const updateProductSchema = z.object({
    params: z.object({
        id: objectId
    }),

    body: productBodySchema
});

const productIdParamSchema = z.object({
    params: z.object({
        id: objectId
    })
});

// ===============================
// Cart
// ===============================

const addCartItemSchema = z.object({
    body: z
        .object({
            productId: objectId,

            quantity: z
                .number()
                .int("quantity must be an integer")
                .positive("quantity must be greater than 0")
        })
        .strict()
});

const updateCartItemSchema = z.object({
    params: z.object({
        productId: objectId
    }),

    body: z
        .object({
            quantity: z
                .number()
                .int("quantity must be an integer")
                .positive("quantity must be greater than 0")
        })
        .strict()
});

const cartItemParamSchema = z.object({
    params: z.object({
        productId: objectId
    })
});

// ===============================
// Order
// ===============================

const checkoutSchema = z.object({
    body: z.object({}).strict()
});

const orderIdParamSchema = z.object({
    params: z.object({
        id: objectId
    })
});

// ===============================
// Admin Order
// ===============================

const updateOrderStatusSchema = z.object({
    params: z.object({
        id: objectId
    }),

    body: z
        .object({
            status: z.enum([
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "completed",
                "cancelled"
            ])
        })
        .strict()
});

const productQuerySchema = z.object({
    query: z.object({
        search: z
            .string()
            .trim()
            .optional(),

        category: z
            .string()
            .trim()
            .optional(),

        page: z
            .string()
            .regex(/^\d+$/, "page must be a positive integer")
            .optional(),

        limit: z
            .string()
            .regex(/^\d+$/, "limit must be a positive integer")
            .optional()
    })
});

module.exports = {
    registerSchema,
    loginSchema,

    userIdParamSchema,

    createProductSchema,
    updateProductSchema,
    productIdParamSchema,

    addCartItemSchema,
    updateCartItemSchema,
    cartItemParamSchema,

    checkoutSchema,
    orderIdParamSchema,

    updateOrderStatusSchema,

    productQuerySchema
};