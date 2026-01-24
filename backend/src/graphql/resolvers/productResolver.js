const ProductService = require("../../services/productService");

const productResolver = {
    Query: {
        getProduct: (_, { id }, context) => {
            return ProductService.findById(id);
        },
        listProducts: (_, { category }, context) => {
            return ProductService.findAll(category);
        },
        listProductsByBatch: (_, { batchId }, context) => {
            return ProductService.findByBatch(batchId);
        }
    },

    Mutation: {
        createProduct: (_, { input }, context) => {
            return ProductService.create(input);
        },
        updateProduct: (_, { id, input }, context) => {
            return ProductService.update(id, input);
        },
        deleteProduct: (_, { id }, context) => {
            return ProductService.delete(id);
        }
    },

    Product: {
        id: (parent) => parent._id.toString()
    }
};

module.exports = productResolver;
