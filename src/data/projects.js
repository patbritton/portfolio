import { Trophy, TrendingUp, Activity } from 'lucide-react';

export const projects = [
  {
    id: 'twins',
    title: "Twins Analytics Suite",
    description: "A comprehensive deep-dive into 120+ years of Minnesota Twins history. Features interactive payroll analysis, win-loss correlations, and attendance tracking.",
    link: "/projects/twins",
    tags: ["React", "Recharts", "Data Viz"],
    icon: Trophy,
    color: "#38bdf8", // Cyan
    // You will replace this with a real screenshot later: '/images/twins-preview.png'
    image: null 
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