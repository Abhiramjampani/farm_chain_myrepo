const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    businessType: { 
        type: String, 
        enum: ['retailer', 'wholesaler', 'restaurant', 'exporter', 'processor'],
        required: true 
    },
    address: {
        city: { type: String, required: true },
        state: { type: String, required: true },
        pinCode: { type: String, required: true }
    },
    gstNumber: { type: String },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Business", businessSchema);
