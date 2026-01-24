const typeDefs = `#graphql

scalar Date

type Product {
  id: ID!
  productName: String!
  category: String!
  unitPrice: Float!
  availableQty: Int!
  productImages: [String!]!
  expiresBefore: Date
  batch: ID!
  qualityGrade: String
  shippingOptions: [ShippingOption!]!
  createdAt: Date
  updatedAt: Date
}

type ShippingOption {
  type: ShippingType!
  price: Float!
  estimatedDays: Int
}

enum ShippingType {
  PICKUP
  LOCAL_DELIVERY
  STATE_DELIVERY
  NATIONAL_DELIVERY
}

input ProductInput {
  productName: String!
  category: String!
  unitPrice: Float!
  availableQty: Int!
  productImages: [String!]!
  expiresBefore: Date
  batch: ID!
  qualityGrade: String
  shippingOptions: [ShippingOptionInput!]!
}

input ShippingOptionInput {
  type: ShippingType!
  price: Float!
  estimatedDays: Int
}

input ProductUpdateInput {
  productName: String
  category: String
  unitPrice: Float
  availableQty: Int
  productImages: [String!]
  expiresBefore: Date
  qualityGrade: String
  shippingOptions: [ShippingOptionInput!]
}

type Query {
  getProduct(id: ID!): Product
  listProducts(category: String): [Product!]!
  listProductsByBatch(batchId: ID!): [Product!]!
}

type Mutation {
  createProduct(input: ProductInput!): Product
  updateProduct(id: ID!, input: ProductUpdateInput!): Product
  deleteProduct(id: ID!): Product
}

`

module.exports = typeDefs;
