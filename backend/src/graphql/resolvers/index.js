const userResolvers = require('./userResolver');
const farmResolver = require('./farmResolver');
const batchResolver = require('./batchResolver');
const productResolver = require('./productResolver');

const resolvers = {
    Query: {
        ...userResolvers.Query, 
        ...farmResolver.Query, 
        ...batchResolver.Query,
        ...productResolver.Query
    },
    Mutation: {
        ...userResolvers.Mutation, 
        ...farmResolver.Mutation, 
        ...batchResolver.Mutation,
        ...productResolver.Mutation
    },
    User: userResolvers.User,
    Batch: batchResolver.Batch,
    Product: productResolver.Product
};

module.exports = resolvers;
