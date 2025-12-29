// This file runs on the server only.
export const prerender = false; // Tell Astro this is dynamic

import nodemailer from 'nodemailer';
import xss from 'xss';
import validator from 'validator';

// Rate limiting store (in-memory, resets on server restart)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 3; // Max 3 emails per 15 minutes per IP

// Simple CSRF token store (for production, use Redis or similar)
const csrfTokens = new Map();

// Generate CSRF token endpoint
export const GET = async ({ request, clientAddress }) => {
  const token = crypto.randomUUID();
  const ip = clientAddress || 'unknown';

  csrfTokens.set(token, {
    ip,
    createdAt: Date.now(),
    expiresAt: Date.now() + (30 * 60 * 1000) // 30 minutes
  });

  // Clean up expired tokens
  for (const [key, value] of csrfTokens.entries()) {
    if (value.expiresAt < Date.now()) {
      csrfTokens.delete(key);
    }
  }

  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST = async ({ request, clientAddress }) => {
  const ip = clientAddress || 'unknown';

  // Rate limiting check
  const now = Date.now();
  const userRequests = rateLimitStore.get(ip) || [];
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= MAX_REQUESTS) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Too many requests. Please try again later.'
      }),
      { status: 429 }
    );
  }

  const data = await request.formData();
  const name = "Patrick's Portfolio";
  const email = data.get('email');
  const subject = data.get('subject');
  const message = data.get('message');
  const reason = data.get('reason') || 'General';
  const csrfToken = data.get('csrf_token');

  // CSRF token validation
  const tokenData = csrfTokens.get(csrfToken);
  if (!tokenData || tokenData.expiresAt < Date.now()) {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid or expired security token' }),
      { status: 403 }
    );
  }

  // Remove used token
  csrfTokens.delete(csrfToken);

  // Input validation
  const errors = [];

  if (!email || !validator.isEmail(email)) {
    errors.push('Valid email address is required');
  }

  if (!subject || subject.trim().length === 0) {
    errors.push('Subject is required');
  } else if (subject.length > 200) {
    errors.push('Subject must be less than 200 characters');
  }

  if (!message || message.trim().length === 0) {
    errors.push('Message is required');
  } else if (message.length > 5000) {
    errors.push('Message must be less than 5000 characters');
  }

  const validReasons = ['General', 'Project', 'Collaboration', 'Job Opportunity', 'Other'];
  if (!validReasons.includes(reason)) {
    errors.push('Invalid reason selected');
  }

  if (errors.length > 0) {
    return new Response(
      JSON.stringify({ success: false, error: errors.join(', ') }),
      { status: 400 }
    );
  }

  // Sanitize inputs to prevent XSS
  const sanitizedEmail = validator.normalizeEmail(email);
  const sanitizedSubject = xss(subject.trim());
  const sanitizedMessage = xss(message.trim());
  const sanitizedReason = xss(reason);

  // 1. Setup the Transporter (Use Gmail or your VPS SMTP)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: import.meta.env.EMAIL_USER,
      pass: import.meta.env.EMAIL_PASS,
    },
  });

  // 2. Formatting the email with sanitized content
  const mailOptions = {
    from: `"${name}" <${import.meta.env.EMAIL_USER}>`,
    to: import.meta.env.EMAIL_USER,
    replyTo: sanitizedEmail,
    subject: `[Portfolio] ${sanitizedSubject}: ${sanitizedReason}`,
    text: `From: ${sanitizedEmail}\n\nMessage:\n${sanitizedMessage}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
        <h2 style="color: #0f172a;">New Message from Portfolio</h2>
        <p><strong>From:</strong> ${sanitizedEmail}</p>
        <p><strong>Subject:</strong> ${sanitizedSubject}</p>
        <p><strong>Priority:</strong> ${sanitizedReason}</p>
        <hr />
        <p style="white-space: pre-wrap;">${sanitizedMessage}</p>
      </div>
    `,
  };

  // 3. Send
  try {
    await transporter.sendMail(mailOptions);

    // Update rate limit
    recentRequests.push(now);
    rateLimitStore.set(ip, recentRequests);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    // Log error server-side only, don't expose details to client
    console.error('Email send error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to send email. Please try again later.'
      }),
      { status: 500 }
    );
  }
};