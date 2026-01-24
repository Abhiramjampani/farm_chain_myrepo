const businessService = require("../services/businessService");
const authService = require("../services/authService");
const otpService = require("../services/otpService");

class BusinessController {
    async signup(companyName, email, phone, password, businessType, city, state, pinCode, gstNumber) {
        if (!email && !phone) {
            throw new Error("Email or phone is required");
        }

        if (email && await businessService.existsByEmail(email)) {
            throw new Error("Email already exists");
        }

        if (phone && await businessService.existsByPhone(phone)) {
            throw new Error("Phone already exists");
        }

        const hashedPassword = await authService.hashPassword(password);

        const business = await businessService.create({
            companyName,
            email,
            phone,
            password: hashedPassword,
            businessType,
            address: { city, state, pinCode },
            gstNumber
        });

        const token = authService.generateToken(business._id);

        return { token, business };
    }

    async login(identifier, password) {
        if (!identifier) {
            throw new Error("Email or phone is required");
        }

        const business = await businessService.findByIdentifier(identifier);
        if (!business) throw new Error("Business not found");

        const isMatch = await authService.comparePassword(password, business.password);
        if (!isMatch) throw new Error("Incorrect password");

        const token = authService.generateToken(business._id);
        return { token, business };
    }

    async sendOTP(identifier) {
        if (!identifier) {
            throw new Error("Email or phone is required");
        }

        const business = await businessService.findByIdentifier(identifier);
        if (!business) throw new Error("No business found with this email/phone");

        const otp = otpService.generate();
        const expiry = otpService.getExpiry();

        await businessService.updateOTP(business._id, otp, expiry);

        const isEmail = identifier.includes('@');
        return {
            success: true,
            message: `OTP sent to ${isEmail ? 'email' : 'phone'}`,
            otp
        };
    }

    async verifyOTP(identifier, otp) {
        const business = await businessService.findByIdentifier(identifier);
        if (!business) throw new Error("Business not found");

        if (!otpService.isValid(business.otp, business.otpExpiry, otp)) {
            throw new Error("Invalid or expired OTP");
        }

        return { success: true, message: "OTP verified" };
    }

    async resetPassword(identifier, otp, newPassword) {
        const business = await businessService.findByIdentifier(identifier);
        if (!business) throw new Error("Business not found");

        if (!otpService.isValid(business.otp, business.otpExpiry, otp)) {
            throw new Error("Invalid or expired OTP");
        }

        const hashedPassword = await authService.hashPassword(newPassword);
        await businessService.updatePassword(business._id, hashedPassword);

        return { success: true, message: "Password reset successful" };
    }
}

module.exports = new BusinessController();
