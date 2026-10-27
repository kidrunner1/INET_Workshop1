const fs = require("node:fs/promises");
const crypto = require("node:crypto");
const path = require("node:path");
const sharp = require("sharp");
const { PRODUCT_IMAGE_DIR, MAX_IMAGE_PIXELS, productImageUrl } = require("../config/uploads");

const uploadProductImage = async (req, res) => {
    if (!req.file?.buffer?.length) {
        return res.status(400).json({ status: 400, message: "กรุณาเลือกไฟล์รูปภาพ", data: null });
    }

    let image;
    try {
        const source = sharp(req.file.buffer, { limitInputPixels: MAX_IMAGE_PIXELS, failOn: "warning" });
        const metadata = await source.metadata();
        // Decode and re-encode; filename and the browser-supplied MIME are not trusted.
        if (!["jpeg", "png", "webp"].includes(metadata.format) || (metadata.pages || 1) !== 1) {
            return res.status(415).json({
                status: 415, message: "รองรับเฉพาะภาพนิ่ง JPG, PNG และ WebP", data: null,
            });
        }
        image = await source.rotate()
            .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer({ resolveWithObject: true });
    } catch {
        return res.status(422).json({
            status: 422,
            message: "อ่านรูปภาพไม่ได้ หรือรูปมีความละเอียดเกิน 20 ล้านพิกเซล กรุณาเลือกรูปอื่น",
            data: null,
        });
    }

    if (req.aborted || res.destroyed) return;
    const filename = crypto.randomUUID() + ".webp";
    try {
        await fs.mkdir(PRODUCT_IMAGE_DIR, { recursive: true });
        await fs.writeFile(path.join(PRODUCT_IMAGE_DIR, filename), image.data, { flag: "wx" });
    } catch {
        return res.status(500).json({
            status: 500, message: "จัดเก็บรูปภาพไม่สำเร็จ กรุณาลองอีกครั้ง", data: null,
        });
    }
    return res.status(201).json({
        status: 201,
        message: "อัปโหลดรูปภาพสำเร็จ",
        data: {
            imageUrl: productImageUrl(filename),
            mimeType: "image/webp",
            size: image.info.size,
            width: image.info.width,
            height: image.info.height,
        },
    });
};

module.exports = { uploadProductImage };

