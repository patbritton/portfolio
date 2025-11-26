# Patrick's Data Lab 🧪

![Project Status](https://img.shields.io/badge/Status-Live-success)
![Tech Stack](https://img.shields.io/badge/Built%20With-Astro%20%7C%20React%20%7C%20Recharts-blueviolet)
![Deployment](https://img.shields.io/badge/Deploy-VPS%20%2B%20Nginx-orange)

A modern **Data Product Portfolio** designed to bridge the gap between static analysis and interactive software engineering. 

**Live Site:** [https://patrick.mp.ls](https://patrick.mp.ls)

---

## 🚀 About The Project

This is not a standard WordPress portfolio. It is a custom-engineered **Data Application Platform** built to host interactive dashboards, visualizations, and technical case studies.

It uses **Astro** as the "App Shell" to provide a high-performance static core, while hydrating **React** components on-demand for complex data interactivity (Islands Architecture).

### Key Features
* **Hybrid Architecture:** Static HTML for content (SEO/Speed) + React for interactivity.
* **Modular Design:** Decoupled logic and styling (`/src/styles`) for maintainability.
* **Content Engine:** Markdown-based blog with a custom Tagging and Search system.
* **Dark Mode:** Custom "Midnight" palette optimized for long reading sessions.

---

## 📊 Featured Dashboard: Twins Analytics Suite

An interactive deep-dive into **120+ years** of Minnesota Twins/Washington Senators history.

> **Goal:** Move beyond static Excel charts to allow users to ask their own questions about the data.

**Capabilities:**
* **The Time Machine:** Scrub through history (1901–2025) to compare eras.
* **Sandbox Mode:** Users can swap X/Y axes to find correlations (e.g., *Payroll vs. Wins* or *Attendance vs. Home Runs*).
* **Drill-Down Modals:** Click any metric card for historical rankings and deep-dive trend lines.
* **Composite Dataset:** Merged historical Retrosheet data with modern payroll figures, excluding statistical anomalies (2020 COVID season).

---

## 🛠️ Technical Stack

### Frontend & Engineering
* **Framework:** [Astro](https://astro.build/) (Server-Side Generation)
* **UI Library:** [React](https://react.dev/) (Component Logic)
* **Visualization:** [Recharts](https://recharts.org/) (SVG-based charting)
* **Styling:** Custom CSS Variables (No heavy frameworks)
* **Search:** Client-side fuzzy search with React state management

### DevOps & Infrastructure
* **Server:** Ubuntu VPS (DigitalOcean/Linode)
* **Web Server:** Nginx (Reverse Proxy)
* **Security:** SSL/TLS via Certbot (Let's Encrypt)
* **DNS:** Cloudflare
* **CI/CD:** GitHub Actions (Auto-deploys on push to `main`)

---

## 📂 Project Structure

```text
src/
├── components/        # React Widgets (Search, Dashboards)
├── content/           # Markdown Blog Posts (CMS)
├── layouts/           # Astro Layout Shells (Header, Footer)
├── pages/             # File-based Routing
│   ├── api/           # JSON Data Endpoints
│   ├── blog/          # Dynamic Blog Routes
│   └── projects/      # Dashboard Pages
└── styles/            # Modular CSS Files (global, cards, search)
```

##⚡ Local Development
To run this portfolio locally:

Clone the repo:

```Bash

git clone [https://github.com/patbritton/portfolio.git](https://github.com/patbritton/portfolio.git)
cd portfolio
Install dependencies:
```

```Bash

npm install
Run the Dev Server:
```

```Bash

npm run dev
Visit http://localhost:4321 to see the app.
```

## 🔄 Deployment Pipeline
This project uses a CI/CD pipeline defined in .github/workflows/deploy.yml.

* Code is pushed to main.

* GitHub Actions logs into the VPS via SSH.

* It pulls the latest changes and installs Node dependencies.

* It runs npm run build to generate the static dist/ folder.

* Permissions are updated to ensure Nginx read access.