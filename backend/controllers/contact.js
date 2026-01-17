const { sendEmail } = require('../lib/mail');

const sendContactMessage = async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        // Send email to Admin
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@mayarealestate.in'; // Ensure this is set or fallback

        const emailSubject = `New Contact Form Submission: ${subject}`;
        const text = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        const html = `
            <h3>New Contact Form Message</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #f59e0b;">
                ${message.replace(/\n/g, '<br>')}
            </blockquote>
        `;

        await sendEmail(adminEmail, emailSubject, text, html);

        // Optional: Send auto-reply to user?
        // await sendEmail(email, "We received your message", "Thanks for contacting us...", "...");

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to send message' });
    }
};

module.exports = { sendContactMessage };
