const userResolvers = require('./userResolver');
const farmResolver = require('./farmResolver');
const batchResolver = require('./batchResolver');
const businessResolver = require('./businessResolver');
const productResolver = require('./productResolver');
const orderResolver = require('./orderResolver');
const auctionResolver = require('./auctionResolver');

const resolvers = {
    Query: {
        ...userResolvers.Query, ...farmResolver.Query, ...batchResolver.Query, ...businessResolver.Query, ...productResolver.Query, ...orderResolver.Query, ...auctionResolver.Query
    },
    Mutation: {
        ...userResolvers.Mutation, ...farmResolver.Mutation, ...batchResolver.Mutation, ...businessResolver.Mutation, ...productResolver.Mutation, ...orderResolver.Mutation, ...auctionResolver.Mutation
    },
    User: userResolvers.User,
    Business: businessResolver.Business,
    Product: productResolver.Product,
    Order: orderResolver.Order,
    Auction: auctionResolver.Auction,
    Bid: auctionResolver.Bid,
};

module.exports = resolvers;



