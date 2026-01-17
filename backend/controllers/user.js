const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');

const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to get users!' });
    }
};

const getUser = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                listings: true,
                savedListings: {
                    include: { listing: true }
                }
            }
        });

        if (!user) return res.status(404).json({ message: "User not found!" });

        const { password, ...userInfo } = user;
        res.status(200).json(userInfo);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to get user!' });
    }
};

const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const tokenUserId = req.userId;
    const { password, avatar, ...inputs } = req.body;

    if (id !== tokenUserId && req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Not Authorized!' });
    }

    let updatedPassword = null;
    try {
        if (password) {
            updatedPassword = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...inputs,
                ...(updatedPassword && { password: updatedPassword }),
                ...(avatar && { avatar }),
            },
        });

        const { password: userPassword, ...rest } = updatedUser;

        res.status(200).json(rest);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to update user!' });
    }
};

const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const tokenUserId = req.userId;

    if (id !== tokenUserId && req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Not Authorized!' });
    }

    try {
        await prisma.user.delete({
            where: { id },
        });
        res.status(200).json({ message: 'User deleted!' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to delete user!' });
    }
};

const saveListing = async (req, res) => {
    const listingId = parseInt(req.body.listingId);
    const tokenUserId = req.userId;

    try {
        const savedListing = await prisma.savedListing.findUnique({
            where: {
                userId_listingId: {
                    userId: tokenUserId,
                    listingId,
                },
            },
        });

        if (savedListing) {
            await prisma.savedListing.delete({
                where: {
                    id: savedListing.id,
                },
            });
            res.status(200).json({ message: 'Listing removed from saved list' });
        } else {
            await prisma.savedListing.create({
                data: {
                    userId: tokenUserId,
                    listingId,
                },
            });
            res.status(200).json({ message: 'Listing saved' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to save listing!' });
    }
};

const getProfilePosts = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const userPosts = await prisma.listing.findMany({
            where: { userId: tokenUserId },
        });
        const saved = await prisma.savedListing.findMany({
            where: { userId: tokenUserId },
            include: {
                listing: true,
            },
        });

        const savedListings = saved.map((item) => item.listing);
        res.status(200).json({ userPosts, savedListings });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to get profile posts!' });
    }
};

const getNotificationNumber = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const number = await prisma.chat.count({
            where: {
                userIDs: {
                    hasSome: [tokenUserId],
                },
                NOT: {
                    seenBy: {
                        hasSome: [tokenUserId],
                    },
                },
            },
        });
        res.status(200).json(number);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to get notification number!' });
    }
};

const requestUpgrade = async (req, res) => {
    const id = parseInt(req.params.id);
    const tokenUserId = req.userId;
    const { aadharNumber } = req.body;

    if (id !== tokenUserId) {
        return res.status(403).json({ message: 'Not Authorized!' });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                aadharNumber,
                upgradeRequested: true
            },
        });
        const { password, ...rest } = updatedUser;
        res.status(200).json(rest);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to request upgrade!' });
    }
};

module.exports = { getUsers, getUser, updateUser, deleteUser, saveListing, getProfilePosts, getNotificationNumber, requestUpgrade };
