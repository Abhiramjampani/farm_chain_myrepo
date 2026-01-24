const mongoose = require("mongoose");

const shippingOptionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["PICKUP", "LOCAL_DELIVERY", "STATE_DELIVERY", "NATIONAL_DELIVERY"],
        required: true
    },
    price: { type: Number, required: true },
    estimatedDays: { type: Number }
});

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    category: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    availableQty: { type: Number, required: true },
    productImages: [{ type: String }],
    expiresBefore: { type: Date },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
        required: true
    },
    qualityGrade: { type: String },
    shippingOptions: [shippingOptionSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);
