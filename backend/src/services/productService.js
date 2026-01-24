const Product = require("../models/product");

class ProductService {
    async findById(id) {
        return Product.findById(id).populate("batch");
    }

    async findAll(category) {
        const filter = category ? { category } : {};
        return Product.find(filter).populate("batch");
    }

    async findByBatch(batchId) {
        return Product.find({ batch: batchId }).populate("batch");
    }

    async create(productData) {
        const product = new Product(productData);
        return await product.save();
    }

    async update(id, productData) {
        return Product.findByIdAndUpdate(
            id,
            { $set: productData },
            { new: true, runValidators: true }
        ).populate("batch");
    }

    async delete(id) {
        return Product.findByIdAndDelete(id);
    }
}

module.exports = new ProductService();
