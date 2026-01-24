const userResolvers = require('./userResolver');
const farmResolver = require('./farmResolver');
const batchResolver = require('./batchResolver');
const businessResolver = require('./businessResolver');
const productResolver = require('./productResolver');

const resolvers = {
    Query: {
        ...userResolvers.Query, ...farmResolver.Query, ...batchResolver.Query, ...businessResolver.Query, ...productResolver.Query
    },
    Mutation: {
        ...userResolvers.Mutation, ...farmResolver.Mutation, ...batchResolver.Mutation, ...businessResolver.Mutation, ...productResolver.Mutation
    },
    User: userResolvers.User,
    Business: businessResolver.Business,
    Product: productResolver.Product,
};

module.exports = resolvers;


