---
title: "Building the Ultimate Twins Analytics Dashboard"
description: "How I engineered a full-stack, interactive data platform to visualize 120+ years of Twins history, powered by live Google Sheet data."
pubDate: 2025-11-26
tags: ["Data Visualization", "React", "Astro", "CI/CD"]
---

# The Pitch

I set out to build more than a dashboard—I wanted an **Interactive Data Application** that lets users explore 120 years of Twins history without being limited by static reports. The project has evolved from a simple local file read to a live, self-updating analytics platform.

You can view the live dashboard [here](/projects/twins).

## 1. The Data Architecture: From Static Files to Live API

The project's architecture has been upgraded to true dynamic data sourcing.

* **Initial Challenge:** Data was fragmented across static CSVs and hardcoded into the React application (`allData` array). This required a code change every time data was updated.
* **Current Solution (Live Source):** The dashboard now pulls directly from a **Live Google Sheet via its CSV export API** using the **PapaParse** library.
* **Result:** Data updates now require **zero code changes**. I can update stats in the Google Sheet, and the dashboard automatically reflects those changes on the next page load.

## 2. Advanced Interactivity & UX

The dashboard is now a powerful analysis tool built on React's state management capabilities.

### Key Features Added:
* **Time Machine Controls:** Users can scrub the `Focus Year` slider to instantly update the metric cards for any season in history (1901–2025).
* **Deep-Dive Modals:** Clicking any metric card (Wins, Payroll, Attendance) opens a full-screen modal showing a **zoomable Area Chart** for that specific metric's historical trend.
* **Historical Context:** The `Avg Attendance` metric is now hardcoded to show the reliable 1960–Present average, providing stable context regardless of the current interactive filters.
* **Global Search & Tags:** The entire portfolio uses a **Spotlight Search** (Cmd+K) and **Tagging System** built on static routing, making content easily discoverable.

## 3. The Application Shell & Aesthetic

The final architecture focuses on performance and a distinct engineering aesthetic.

* **Frontend Shell:** **Astro**. Chosen for its high performance, enabling **Hot Reloading** during development and shipping minimal JavaScript bundles for the live site.
* **Deployment Pipeline:** **CI/CD** via GitHub Actions is fully operational. Pushing code updates the live VPS site (`patrick.mp.ls`) automatically.
* **Aesthetic Choice:** The dashboard utilizes a **"Midnight Developer"** dark theme, contrasting the deep slate background with cyan/gold data accents. The Hero section features a **Windows XP 'Analyst Terminal'** design, demonstrating control over legacy UI aesthetics within a modern framework.

## 4. Key Insights (Data Storytelling)

After visualizing the data, a few trends became undeniable:

1.  **The Efficiency Game:** The dashboard highlights years where the Twins achieved elite results without a top-tier luxury payroll, demonstrating effective management and reliance on efficiency rather than brute financial force.
2.  **The Payroll Explosion:** While spending has risen dramatically since the 1980s, the dashboard provides context on this increase against long-term franchise trends.
3.  **Attendance Lag:** Fan turnout is a lagging indicator; attendance often peaks the year *after* a winning season.

---

*Tech Stack: React, Recharts, Astro, Nginx, Ubuntu VPS, Google Sheets API.*