# Patrick's Data Lab 🧪

![Project Status](https://img.shields.io/badge/Status-Live%20Data%20App-success)
![Tech Stack](https://img.shields.io/badge/Built%20With-Astro%20(Node.js)%20%7C%20React%20%7C%20Recharts-blueviolet)
![Deployment](https://img.shields.io/badge/Deployment-CI%2FCD%20%2B%20Nginx%2FPM2-orange)

A modern **Data Product Portfolio** designed to bridge the gap between static analysis and interactive software engineering. It is structured as a high-performance, full-stack data application.

**Live Site:** [https://patrick.mp.ls](https://patrick.mp.ls)

***

## 🚀 About The Project

This platform is a custom-engineered **Hybrid Data Application Platform** built on the modern **Astro Islands Architecture**. It is engineered to host complex, interactive dashboards and technical case studies, demonstrating full-stack engineering skills.

### Key Features
* **Hybrid Architecture:** Uses Astro for server-side generated HTML content (SEO/Speed) and hydrates **React components** for interactivity on-demand (Islands).
* **Spotlight Search:** Global, client-side fuzzy search (triggered by `Cmd+K` or `Ctrl+K`) that instantly filters all blog posts and tags.
* **Dynamic Tagging:** Automatic generation of tag-specific pages (`/tags/[tag].astro`) for improved content discovery.
* **Advanced SEO:** Utilizes dynamic Open Graph (OG) image generation via an Edge function (`/api/og/[slug].tsx`) and comprehensive JSON-LD schema for all articles and pages.
* **Modular Design:** Decoupled logic and styling (`/src/styles`) for maintainability.

***

## 📊 Featured Dashboard: Twins Analytics Suite

An interactive deep-dive into **120+ years** of Minnesota Twins/Washington Senators history.

> **Goal:** Move beyond static Excel charts to allow users to ask their own questions about the data.

### Key Capabilities
* **Live Data Source:** Data is dynamically fetched on page load from a **Live Google Sheet via its CSV export API** using `PapaParse`, requiring zero code changes for data updates.
* **The Time Machine:** Users can scrub the `Focus Year` slider to instantly update all metric cards and chart reference lines for any season from 1901–2025.
* **Deep-Dive Modals:** Click any metric card (e.g., Wins, Payroll, Attendance) to open a full-screen modal showing a **zoomable Area Chart** for that metric's historical trend and all-time ranking.
* **Export:** Data for the currently filtered range can be exported directly to a CSV file.

***

## 🛠️ Technical Stack

### Frontend & Engineering
* **Framework:** [Astro](https://astro.build/) (`output: 'server'` with Node.js Adapter)
* **UI Library:** [React](https://react.dev/) (Component Logic)
* **Visualization:** [Recharts](https://recharts.org/) (SVG-based charting)
* **Data Fetching:** `PapaParse` for CSV streaming
* **Contact Form:** Handled by a **server endpoint** using **Nodemailer**

### DevOps & Infrastructure
* **Server:** Ubuntu VPS
* **Adapter:** `@astrojs/node`
* **Process Manager:** PM2 (Keeps the Node.js process running and handles restarts)
* **Web Server:** Nginx (Acts as a reverse proxy)
* **CI/CD:** GitHub Actions (Auto-deploys on push to `main`)

***

## 📂 Project Structure

```text
src/
├── components/        # React Widgets (Search, Dashboards)
├── content/           # Markdown Blog Posts (CMS)
├── layouts/           # Astro Layout Shells (Header, Footer)
├── pages/             # File-based Routing
│   ├── api/           # Dynamic Server Endpoints (OG Images, Email)
│   ├── blog/          # Dynamic Blog Routes ([...slug].astro)
│   └── projects/      # Dashboard Pages
└── styles/            # Modular CSS Files (global, cards, search, etc.)
```

***

## ⚡ Local Development
To run this portfolio locally:

Clone the repo:

```bash
git clone [https://github.com/patbritton/portfolio.git](https://github.com/patbritton/portfolio.git)
cd portfolio
```
Install dependencies:

```bash
npm install
```
Run the Dev Server:

```bash
npm run dev
```
Visit `http://localhost:4321` to see the app.

***

## 🔄 Deployment Pipeline
This project uses a CI/CD pipeline defined in `.github/workflows/deploy.yml` that handles the server-side build and process management.

The deployment process is:
1.  Code is pushed to `main`.
2.  GitHub Actions logs into the VPS via SSH.
3.  It runs `git reset --hard origin/main` and `npm install`.
4.  It runs `npm run build` to generate the static assets and the Node.js server bundle (`dist/server/entry.mjs`).
5.  It runs the **critical step** `pm2 restart portfolio` to load the new server bundle.