const Order = require("../models/order");
const { canTransition, getNextState } = require("./orderStateMachine");

class OrderService {
    async findById(id) {
        return Order.findById(id)
            .populate("business")
            .populate("farmer")
            .populate("product");
    }

    async findByOrderId(orderId) {
        return Order.findOne({ orderId })
            .populate("business")
            .populate("farmer")
            .populate("product");
    }

    async findByBusiness(businessId) {
        return Order.find({ business: businessId })
            .populate("farmer")
            .populate("product")
            .sort({ createdAt: -1 });
    }

    async findByFarmer(farmerId) {
        return Order.find({ farmer: farmerId })
            .populate("business")
            .populate("product")
            .sort({ createdAt: -1 });
    }

    async create(orderData) {
        const order = new Order(orderData);
        return await order.save();
    }

    async transitionStatus(orderId, event, actorId, actorType) {
        const order = await Order.findById(orderId);
        if (!order) throw new Error("Order not found");

        if (actorType === 'farmer' && order.farmer.toString() !== actorId) {
            throw new Error("Not authorized");
        }
        if (actorType === 'business' && order.business.toString() !== actorId) {
            throw new Error("Not authorized");
        }

        if (!canTransition(order.status, event)) {
            throw new Error(`Cannot ${event} order in ${order.status} state`);
        }

        const newStatus = getNextState(order.status, event);
        order.status = newStatus;

        if (event === 'CONFIRM') order.confirmedAt = new Date();
        if (event === 'SHIP') order.shippedAt = new Date();
        if (event === 'DELIVER') order.deliveredAt = new Date();

        await order.save();
        return Order.findById(orderId)
            .populate("business")
            .populate("farmer")
            .populate("product");
    }

    async findAll() {
        return Order.find()
            .populate("business")
            .populate("farmer")
            .populate("product");
    }
}

module.exports = new OrderService();
