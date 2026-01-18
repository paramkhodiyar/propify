const prisma = require('../lib/prisma');

const { sendEmail } = require('../lib/mail');

const addInquiry = async (req, res) => {
    const { listingId, message } = req.body;
    const tokenUserId = req.userId;

    try {
        const listing = await prisma.listing.findUnique({
            where: { id: parseInt(listingId) },
            include: { user: true }
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
        console.log(process.env.ADMIN_EMAIL)
        if (listing.user && listing.user.email) {
            const subject = `New Inquiry for ${listing.title}`;
            const text = `You have a new inquiry from ${sender.name} (${sender.email}):\n\n"${message}"\n\nView it on your dashboard.`;
            const html = `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2 style="color:#f59e0b;">📩 New Property Inquiry</h2>

                        <p>You have received a new inquiry for your property:</p>

                        <table style="border-collapse: collapse; margin-top: 10px;">
                        <tr>
                            <td style="padding: 6px 10px;"><strong>Property:</strong></td>
                            <td style="padding: 6px 10px;">${listing.title}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 10px;"><strong>From:</strong></td>
                            <td style="padding: 6px 10px;">${sender.name} (${sender.email})</td>
                        </tr>
                        </table>

                        <h4>Message:</h4>
                        <div style="background:#f9f9f9; border-left:4px solid #f59e0b; padding:12px; margin:10px 0;">
                        ${message.replace(/\n/g, "<br>")}
                        </div>

                        <p>
                        👉 <a href="https://propify-gamma.vercel.app/dashboard" style="color:#f59e0b; font-weight:bold;">
                            View in Dashboard
                        </a>
                        </p>

                        <hr/>
                        <p style="font-size:12px;color:#777;">
                        This email was sent by Propify Real Estate Platform.
                        </p>
                    </div>
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

            inquiries = await prisma.inquiry.findMany({
                where: {
                    userId: tokenUserId
                },
                include: {
                    listing: {
                        select: { title: true, id: true, location: true, price: true, image: true } 
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
