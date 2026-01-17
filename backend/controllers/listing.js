const prisma = require('../lib/prisma');

const getListings = async (req, res) => {
    const q = req.query;
    const filters = {
        status: "ACTIVE", // Only show active listings by default
        ...(q.location && { location: { contains: q.location, mode: "insensitive" } }),
        ...(q.minPrice && { price: { gte: parseInt(q.minPrice) } }),
        ...(q.maxPrice && { price: { lte: parseInt(q.maxPrice) } }),
        ...(q.type && { type: q.type }),
        ...(q.city && { location: { contains: q.city, mode: "insensitive" } }),
        ...(q.property && { propertyType: q.property }), // Fixed propertyType field mapping
        ...(q.bedroom && { bedrooms: { gte: parseInt(q.bedroom) } }),
    };

    try {
        const listings = await prisma.listing.findMany({
            where: filters,
        });
        res.status(200).json(listings);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to get listings!' });
    }
};

const getListing = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const listing = await prisma.listing.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        name: true,
                        avatar: true,
                        email: true,
                        phone: true
                    },
                },
            },
        });

        // Increment view count
        if (listing) {
            await prisma.listing.update({
                where: { id },
                data: { views: { increment: 1 } }
            });
        }

        res.status(200).json(listing);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to get listing!' });
    }
};

const addListing = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;

    try {
        const newListing = await prisma.listing.create({
            data: {
                ...body,
                status: 'PENDING', // Force pending status
                userId: tokenUserId,
            },
        });
        res.status(200).json(newListing);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to create listing!' });
    }
};

const updateListing = async (req, res) => {
    const id = parseInt(req.params.id);
    const tokenUserId = req.userId;
    const body = req.body;

    try {
        const listing = await prisma.listing.findUnique({ where: { id } });

        if (!listing) return res.status(404).json({ message: "Listing not found" });

        if (listing.userId !== tokenUserId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not Authorized!' });
        }

        const updatedListing = await prisma.listing.update({
            where: { id },
            data: body,
        });
        res.status(200).json(updatedListing);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to update listing!' });
    }
};

const deleteListing = async (req, res) => {
    const id = parseInt(req.params.id);
    const tokenUserId = req.userId;

    try {
        const listing = await prisma.listing.findUnique({ where: { id } });

        if (!listing) return res.status(404).json({ message: "Listing not found" });

        if (listing.userId !== tokenUserId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not Authorized!' });
        }

        await prisma.listing.delete({
            where: { id },
        });
        res.status(200).json({ message: 'Listing deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to delete listing!' });
    }
};

const getMyListings = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const listings = await prisma.listing.findMany({
            where: { userId: tokenUserId },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(listings);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to get my listings!' });
    }
};

module.exports = { getListings, getListing, addListing, updateListing, deleteListing, getMyListings };
