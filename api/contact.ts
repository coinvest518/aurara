/// <reference types="vite/client" />
import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: import.meta.env.VITE_SMTP_HOST || 'smtp.gmail.com',
  port: Number(import.meta.env.VITE_SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: import.meta.env.VITE_SMTP_USER,
    pass: import.meta.env.VITE_SMTP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const { name, email, interest, message } = await req.json();

    // Send mail with defined transport object
    await transporter.sendMail({      from: `"Aurarora Contact Form" <${import.meta.env.VITE_SMTP_FROM_EMAIL}>`,
      to: import.meta.env.VITE_CONTACT_EMAIL, // your receiving email
      subject: `New Custom AI Companion Request - ${interest}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Interest:</strong> ${interest}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send message' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
