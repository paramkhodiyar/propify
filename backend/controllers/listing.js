const prisma = require('../lib/prisma');

const getListings = async (req, res) => {
    const q = req.query;

    const filters = {
        status: "ACTIVE",
        ...(q.location && { location: { contains: q.location, mode: "insensitive" } }),
        ...(q.minPrice && { price: { gte: Number(q.minPrice) } }),
        ...(q.maxPrice && { price: { lte: Number(q.maxPrice) } }),
        ...(q.type && { type: q.type }),
        ...(q.propertyType && { propertyType: q.propertyType }),
        ...(q.bedrooms && { bedrooms: { gte: Number(q.bedrooms) } }),
    };

    try {
        const listings = await prisma.listing.findMany({
            where: filters,
            orderBy: { createdAt: "desc" },
        });

        res.json(listings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get listings" });
    }
};

const getListing = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const listing = await prisma.listing.findUnique({
            where: { id },
            include: {
                user: {
                    select: { name: true, avatar: true, email: true, phone: true },
                },
            },
        });

        if (!listing) return res.status(404).json({ message: "Listing not found" });

        await prisma.listing.update({
            where: { id },
            data: { views: { increment: 1 } },
        });

        res.json(listing);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get listing" });
    }
};

const addListing = async (req, res) => {
    const userId = req.userId;

    const {
        title,
        description,
        price,
        location,
        type,
        propertyType,
        bedrooms,
        bathrooms,
        area,
        amenities,
        images,
        tags,
    } = req.body;

    if (!title || !price || !location || !type || !propertyType || !images?.length) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const newListing = await prisma.listing.create({
            data: {
                title,
                description,
                price: Number(price),
                location,
                type,
                propertyType,
                bedrooms: Number(bedrooms),
                bathrooms: Number(bathrooms),
                area: Number(area),
                amenities: amenities || [],
                images,
                tags: tags || [],
                status: "PENDING",
                userId,
            },
        });

        res.status(201).json(newListing);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create listing" });
    }
};

const updateListing = async (req, res) => {
    const id = Number(req.params.id);
    const userId = req.userId;

    try {
        const listing = await prisma.listing.findUnique({ where: { id } });

        if (!listing) return res.status(404).json({ message: "Not found" });

        if (listing.userId !== userId && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Not authorized" });
        }

        let newStatus = listing.status;


        if (listing.status === 'REJECTED') {
            const lastUpdated = new Date(listing.updatedAt);
            const now = new Date();
            const diffHours = (now - lastUpdated) / (1000 * 60 * 60);

            if (diffHours < 24) {
                const remaining = Math.ceil(24 - diffHours);
                return res.status(403).json({
                    message: `Application rejected. You can re-apply in ${remaining} hours.`
                });
            }
            newStatus = 'PENDING';
        }

        const allowedFields = [
            "title",
            "description",
            "price",
            "location",
            "type",
            "propertyType",
            "bedrooms",
            "bathrooms",
            "area",
            "amenities",
            "images",
            "tags",
            "status",
        ];

        const data = {};
        for (const key of allowedFields) {
            if (req.body[key] !== undefined) data[key] = req.body[key];
        }


        if (listing.status === 'REJECTED' && newStatus === 'PENDING') {
            data.status = 'PENDING';
        }

        const updated = await prisma.listing.update({
            where: { id },
            data,
        });

        res.json({ message: "Listing updated successfully", listing: updated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update listing" });
    }
};

const deleteListing = async (req, res) => {
    const id = Number(req.params.id);
    const userId = req.userId;

    try {
        const listing = await prisma.listing.findUnique({ where: { id } });

        if (!listing) return res.status(404).json({ message: "Not found" });

        if (listing.userId !== userId && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Not authorized" });
        }

        await prisma.listing.delete({ where: { id } });

        res.json({ message: "Listing deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete listing" });
    }
};

const getMyListings = async (req, res) => {
    const userId = req.userId;

    try {
        const listings = await prisma.listing.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        res.json(listings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get your listings" });
    }
};

module.exports = {
    getListings,
    getListing,
    addListing,
    updateListing,
    deleteListing,
    getMyListings,
};
