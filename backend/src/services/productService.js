const Product = require("../models/product");

class ProductService {
    async findById(id) {
        return Product.findById(id).populate("batch").populate("farmer");
    }

    async findByFarmer(farmerId) {
        return Product.find({ farmer: farmerId }).populate("batch");
    }

    async findActive(filters = {}) {
        const query = { status: 'active' };
        
        if (filters.category) query.category = filters.category;
        if (filters.isOrganic !== undefined) query.isOrganic = filters.isOrganic;
        if (filters.minPrice) query.pricePerKg = { $gte: filters.minPrice };
        if (filters.maxPrice) query.pricePerKg = { ...query.pricePerKg, $lte: filters.maxPrice };
        
        return Product.find(query).populate("batch").populate("farmer");
    }

    async findAll() {
        return Product.find().populate("batch").populate("farmer");
    }

    async create(productData) {
        const product = new Product(productData);
        return await product.save();
    }

    async update(id, updateData) {
        return Product.findByIdAndUpdate(id, { $set: updateData }, { new: true }).populate("batch");
    }

    async updateStatus(id, status) {
        return Product.findByIdAndUpdate(id, { status }, { new: true });
    }

    async reduceQty(id, qty) {
        const product = await Product.findById(id);
        if (!product) throw new Error("Product not found");
        
        const newQty = product.availableQty - qty;
        if (newQty < 0) throw new Error("Insufficient quantity");
        
        product.availableQty = newQty;
        if (newQty === 0) product.status = 'sold_out';
        
        return await product.save();
    }

    async delete(id) {
        return Product.findByIdAndDelete(id);
    }
}

module.exports = new ProductService();
