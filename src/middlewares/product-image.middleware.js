const multer = require("multer");
const { MAX_IMAGE_BYTES, ALLOWED_IMAGE_TYPES } = require("../config/uploads");

const parseImage = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_IMAGE_BYTES, files: 1, fields: 0, parts: 2 },
    fileFilter: (_req, file, callback) => {
        if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
            const error = new Error("รองรับเฉพาะรูป JPG, PNG และ WebP");
            error.code = "UNSUPPORTED_IMAGE";
            return callback(error);
        }
        callback(null, true);
    },
}).single("image");

module.exports = (req, res, next) => {
    parseImage(req, res, (error) => {
        if (!error) return next();
        const tooLarge = error.code === "LIMIT_FILE_SIZE";
        const status = tooLarge ? 413 : 400;
        const message = tooLarge
            ? "รูปภาพต้องมีขนาดไม่เกิน 5 MB"
            : error.code === "UNSUPPORTED_IMAGE"
                ? error.message
                : "กรุณาเลือกไฟล์รูปภาพเพียง 1 รูป และส่งด้วยช่อง image";
        res.status(status).json({ status, message, data: null });
    });
};


