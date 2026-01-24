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
    qrImage: String
    status: String!
    createdAt: String!
}

input ProductFilters {
    category: String
    isOrganic: Boolean
    minPrice: Float
    maxPrice: Float
}

type TraceTimeline {
    type: String!
    date: String!
    title: String!
    description: String
    whoClass: String
    icon: String!
}

type TraceScores {
    freshness: Int!
    organic: Int!
    overall: Int!
}

type TraceFarmer {
    name: String!
    verified: Boolean!
}

type TraceFarm {
    latitude: Float
    longitude: Float
    size: Float
    soilType: String
    organicStatus: String
}

type TraceBatch {
    cropName: String!
    variety: String
    seedSource: String
    sowingDate: String
    harvestDate: String
    qualityGrade: String
}

type TraceResult {
    product: Product
    farmer: TraceFarmer
    farm: TraceFarm
    batch: TraceBatch
    timeline: [TraceTimeline!]!
    scores: TraceScores!
    isVerified: Boolean!
}

type Query {
    getProduct(id: ID!): Product
    myProducts: [Product!]!
    listProducts(filters: ProductFilters): [Product!]!
    traceProduct(qrCode: String!): TraceResult
}

type Mutation {
    createProduct(batchId: ID!, title: String!, description: String, category: String!, pricePerKg: Float!, availableQty: Float!, minOrderQty: Float, photos: [String!], isOrganic: Boolean): Product!
    updateProduct(id: ID!, title: String, description: String, pricePerKg: Float, availableQty: Float, minOrderQty: Float, photos: [String!], status: String): Product!
    deleteProduct(id: ID!): Product
    publishProduct(id: ID!): Product!
}

`

module.exports = typeDefs;

