const typeDefs = `#graphql

type Order {
    id: ID!
    orderId: String!
    type: String!
    business: Business
    farmer: User
    product: Product
    quantity: Float!
    pricePerKg: Float!
    totalAmount: Float!
    status: String!
    allowedActions: [String!]!
    confirmedAt: String
    shippedAt: String
    deliveredAt: String
    createdAt: String!
}

type Query {
    getOrder(id: ID!): Order
    getOrderByOrderId(orderId: String!): Order
    myOrders: [Order!]!
    ordersReceived: [Order!]!
}

type Mutation {
    placeOrder(productId: ID!, quantity: Float!): Order!
    confirmOrder(orderId: ID!): Order!
    shipOrder(orderId: ID!): Order!
    confirmDelivery(orderId: ID!): Order!
    cancelOrder(orderId: ID!): Order!
}

`

module.exports = typeDefs;
