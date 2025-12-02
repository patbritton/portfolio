// FIX: Using default import workaround for CommonJS module compatibility and correct icon name
import pkg from 'lucide-react';
const { CircleDot, TrendingUp, Activity } = pkg;

export const dashboards = [
  {
    id: 'twins',
    title: "Twins Analytics Suite",
    description: "A comprehensive deep-dive into 120+ years of Minnesota Twins history. Features interactive payroll analysis, win-loss correlations, and attendance tracking.",
    link: "/dashboards/twins",
    tags: ["React", "Recharts", "Data Viz"],
    // --- ICON CORRECTED to CircleDot ---
    icon: CircleDot, 
    color: "#38bdf8", // Cyan
    image: '/images/twins-logo.png' // Using the image path for a custom logo
  },
  {
    id: 'sales',
    title: "Sales Forecasting (Coming Soon)",
    description: "Predictive modeling using Python and Prophet to forecast future revenue trends based on historical CSV data.",
    link: "#",
    tags: ["Python", "Machine Learning"],
    icon: TrendingUp,
    color: "#a78bfa", // Purple
    image: null
  }
];