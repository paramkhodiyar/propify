// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    // Add more detailed logging
    console.log('Contact API called');

    const body: ContactFormData = await request.json();
    console.log('Request body parsed:', { ...body, message: body.message?.substring(0, 50) + '...' });
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check environment variables
    console.log('Environment check:', {
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_PASS: !!process.env.EMAIL_PASS,
      NODE_ENV: process.env.NODE_ENV
    });

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing email configuration');
      return NextResponse.json(
        { message: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Create transporter with better error handling
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify transporter configuration
    await transporter.verify();

    // Email to you (admin notification)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706; border-bottom: 2px solid #d97706; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #d97706; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${message}</p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #92400e;">
              <strong>Action Required:</strong> Please respond to this inquiry within 24 hours.
            </p>
          </div>
        </div>
      `,
    };

    // Confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Propify Real Estate',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #92400e; margin: 0; font-size: 28px;">Propify Real Estate</h1>
            <p style="color: #d97706; margin: 10px 0 0 0; font-size: 16px;">Your Trusted Property Partner in Chhattisgarh</p>
          </div>
          
          <div style="background-color: #fff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Thank You for Contacting Us!</h2>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              Dear ${name},
            </p>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              Thank you for reaching out to Propify Real Estate. We have received your inquiry regarding 
              "<strong>${subject}</strong>" and truly appreciate your interest in our services.
            </p>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #d97706; margin-top: 0;">What happens next?</h3>
              <ul style="color: #555; line-height: 1.8; padding-left: 20px;">
                <li>Our expert team will review your inquiry within 2-4 hours</li>
                <li>One of our experienced agents will contact you within 24 hours</li>
                <li>We'll provide you with personalized solutions for your property needs</li>
              </ul>
            </div>
            
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0;">Need Immediate Assistance?</h3>
              <p style="color: #92400e; margin-bottom: 10px;">Feel free to contact us directly:</p>
              <p style="color: #92400e; margin: 5px 0;"><strong>📞 Phone:</strong> +91 9876543210</p>
              <p style="color: #92400e; margin: 5px 0;"><strong>📧 Email:</strong> info@mayare.in</p>
              <p style="color: #92400e; margin: 5px 0;"><strong>📍 Office:</strong> Raipur, Chhattisgarh</p>
            </div>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              We look forward to helping you find your perfect property in Chhattisgarh!
            </p>
            
            <div style="border-top: 2px solid #d97706; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #92400e; margin: 0; font-weight: bold;">Propify Real Estate Team</p>
              <p style="color: #d97706; margin: 5px 0 0 0; font-size: 14px;">Making Property Dreams Come True</p>
            </div>
          </div>
        </div>
      `,
    };

    // Send both emails
    console.log('Sending emails...');
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    console.log('Emails sent successfully');
    return NextResponse.json(
      { message: 'Thank you for your message. We will get back to you soon!' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('API Error:', error);
    console.error('Detailed error:', {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });

    // Return a more specific error message
    let errorMessage = 'Failed to send email';
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your email credentials.';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Email service not found. Please check your internet connection.';
    } else if (error.message) {
      errorMessage = `Email error: ${error.message}`;
    }

    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}