import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node'; // 1. Import Node

export default defineConfig({
  site: 'https://patrick.mp.ls',
  
  // 2. Switch to Hybrid (Mostly static, some dynamic)
  output: 'hybrid',
  
  // 3. Add the Adapter
  adapter: node({
    mode: 'standalone'
  }),

  integrations: [react()],
});