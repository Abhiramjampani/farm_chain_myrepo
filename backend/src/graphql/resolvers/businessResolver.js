const businessController = require("../../controllers/businessController");
const businessService = require("../../services/businessService");

const businessResolver = {
    Query: {
        getBusiness: async (_, { id }) => {
            return businessService.findById(id);
        },
        getBusinessProfile: async (_, __, context) => {
            if (!context.business) throw new Error("Unauthorized");
            return businessService.findById(context.business._id);
        },
        listBusinesses: async () => {
            return businessService.findAll();
        }
    },

    Mutation: {
        businessSignup: async (_, { companyName, email, phone, password, businessType, city, state, pinCode, gstNumber }) => {
            return businessController.signup(companyName, email, phone, password, businessType, city, state, pinCode, gstNumber);
        },

        businessLogin: async (_, { identifier, password }) => {
            return businessController.login(identifier, password);
        },

        businessSendOTP: async (_, { identifier }) => {
            return businessController.sendOTP(identifier);
        },

        businessVerifyOTP: async (_, { identifier, otp }) => {
            return businessController.verifyOTP(identifier, otp);
        },

        businessResetPassword: async (_, { identifier, otp, newPassword }) => {
            return businessController.resetPassword(identifier, otp, newPassword);
        }
    },

    Business: {
        id: (parent) => parent._id.toString()
    }
};

module.exports = businessResolver;
