const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    // Optional at the model layer so existing accounts can still be saved/approved.
    // New registrations require names/email through registerSchema.
    firstName: { type: String, trim: true, maxlength: 80 },
    lastName: { type: String, trim: true, maxlength: 80 },
    email: { type: String, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 16 },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    status: { type: String, enum: ["pending", "approved"], default: "pending" },
}, { timestamps: true });

// Legacy documents without an email are excluded; concurrent signups cannot duplicate it.
userSchema.index({ email: 1 }, {
    unique: true,
    partialFilterExpression: { email: { $type: "string" } },
});

module.exports = mongoose.model("User", userSchema);

