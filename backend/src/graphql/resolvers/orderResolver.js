const orderService = require("../../services/orderService");
const productService = require("../../services/productService");
const { getAllowedEvents } = require("../../stateMachines/orderStateMachine");

const orderResolver = {
    Query: {
        getOrder: async (_, { id }) => {
            return orderService.findById(id);
        },
        getOrderByOrderId: async (_, { orderId }) => {
            return orderService.findByOrderId(orderId);
        },
        myOrders: async (_, __, context) => {
            if (!context.business) throw new Error("Business auth required");
            return orderService.findByBusiness(context.business._id);
        },
        ordersReceived: async (_, __, context) => {
            if (!context.user) throw new Error("Farmer auth required");
            return orderService.findByFarmer(context.user._id);
        }
    },

    Mutation: {
        placeOrder: async (_, { productId, quantity }, context) => {
            if (!context.business) throw new Error("Business auth required");

            const product = await productService.findById(productId);
            if (!product) throw new Error("Product not found");
            if (product.status !== 'active') throw new Error("Product not available");
            if (product.availableQty < quantity) throw new Error("Insufficient quantity");
            if (quantity < product.minOrderQty) throw new Error(`Minimum order: ${product.minOrderQty} kg`);

            const totalAmount = product.pricePerKg * quantity;

            const order = await orderService.create({
                business: context.business._id,
                farmer: product.farmer._id,
                product: productId,
                quantity,
                pricePerKg: product.pricePerKg,
                totalAmount,
                status: 'pending'
            });

            await productService.reduceQty(productId, quantity);

            return orderService.findById(order._id);
        },

        confirmOrder: async (_, { orderId }, context) => {
            if (!context.user) throw new Error("Farmer auth required");
            return orderService.transitionStatus(orderId, 'CONFIRM', context.user._id.toString(), 'farmer');
        },

        shipOrder: async (_, { orderId }, context) => {
            if (!context.user) throw new Error("Farmer auth required");
            return orderService.transitionStatus(orderId, 'SHIP', context.user._id.toString(), 'farmer');
        },

        confirmDelivery: async (_, { orderId }, context) => {
            if (!context.business) throw new Error("Business auth required");
            return orderService.transitionStatus(orderId, 'DELIVER', context.business._id.toString(), 'business');
        },

        cancelOrder: async (_, { orderId }, context) => {
            const order = await orderService.findById(orderId);
            if (!order) throw new Error("Order not found");

            let actorId, actorType;
            if (context.business && order.business._id.toString() === context.business._id.toString()) {
                actorId = context.business._id.toString();
                actorType = 'business';
            } else if (context.user && order.farmer._id.toString() === context.user._id.toString()) {
                actorId = context.user._id.toString();
                actorType = 'farmer';
            } else {
                throw new Error("Not authorized");
            }

            return orderService.transitionStatus(orderId, 'CANCEL', actorId, actorType);
        }
    },

    Order: {
        id: (parent) => parent._id.toString(),
        allowedActions: (parent) => getAllowedEvents(parent.status)
    }
};

module.exports = orderResolver;
