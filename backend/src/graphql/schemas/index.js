const userSchema = require('./userSchema');
const farmSchema = require('./farmSchema');
const batchSchema = require('./batchSchema');
const businessSchema = require('./businessSchema');
const productSchema = require('./productSchema');

const typeDefs = [
    userSchema,
    farmSchema,
    batchSchema,
    businessSchema,
    productSchema
];

module.exports = typeDefs;


