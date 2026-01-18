const prisma = require('../lib/prisma');

const approveUser = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                isVerified: true,
                upgradeRequested: false,
                role: 'AGENT' 
            }
        });
        res.status(200).json({ message: 'User approved and upgraded to Agent', user: updatedUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to approve user!' });
    }
};

const rejectUser = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await prisma.user.update({
            where: { id },
            data: {
                upgradeRequested: false,
                
            }
        });
        res.status(200).json({ message: 'User upgrade rejected' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to reject user!' });
    }
}

const approveListing = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const updatedListing = await prisma.listing.update({
            where: { id },
            data: {
                status: 'ACTIVE'
            }
        });
        res.status(200).json({ message: 'Listing approved', listing: updatedListing });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to approve listing!' });
    }
};

const rejectListing = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await prisma.listing.update({
            where: { id },
            data: { status: 'REJECTED' }
        });
        res.status(200).json({ message: 'Listing rejected' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to reject listing!' });
    }
}

const getPendingUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { upgradeRequested: true }
        });
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to get pending users!' });
    }
};

const getPendingListings = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            where: { status: 'PENDING' },
            include: { user: true }
        });
        res.status(200).json(listings);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to get pending listings!' });
    }
};

const getAllListings = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(listings);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to get all listings!' });
    }
};

module.exports = { approveUser, rejectUser, approveListing, rejectListing, getPendingUsers, getPendingListings, getAllListings };
