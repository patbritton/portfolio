import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node'; // 1. Import Node

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://patrick.mp.ls',

  // 2. Switch to Hybrid (Mostly static, some dynamic)
  output: 'server',

  // 3. Add the Adapter
  adapter: node({
    mode: 'standalone'
  }),

  integrations: [react(), sitemap()],

  // Security headers
  vite: {
    server: {
      headers: {
        // Content Security Policy - Allow inline styles and scripts for Astro
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
      }
    }
  }
});