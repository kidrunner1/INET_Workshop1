const path = require("node:path");

const PRODUCT_IMAGE_DIR = path.resolve(__dirname, "../../uploads/products");
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 20_000_000;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
// Configure the public backend origin when deploying. Never trust the request Host header.
const publicOrigin = new URL(process.env.PUBLIC_API_URL || "http://localhost:" + (process.env.PORT || 3000));
if (!["http:", "https:"].includes(publicOrigin.protocol)) {
    throw new Error("PUBLIC_API_URL must be an http or https URL");
}

module.exports = {
    PRODUCT_IMAGE_DIR, MAX_IMAGE_BYTES, MAX_IMAGE_PIXELS, ALLOWED_IMAGE_TYPES,
    productImageUrl: (filename) => new URL("/uploads/products/" + filename, publicOrigin).href,
};

