const userSchema = require('./userSchema');
const farmSchema = require('./farmSchema');
const batchSchema = require('./batchSchema');
const productSchema = require('./productSchema');

const typeDefs = [
    userSchema,
    farmSchema,
    batchSchema,
    productSchema
];

module.exports = typeDefs;
