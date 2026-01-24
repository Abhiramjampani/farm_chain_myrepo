const auctionService = require("../../services/auctionService");

const auctionResolver = {
    Query: {
        getAuction: async (_, { id }) => {
            return auctionService.findById(id);
        },
        myAuctions: async (_, __, context) => {
            if (!context.user) throw new Error("Farmer auth required");
            return auctionService.findByFarmer(context.user._id);
        },
        openAuctions: async () => {
            return auctionService.findOpen();
        },
        auctionBids: async (_, { auctionId }) => {
            return auctionService.getBidsForAuction(auctionId);
        }
    },

    Mutation: {
        createAuction: async (_, { productId, batchId, minPricePerKg, quantity, deadlineHours }, context) => {
            if (!context.user) throw new Error("Farmer auth required");
            
            const deadline = new Date();
            deadline.setHours(deadline.getHours() + deadlineHours);

            return auctionService.create({
                farmer: context.user._id,
                product: productId,
                batch: batchId,
                minPricePerKg,
                quantity,
                deadline,
                status: 'open'
            });
        },

        placeBid: async (_, { auctionId, pricePerKg }, context) => {
            if (!context.business) throw new Error("Business auth required");
            return auctionService.placeBid(auctionId, context.business._id, pricePerKg);
        },

        closeAuction: async (_, { auctionId }, context) => {
            if (!context.user) throw new Error("Farmer auth required");
            return auctionService.closeAuction(auctionId, context.user._id.toString());
        },

        awardAuction: async (_, { auctionId }, context) => {
            if (!context.user) throw new Error("Farmer auth required");
            return auctionService.awardAuction(auctionId, context.user._id.toString());
        }
    },

    Auction: {
        id: (parent) => parent._id.toString()
    },

    Bid: {
        id: (parent) => parent._id.toString()
    }
};

module.exports = auctionResolver;
