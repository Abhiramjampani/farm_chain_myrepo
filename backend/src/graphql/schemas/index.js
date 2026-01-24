const userSchema = require('./userSchema');
const farmSchema = require('./farmSchema');
const batchSchema = require('./batchSchema');
const businessSchema = require('./businessSchema');
const productSchema = require('./productSchema');
const orderSchema = require('./orderSchema');

const typeDefs = [
    userSchema,
    farmSchema,
    batchSchema,
    businessSchema,
    productSchema,
    orderSchema
];

module.exports = typeDefs;



