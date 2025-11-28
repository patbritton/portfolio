// This file runs on the server only.
export const prerender = false; // Tell Astro this is dynamic

import nodemailer from 'nodemailer';

export const POST = async ({ request }) => {
  const data = await request.formData();
  const name = "Patrick's Portfolio";
  const email = data.get('email');
  const subject = data.get('subject');
  const message = data.get('message');
  const reason = data.get('reason') || 'General';

  // 1. Setup the Transporter (Use Gmail or your VPS SMTP)
  // You will set these env variables on the server later
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: import.meta.env.EMAIL_USER,
      pass: import.meta.env.EMAIL_PASS, // This is an App Password, not your login password
    },
  });

  // 2. Formatting the email
  const mailOptions = {
    from: `"${name}" <${import.meta.env.EMAIL_USER}>`,
    to: import.meta.env.EMAIL_USER, // Send to yourself
    replyTo: email,
    subject: `[Portfolio] ${subject}: ${reason}`,
    text: `From: ${email}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
        <h2 style="color: #0f172a;">New Message from Portfolio</h2>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Priority:</strong> ${reason}</p>
        <hr />
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    `,
  };

  // 3. Send
  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
};