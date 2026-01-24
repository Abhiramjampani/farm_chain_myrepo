const userSchema = require('./userSchema');
const farmSchema = require('./farmSchema');
const batchSchema = require('./batchSchema');
const businessSchema = require('./businessSchema');
const productSchema = require('./productSchema');
const orderSchema = require('./orderSchema');
const auctionSchema = require('./auctionSchema');

const typeDefs = [
    userSchema,
    farmSchema,
    batchSchema,
    businessSchema,
    productSchema,
    orderSchema,
    auctionSchema
];

module.exports = typeDefs;



