const prisma = require('../lib/prisma');

const { sendEmail } = require('../lib/mail');

const addInquiry = async (req, res) => {
    const { listingId, message } = req.body;
    const tokenUserId = req.userId;

    try {
        const listing = await prisma.listing.findUnique({
            where: { id: parseInt(listingId) },
            include: { user: true } // Include owner details
        });

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        if (listing.userId === tokenUserId) {
            return res.status(400).json({ message: "You cannot send inquiry to your own listing" });
        }

        const sender = await prisma.user.findUnique({ where: { id: tokenUserId } });

        const newInquiry = await prisma.inquiry.create({
            data: {
                userId: tokenUserId,
                listingId: parseInt(listingId),
                message,
            },
        });

        // Send Email to Agent
        if (listing.user && listing.user.email) {
            const subject = `New Inquiry for ${listing.title}`;
            const text = `You have a new inquiry from ${sender.name} (${sender.email}):\n\n"${message}"\n\nView it on your dashboard.`;
            const html = `
                <h3>New Inquiry Received</h3>
                <p><strong>Property:</strong> ${listing.title}</p>
                <p><strong>From:</strong> ${sender.name} (<a href="mailto:${sender.email}">${sender.email}</a>)</p>
                <p><strong>Message:</strong></p>
                <blockquote style="background: #f9f9f9; border-left: 10px solid #ccc; margin: 1.5em 10px; padding: 0.5em 10px;">
                    ${message}
                </blockquote>
                <p><a href="http://localhost:3000/dashboard">Go to Dashboard</a></p>
            `;

            await sendEmail(listing.user.email, subject, text, html);
        }

        res.status(200).json(newInquiry);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to create inquiry!' });
    }
};

const getInquiries = async (req, res) => {
    const tokenUserId = req.userId;
    const role = req.user.role;

    try {
        let inquiries;

        if (role === 'AGENT' || role === 'ADMIN') {
            // Get inquiries for listings owned by this agent
            inquiries = await prisma.inquiry.findMany({
                where: {
                    listing: {
                        userId: tokenUserId
                    }
                },
                include: {
                    user: {
                        select: { name: true, email: true, phone: true }
                    },
                    listing: {
                        select: { title: true, id: true }
                    }
                }
            });
        } else {
            // Get inquiries sent by this user
            inquiries = await prisma.inquiry.findMany({
                where: {
                    userId: tokenUserId
                },
                include: {
                    listing: {
                        select: { title: true, id: true, location: true, price: true, image: true } // Assuming image is part of model? Checking schema... it is images[]
                    }
                }
            });
        }

        res.status(200).json(inquiries);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to get inquiries!' });
    }
};

module.exports = { addInquiry, getInquiries };
