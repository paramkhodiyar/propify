const { sendEmail } = require('../lib/mail');

const sendContactMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {

    const adminEmail = process.env.ADMIN_EMAIL;

    const emailSubject = `New Contact Form Submission: ${subject}`;
    const text = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color:#f59e0b;">📨 New Contact Form Submission</h2>
    <h3>You are the admin owner of Propify Website, you can ignore this email</h3>
    <table style="border-collapse: collapse; margin-top: 10px;">
      <tr>
        <td style="padding: 6px 10px;"><strong>Name:</strong></td>
        <td style="padding: 6px 10px;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 6px 10px;"><strong>Email:</strong></td>
        <td style="padding: 6px 10px;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 6px 10px;"><strong>Subject:</strong></td>
        <td style="padding: 6px 10px;">${subject}</td>
      </tr>
    </table>

    <h4>Message:</h4>
    <div style="background:#f9f9f9; border-left:4px solid #f59e0b; padding:12px; margin:10px 0;">
      ${message.replace(/\n/g, "<br>")}
    </div>

    <hr/>
    <p style="font-size:12px;color:#777;">
      Sent from Propify Contact Form
    </p>
  </div>
`;

    await sendEmail(adminEmail, emailSubject, text, html);
    const autoReplySubject = "Thank you for your message";
    const autoReplyText = "Thank you for your message. We will get back to you as soon as possible.";
    const autoReplyHtml = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color:#f59e0b;">Thank you for your message</h2>
                <p>Thank you for your message. We will get back to you as soon as possible.</p>
            </div>
        `;
    await sendEmail(email, autoReplySubject, autoReplyText, autoReplyHtml);


    res.status(200).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

module.exports = { sendContactMessage };
