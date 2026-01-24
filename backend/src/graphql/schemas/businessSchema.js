const typeDefs = `#graphql

type Business {
    id: ID!
    companyName: String!
    email: String
    phone: String
    businessType: String!
    address: BusinessAddress!
    gstNumber: String
    isVerified: Boolean!
    createdAt: String!
}

type BusinessAddress {
    city: String!
    state: String!
    pinCode: String!
}

type BusinessAuthResponse {
    token: String!
    business: Business!
}

type BusinessOTPResponse {
    success: Boolean!
    message: String!
    otp: String
}

type Query {
    getBusiness(id: ID!): Business
    getBusinessProfile: Business
    listBusinesses: [Business!]!
}

type Mutation {
    businessSignup(companyName: String!, email: String, phone: String, password: String!, businessType: String!, city: String!, state: String!, pinCode: String!, gstNumber: String): BusinessAuthResponse!
    businessLogin(identifier: String!, password: String!): BusinessAuthResponse!
    businessSendOTP(identifier: String!): BusinessOTPResponse!
    businessVerifyOTP(identifier: String!, otp: String!): BusinessOTPResponse!
    businessResetPassword(identifier: String!, otp: String!, newPassword: String!): BusinessOTPResponse!
}

`

module.exports = typeDefs;
