// FIX: CommonJS compatibility for lucide-react
import pkg from 'lucide-react';
const { CircleDot, TrendingUp, Activity } = pkg;

export const dashboards = [
  {
    id: 'twins',
    title: "Twins Analytics Suite",
    description:
      "A comprehensive deep-dive into 120+ years of Minnesota Twins history. Features interactive payroll analysis, win-loss correlations, and attendance tracking.",
    link: "/dashboards/twins",
    tags: ["React", "Recharts", "Data Viz"],
    icon: CircleDot,
    color: "#38bdf8",
    image: "/images/twins-logo.png",
  },

  {
    id: 'twins-predictive',
    title: "Sabermetric Modeling Lab",
    description:
      "Predict future seasons using Pythagorean Expectation. Model outcomes by adjusting Team wRC+ and FIP.",
    link: "/dashboards/twins-predictive",
    tags: ["React", "Recharts", "Prediction"],
    icon: Activity,
    color: "#60a5fa",
    image: "/images/twins-logo.png",
  },
];
