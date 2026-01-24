const Auction = require("../models/auction");
const Bid = require("../models/bid");
const { canTransition, getNextState } = require("./auctionStateMachine");

class AuctionService {
    async findById(id) {
        return Auction.findById(id)
            .populate("farmer")
            .populate("product")
            .populate("highestBidder");
    }

    async findByFarmer(farmerId) {
        return Auction.find({ farmer: farmerId })
            .populate("product")
            .populate("highestBidder")
            .sort({ createdAt: -1 });
    }

    async findOpen() {
        return Auction.find({ status: 'open' })
            .populate("farmer")
            .populate("product")
            .sort({ deadline: 1 });
    }

    async create(auctionData) {
        const auction = new Auction(auctionData);
        return await auction.save();
    }

    async placeBid(auctionId, businessId, pricePerKg) {
        const auction = await Auction.findById(auctionId);
        if (!auction) throw new Error("Auction not found");
        if (auction.status !== 'open') throw new Error("Auction is not open");
        if (new Date() > auction.deadline) throw new Error("Auction has expired");
        if (pricePerKg <= auction.highestBid) throw new Error(`Bid must be higher than ${auction.highestBid}`);

        const bid = new Bid({
            auction: auctionId,
            business: businessId,
            pricePerKg,
            quantity: auction.quantity,
            bidAmount: pricePerKg * auction.quantity
        });
        await bid.save();

        auction.highestBid = pricePerKg;
        auction.highestBidder = businessId;
        await auction.save();

        return this.findById(auctionId);
    }

    async closeAuction(auctionId, farmerId) {
        const auction = await Auction.findById(auctionId);
        if (!auction) throw new Error("Auction not found");
        if (auction.farmer.toString() !== farmerId) throw new Error("Not authorized");
        if (!canTransition(auction.status, 'CLOSE')) throw new Error("Cannot close auction");

        auction.status = getNextState(auction.status, 'CLOSE');
        await auction.save();
        return this.findById(auctionId);
    }

    async awardAuction(auctionId, farmerId) {
        const auction = await Auction.findById(auctionId);
        if (!auction) throw new Error("Auction not found");
        if (auction.farmer.toString() !== farmerId) throw new Error("Not authorized");
        if (!auction.highestBidder) throw new Error("No bids to award");
        if (!canTransition(auction.status, 'AWARD')) throw new Error("Cannot award - close auction first");

        auction.status = getNextState(auction.status, 'AWARD');
        await auction.save();
        return this.findById(auctionId);
    }

    async getBidsForAuction(auctionId) {
        return Bid.find({ auction: auctionId })
            .populate("business")
            .sort({ createdAt: -1 });
    }
}

module.exports = new AuctionService();
