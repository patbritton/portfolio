// Security headers middleware for production
export function onRequest({ locals, request }, next) {
  // Define security headers
  const securityHeaders = {
    // Content Security Policy
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';",
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // Enable browser XSS protection
    'X-XSS-Protection': '1; mode=block',
    // Force HTTPS (31536000 = 1 year)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    // Control permissions
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  };

  return next().then(response => {
    // Add security headers to response
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  });
}
