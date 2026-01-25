const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    pricePerKg: { type: Number, required: true },
    availableQty: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },
    minOrderQty: { type: Number, default: 1 },
    photos: [String],
    isOrganic: { type: Boolean, default: false },
    qrCode: { type: String },
    qrImage: { type: String },
    status: { 
        type: String, 
        enum: ['draft', 'active', 'sold_out', 'expired'],
        default: 'draft'
    }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
