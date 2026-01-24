const typeDefs = `#graphql

type Product {
    id: ID!
    batch: Batch
    farmer: User
    title: String!
    description: String
    category: String!
    pricePerKg: Float!
    availableQty: Float!
    minOrderQty: Float!
    photos: [String!]!
    isOrganic: Boolean!
    qrCode: String
    status: String!
    createdAt: String!
}

input ProductFilters {
    category: String
    isOrganic: Boolean
    minPrice: Float
    maxPrice: Float
}

type Query {
    getProduct(id: ID!): Product
    myProducts: [Product!]!
    listProducts(filters: ProductFilters): [Product!]!
}

type Mutation {
    createProduct(batchId: ID!, title: String!, description: String, category: String!, pricePerKg: Float!, availableQty: Float!, minOrderQty: Float, photos: [String!], isOrganic: Boolean): Product!
    updateProduct(id: ID!, title: String, description: String, pricePerKg: Float, availableQty: Float, minOrderQty: Float, photos: [String!], status: String): Product!
    deleteProduct(id: ID!): Product
    publishProduct(id: ID!): Product!
}

`

module.exports = typeDefs;
