const Business = require("../models/business");

class BusinessService {
    async findById(id) {
        return Business.findById(id);
    }

    async findByEmail(email) {
        return Business.findOne({ email });
    }

    async findByPhone(phone) {
        return Business.findOne({ phone });
    }

    async findByIdentifier(identifier) {
        const isEmail = identifier.includes('@');
        return isEmail ? this.findByEmail(identifier) : this.findByPhone(identifier);
    }

    async existsByEmail(email) {
        const business = await Business.findOne({ email });
        return !!business;
    }

    async existsByPhone(phone) {
        const business = await Business.findOne({ phone });
        return !!business;
    }

    async create(businessData) {
        const business = new Business(businessData);
        return await business.save();
    }

    async update(id, updateData) {
        return Business.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    }

    async updateOTP(businessId, otp, expiry) {
        return Business.findByIdAndUpdate(
            businessId,
            { otp, otpExpiry: expiry },
            { new: true }
        );
    }

    async updatePassword(businessId, password) {
        return Business.findByIdAndUpdate(
            businessId,
            { password, otp: null, otpExpiry: null },
            { new: true }
        );
    }

    async findAll() {
        return Business.find();
    }
}

module.exports = new BusinessService();
