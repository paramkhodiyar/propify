const prisma = require('../lib/prisma');

const getAdminStats = async (req, res) => {

    try {
        const totalUsers = await prisma.user.count();
        const totalListings = await prisma.listing.count();
        const totalInquiries = await prisma.inquiry.count();
        const recentListings = await prisma.listing.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { title: true, createdAt: true, user: { select: { name: true } } }
        });

        res.json({
            totalUsers,
            totalListings,
            totalInquiries,
            recentListings
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get admin stats" });
    }
}

const getAgentStats = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const myListingsCount = await prisma.listing.count({
            where: { userId: tokenUserId }
        });

        const myInquiriesCount = await prisma.inquiry.count({
            where: {
                listing: {
                    userId: tokenUserId
                }
            }
        });


        const viewsData = await prisma.listing.aggregate({
            where: { userId: tokenUserId },
            _sum: {
                views: true
            }
        });

        res.json({
            activeListings: myListingsCount,
            totalLeads: myInquiriesCount,
            totalViews: viewsData._sum.views || 0
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get agent stats" });
    }
}


module.exports = { getAdminStats, getAgentStats };
