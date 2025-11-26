---
title: "Building the Ultimate Twins Analytics Dashboard"
description: "How I visualized 120+ years of Minnesota Twins history using React, Recharts, and 100 years of payroll data."
pubDate: 2025-11-26
tags: ["Data Visualization", "React", "Astro", "Baseball"]
---
# The Pitch

As a Business Data Analyst student and a Twins fan, I wanted to answer a specific question: **Does money buy wins?**

Most sports dashboards are static. They show you a snapshot of *today*. I wanted to build something exploratory—a tool that lets users scrub through history, compare eras, and visualize the correlation between Payroll, Attendance, and Win Percentage from 1901 to 2025.

You can view the live dashboard [here](/projects/twins).

## 1. The Data Architecture

The dataset for this project was massive. It covers the franchise history starting from 1901 (as the Washington Senators) through their move to Minnesota, all the way to the 2025 season projections.

**The Challenge:**
Data was fragmented. Historical attendance records were in one dataset, modern payroll figures in another, and recent win/loss records in a third.

**The Solution:**
I built a composite dataset (`Master.xlsx`) that merged:
* **1901-2015:** Historical Retrosheet data.
* **1985-2025:** Payroll data (when salary tracking became standard).
* **2020 Exclusion:** I wrote logic to filter out the 2020 COVID short-season to prevent skewing the averages.

## 2. The Tech Stack: Why React?

Originally, I considered using Python (Plotly/Dash). While great for analysis, I wanted a frontend that felt like a **native application**, not just a report.

* **Framework:** **React**. I needed complex state management to handle the "Sandbox Mode" where users can swap X/Y axes on the fly.
* **Visualization:** **Recharts**. It’s composable and SVG-based, meaning it scales perfectly on mobile devices without pixelation.
* **Hosting:** **Astro + VPS**. I deployed this on my own Ubuntu VPS using Nginx, served via a CI/CD pipeline that builds automatically when I push to GitHub.

## 3. Building "Sandbox Mode"

The coolest feature isn't the charts I pre-built; it's the charts *you* can build.

I implemented a **Sandbox Mode** that lifts the state of the chart axes. Instead of hardcoding `Wins` vs `Year`, I created a configuration object:

```javascript
const [sandboxConfig, setSandboxConfig] = useState({
  chartType: 'scatter',
  xAxis: 'Payroll',
  yAxis: 'Wins',
  color: '#002B5C'
});
```

This allows the user to ask their own questions. Want to see if Home Runs correlate with Attendance? You can generate that scatter plot instantly.

## 4. Key Insights

After visualizing the data, a few trends became undeniable:

1.  **The Efficiency Game:** While nominal payroll has risen significantly since the 1980s (due to inflation and industry growth), the Twins consistently operate with a mid-tier budget. The dashboard highlights years like **2019** (101 Wins) where the team achieved elite results without a top-tier luxury payroll—a hallmark of effective "Moneyball" management.
2.  **The 2019 Power Surge:** The data flags 2019 as a statistical anomaly—record-breaking Home Runs (307) and a massive spike in Win %, proving that offense can sometimes mask budget constraints.
3.  **Attendance Lag:** Attendance often peaks the year *after* a winning season (e.g., 2010, following the 2009 playoff run). This suggests that fan sentiment is a lagging indicator—fans need to see a winner *before* they buy season tickets.



What's Next?

* **League Context:** I plan to import "League Average Payroll" data to visualize the gap between the Twins' spending and the MLB average over time.

* **Forecasting Data:** I plan to add a Predictive Model (using Python/Prophet) to forecast attendance for the upcoming season based on current advance ticket sales and projected win totals.

Tech Stack: React, Recharts, Astro, Lucide Icons, Nginx, Ubuntu Linux.