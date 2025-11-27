---
title: "Upgrading from WordPress: Architecting a Modern Data Portfolio"
description: "A deep dive into why I chose Astro and React for my portfolio, and how I built a robust, searchable data application platform."
pubDate: 2025-11-26
tags: ["Astro", "React", "CI-CD", "UX"]
---

# The Migration: From Static Site to Data App Shell

When setting out to build a new portfolio, I realized a traditional CMS like WordPress would be a constraint. A site showcasing **data engineering** needs to be a **software product**, not just a blog.

My final architecture uses **Astro** as the super-fast static shell, with **React** handling all interactive components (like the Twins Dashboard).

## 1. Key Architectural Decisions

We designed this platform around four core principles: Performance, Maintainability, Discoverability, and Reliability.

* **Astro Islands Architecture:** This allows us to ship almost zero JavaScript by default. Your article text loads instantly (static HTML), but complex components (like the Twins Dashboard) load React *only* where they are needed. This is the foundation of high-speed performance.
* **Modular CSS:** All styles are extracted into individual `.css` files (`global.css`, `cards.css`, etc.). This eliminates code block clutter and ensures a single style change updates every element across the site.
* **Content Collections:** All blog posts are managed via Markdown files, keeping the content in Git (version controlled) and guaranteeing fast build times.

## 2. Advanced UX & Engineering Features

I integrated several application-level features that demonstrate full-stack capabilities:

### 🔍 Spotlight Search (Cmd+K)
I implemented a full-site search, available globally from the header. This **React Modal** allows instant filtering of all blog posts, project descriptions, and tags without reloading the page. It's triggered by the developer-standard shortcut: **`Ctrl + K`** or **`Cmd + K`**.

### 🔗 Dynamic Tagging System
Every tag (like `#React` or `#Data Viz`) is automatically a navigable link. Clicking a tag generates a new, dedicated page that lists all related articles—a crucial feature for content discovery.

### 💻 The Analyst Terminal Aesthetic
The final visual design embraces the **"Midnight Developer"** dark theme. I implemented the **Windows XP 'Luna'** style on the featured Hero Card. This choice combines professional nostalgia with clear syntax highlighting, setting a unique tone for the portfolio.

## 3. Reliability: The CI/CD Pipeline

The entire site is deployed via Continuous Integration/Continuous Deployment.

* **Workflow:** When code is pushed to GitHub, a **GitHub Action** automatically logs into my Ubuntu VPS via SSH.
* **Action:** It pulls the latest changes, runs the `npm run build` command, and ensures all file permissions are correctly set for the Nginx web server.
* **Result:** The entire site deploys automatically, ensuring the live version is always the latest approved code—a key component of professional infrastructure.

This approach ensures my portfolio remains fast, scalable, and demonstrates modern, professional software engineering principles.