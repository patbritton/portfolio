import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts';
import {
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  Trophy,
  Filter,
  Award,
  DollarSign
} from 'lucide-react';
import '../styles/TwinsDashboard.css';

const TwinsDashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [yearRange, setYearRange] = useState([1901, 2025]);
  const [showPlayoffsOnly, setShowPlayoffsOnly] = useState(false);

  // --- NEW: STATE FOR SANDBOX MODE ---
  const [sandboxConfig, setSandboxConfig] = useState({
    chartType: 'line',   // 'line', 'bar', 'area', 'scatter'
    xAxis: 'Year',       // What goes on bottom?
    yAxis: 'Wins',       // What goes on side?
    color: '#002B5C'     // Twins Navy
  });

  // COMPLETE DATASET
  const allData = [
    { Year: 1901, Wins: 61, Losses: 72, Attendance: 162007, Avg_Attendance: 2418, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1902, Wins: 61, Losses: 75, Attendance: 188158, Avg_Attendance: 2727, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1903, Wins: 43, Losses: 94, Attendance: 224523, Avg_Attendance: 3207, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1904, Wins: 38, Losses: 113, Attendance: 131744, Avg_Attendance: 1733, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1905, Wins: 64, Losses: 87, Attendance: 252027, Avg_Attendance: 3273, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1906, Wins: 55, Losses: 95, Attendance: 129903, Avg_Attendance: 1755, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1907, Wins: 49, Losses: 102, Attendance: 221534, Avg_Attendance: 3035, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1908, Wins: 67, Losses: 85, Attendance: 264027, Avg_Attendance: 3474, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1909, Wins: 42, Losses: 110, Attendance: 205456, Avg_Attendance: 2634, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1910, Wins: 66, Losses: 85, Attendance: 254267, Avg_Attendance: 3260, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1911, Wins: 64, Losses: 90, Attendance: 244884, Avg_Attendance: 3180, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1912, Wins: 91, Losses: 61, Attendance: 350663, Avg_Attendance: 4554, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1913, Wins: 90, Losses: 64, Attendance: 317529, Avg_Attendance: 4178, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1914, Wins: 81, Losses: 73, Attendance: 243354, Avg_Attendance: 3042, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1915, Wins: 85, Losses: 68, Attendance: 159977, Avg_Attendance: 2078, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1916, Wins: 76, Losses: 77, Attendance: 173740, Avg_Attendance: 2227, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1917, Wins: 74, Losses: 79, Attendance: 89670, Avg_Attendance: 1165, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1918, Wins: 72, Losses: 56, Attendance: 182618, Avg_Attendance: 2572, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1919, Wins: 56, Losses: 84, Attendance: 236654, Avg_Attendance: 3333, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1920, Wins: 68, Losses: 84, Attendance: 359260, Avg_Attendance: 4606, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1921, Wins: 80, Losses: 73, Attendance: 456058, Avg_Attendance: 5847, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1922, Wins: 69, Losses: 85, Attendance: 458552, Avg_Attendance: 5955, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1923, Wins: 75, Losses: 78, Attendance: 357406, Avg_Attendance: 4582, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1924, Wins: 92, Losses: 62, Attendance: 584310, Avg_Attendance: 7588, Payroll: null, Playoffs: 'Yes', HR: 0 },
    { Year: 1925, Wins: 96, Losses: 55, Attendance: 817199, Avg_Attendance: 10613, Payroll: null, Playoffs: 'Yes', HR: 0 },
    { Year: 1926, Wins: 81, Losses: 69, Attendance: 557863, Avg_Attendance: 7438, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1927, Wins: 85, Losses: 69, Attendance: 535408, Avg_Attendance: 6610, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1928, Wins: 75, Losses: 79, Attendance: 378501, Avg_Attendance: 4853, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1929, Wins: 71, Losses: 81, Attendance: 355506, Avg_Attendance: 4558, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1930, Wins: 94, Losses: 60, Attendance: 614474, Avg_Attendance: 7878, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1931, Wins: 92, Losses: 62, Attendance: 608397, Avg_Attendance: 7701, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1932, Wins: 93, Losses: 61, Attendance: 379064, Avg_Attendance: 4860, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1933, Wins: 99, Losses: 53, Attendance: 437533, Avg_Attendance: 5538, Payroll: null, Playoffs: 'Yes', HR: 0 },
    { Year: 1934, Wins: 66, Losses: 86, Attendance: 330074, Avg_Attendance: 4126, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1935, Wins: 67, Losses: 86, Attendance: 253372, Avg_Attendance: 3248, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1936, Wins: 82, Losses: 71, Attendance: 349241, Avg_Attendance: 4477, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1937, Wins: 73, Losses: 80, Attendance: 294076, Avg_Attendance: 3676, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1938, Wins: 75, Losses: 76, Attendance: 523893, Avg_Attendance: 6804, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1939, Wins: 65, Losses: 87, Attendance: 307253, Avg_Attendance: 3939, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1940, Wins: 64, Losses: 90, Attendance: 282897, Avg_Attendance: 3674, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1941, Wins: 70, Losses: 84, Attendance: 420000, Avg_Attendance: 5250, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1942, Wins: 62, Losses: 89, Attendance: 255000, Avg_Attendance: 3446, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1943, Wins: 84, Losses: 69, Attendance: 574694, Avg_Attendance: 7464, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1944, Wins: 64, Losses: 90, Attendance: 525235, Avg_Attendance: 6821, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1945, Wins: 87, Losses: 67, Attendance: 652660, Avg_Attendance: 8367, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1946, Wins: 76, Losses: 78, Attendance: 1027216, Avg_Attendance: 13169, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1947, Wins: 64, Losses: 90, Attendance: 850758, Avg_Attendance: 11049, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1948, Wins: 56, Losses: 97, Attendance: 795254, Avg_Attendance: 10464, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1949, Wins: 50, Losses: 104, Attendance: 770745, Avg_Attendance: 10010, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1950, Wins: 67, Losses: 87, Attendance: 699650, Avg_Attendance: 9086, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1951, Wins: 62, Losses: 92, Attendance: 695167, Avg_Attendance: 9028, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1952, Wins: 78, Losses: 76, Attendance: 699457, Avg_Attendance: 8967, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1953, Wins: 76, Losses: 76, Attendance: 595594, Avg_Attendance: 7941, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1954, Wins: 66, Losses: 88, Attendance: 503542, Avg_Attendance: 6456, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1955, Wins: 53, Losses: 101, Attendance: 425238, Avg_Attendance: 5383, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1956, Wins: 59, Losses: 95, Attendance: 431647, Avg_Attendance: 5606, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1957, Wins: 55, Losses: 99, Attendance: 457079, Avg_Attendance: 5936, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1958, Wins: 61, Losses: 93, Attendance: 475288, Avg_Attendance: 6173, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1959, Wins: 63, Losses: 91, Attendance: 615372, Avg_Attendance: 7992, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1960, Wins: 73, Losses: 81, Attendance: 743404, Avg_Attendance: 9655, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1961, Wins: 70, Losses: 90, Attendance: 1256723, Avg_Attendance: 15515, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1962, Wins: 91, Losses: 71, Attendance: 1436140, Avg_Attendance: 17730, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1963, Wins: 91, Losses: 70, Attendance: 1406652, Avg_Attendance: 17366, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1964, Wins: 79, Losses: 83, Attendance: 1207514, Avg_Attendance: 14548, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1965, Wins: 102, Losses: 60, Attendance: 1463258, Avg_Attendance: 18065, Payroll: null, Playoffs: 'Yes', HR: 0 },
    { Year: 1966, Wins: 89, Losses: 73, Attendance: 1259374, Avg_Attendance: 15548, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1967, Wins: 91, Losses: 71, Attendance: 1483547, Avg_Attendance: 18092, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1968, Wins: 79, Losses: 83, Attendance: 1143257, Avg_Attendance: 14114, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1969, Wins: 97, Losses: 65, Attendance: 1349328, Avg_Attendance: 16658, Payroll: null, Playoffs: 'Yes', HR: 0 },
    { Year: 1970, Wins: 98, Losses: 64, Attendance: 1261804, Avg_Attendance: 15578, Payroll: null, Playoffs: 'Yes', HR: 0 },
    { Year: 1971, Wins: 74, Losses: 86, Attendance: 940858, Avg_Attendance: 11909, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1972, Wins: 77, Losses: 77, Attendance: 797901, Avg_Attendance: 10638, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1973, Wins: 81, Losses: 81, Attendance: 907499, Avg_Attendance: 11204, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1974, Wins: 82, Losses: 80, Attendance: 662401, Avg_Attendance: 8078, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1975, Wins: 76, Losses: 83, Attendance: 737156, Avg_Attendance: 9573, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1976, Wins: 85, Losses: 77, Attendance: 715394, Avg_Attendance: 8832, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1977, Wins: 84, Losses: 77, Attendance: 1162727, Avg_Attendance: 14180, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1978, Wins: 73, Losses: 89, Attendance: 787878, Avg_Attendance: 9727, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1979, Wins: 82, Losses: 80, Attendance: 1070521, Avg_Attendance: 13216, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1980, Wins: 77, Losses: 84, Attendance: 769264, Avg_Attendance: 9381, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1981, Wins: 41, Losses: 68, Attendance: 469090, Avg_Attendance: 8377, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1982, Wins: 60, Losses: 102, Attendance: 921186, Avg_Attendance: 11373, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1983, Wins: 70, Losses: 92, Attendance: 858939, Avg_Attendance: 10604, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1984, Wins: 81, Losses: 81, Attendance: 1630708, Avg_Attendance: 20132, Payroll: null, Playoffs: 'No', HR: 0 },
    { Year: 1985, Wins: 77, Losses: 85, Attendance: 1651814, Avg_Attendance: 20393, Payroll: 5764800, Playoffs: 'No', HR: 0 },
    { Year: 1986, Wins: 71, Losses: 91, Attendance: 1255453, Avg_Attendance: 15500, Payroll: 8494000, Playoffs: 'No', HR: 0 },
    { Year: 1987, Wins: 85, Losses: 77, Attendance: 2081976, Avg_Attendance: 25703, Payroll: 7735000, Playoffs: 'Yes', HR: 0 },
    { Year: 1988, Wins: 91, Losses: 71, Attendance: 3030672, Avg_Attendance: 37416, Payroll: 12486000, Playoffs: 'No', HR: 0 },
    { Year: 1989, Wins: 80, Losses: 82, Attendance: 2273316, Avg_Attendance: 28066, Payroll: 15473000, Playoffs: 'No', HR: 0 },
    { Year: 1990, Wins: 74, Losses: 88, Attendance: 1751584, Avg_Attendance: 21624, Payroll: 17228000, Playoffs: 'No', HR: 0 },
    { Year: 1991, Wins: 95, Losses: 67, Attendance: 2293842, Avg_Attendance: 28319, Payroll: 24750000, Playoffs: 'Yes', HR: 0 },
    { Year: 1992, Wins: 90, Losses: 72, Attendance: 2482738, Avg_Attendance: 30651, Payroll: 30093000, Playoffs: 'No', HR: 0 },
    { Year: 1993, Wins: 71, Losses: 91, Attendance: 2048673, Avg_Attendance: 25292, Payroll: 25872000, Playoffs: 'No', HR: 0 },
    { Year: 1994, Wins: 53, Losses: 60, Attendance: 1398565, Avg_Attendance: 23704, Payroll: 29223000, Playoffs: 'No', HR: 0 },
    { Year: 1995, Wins: 56, Losses: 88, Attendance: 1057620, Avg_Attendance: 14689, Payroll: 25927000, Playoffs: 'No', HR: 0 },
    { Year: 1996, Wins: 78, Losses: 84, Attendance: 1439510, Avg_Attendance: 17772, Payroll: 22291000, Playoffs: 'No', HR: 0 },
    { Year: 1997, Wins: 68, Losses: 94, Attendance: 1411014, Avg_Attendance: 17420, Payroll: 34110000, Playoffs: 'No', HR: 0 },
    { Year: 1998, Wins: 70, Losses: 92, Attendance: 1165980, Avg_Attendance: 14395, Payroll: 24500000, Playoffs: 'No', HR: 0 },
    { Year: 1999, Wins: 63, Losses: 97, Attendance: 1202829, Avg_Attendance: 15226, Payroll: 15862500, Playoffs: 'No', HR: 0 },
    { Year: 2000, Wins: 69, Losses: 93, Attendance: 1000760, Avg_Attendance: 12355, Payroll: 16520000, Playoffs: 'No', HR: 0 },
    { Year: 2001, Wins: 85, Losses: 77, Attendance: 1782929, Avg_Attendance: 22011, Payroll: 24130000, Playoffs: 'No', HR: 0 },
    { Year: 2002, Wins: 94, Losses: 67, Attendance: 1924473, Avg_Attendance: 23470, Payroll: 40225000, Playoffs: 'Yes', HR: 0 },
    { Year: 2003, Wins: 90, Losses: 72, Attendance: 1946011, Avg_Attendance: 24025, Payroll: 55938000, Playoffs: 'Yes', HR: 0 },
    { Year: 2004, Wins: 92, Losses: 70, Attendance: 1911490, Avg_Attendance: 23599, Payroll: 53585000, Playoffs: 'Yes', HR: 0 },
    { Year: 2005, Wins: 83, Losses: 79, Attendance: 2034375, Avg_Attendance: 25116, Payroll: 56186000, Playoffs: 'No', HR: 0 },
    { Year: 2006, Wins: 96, Losses: 66, Attendance: 2285018, Avg_Attendance: 28210, Payroll: 63396006, Playoffs: 'Yes', HR: 0 },
    { Year: 2007, Wins: 79, Losses: 83, Attendance: 2296347, Avg_Attendance: 28350, Payroll: 71439500, Playoffs: 'No', HR: 0 },
    { Year: 2008, Wins: 88, Losses: 75, Attendance: 2302431, Avg_Attendance: 28078, Payroll: 56932766, Playoffs: 'No', HR: 0 },
    { Year: 2009, Wins: 87, Losses: 76, Attendance: 2416237, Avg_Attendance: 29466, Payroll: 65299266, Playoffs: 'Yes', HR: 0 },
    { Year: 2010, Wins: 94, Losses: 68, Attendance: 3223640, Avg_Attendance: 39798, Payroll: 97659167, Playoffs: 'Yes', HR: 142 },
    { Year: 2011, Wins: 63, Losses: 99, Attendance: 3168116, Avg_Attendance: 39113, Payroll: 113237000, Playoffs: 'No', HR: 103 },
    { Year: 2012, Wins: 66, Losses: 96, Attendance: 2776354, Avg_Attendance: 34276, Payroll: 100435000, Playoffs: 'No', HR: 131 },
    { Year: 2013, Wins: 66, Losses: 96, Attendance: 2477644, Avg_Attendance: 30588, Payroll: 82010000, Playoffs: 'No', HR: 151 },
    { Year: 2014, Wins: 70, Losses: 92, Attendance: 2250606, Avg_Attendance: 27785, Payroll: 85465000, Playoffs: 'No', HR: 128 },
    { Year: 2015, Wins: 83, Losses: 79, Attendance: 2220054, Avg_Attendance: 27408, Payroll: 108262500, Playoffs: 'No', HR: 156 },
    { Year: 2016, Wins: 59, Losses: 103, Attendance: 1963912, Avg_Attendance: 24246, Payroll: 105333700, Playoffs: 'No', HR: 200 },
    { Year: 2017, Wins: 85, Losses: 77, Attendance: 2051279, Avg_Attendance: 25324, Payroll: 108102500, Playoffs: 'Yes', HR: 206 },
    { Year: 2018, Wins: 78, Losses: 84, Attendance: 1959197, Avg_Attendance: 24188, Payroll: 128713226, Playoffs: 'No', HR: 166 },
    { Year: 2019, Wins: 101, Losses: 61, Attendance: 2303299, Avg_Attendance: 28436, Payroll: 119651933, Playoffs: 'Yes', HR: 307 },
    { Year: 2021, Wins: 73, Losses: 89, Attendance: 1310199, Avg_Attendance: 16175, Payroll: 125277666, Playoffs: 'No', HR: 228 },
    { Year: 2022, Wins: 78, Losses: 84, Attendance: 1801128, Avg_Attendance: 22236, Payroll: 134408190, Playoffs: 'No', HR: 178 },
    { Year: 2023, Wins: 87, Losses: 75, Attendance: 1974124, Avg_Attendance: 24372, Payroll: 153713740, Playoffs: 'Yes', HR: 233 },
    { Year: 2024, Wins: 82, Losses: 80, Attendance: 1951616, Avg_Attendance: 24094, Payroll: 127317590, Playoffs: 'No', HR: 183 },
    { Year: 2025, Wins: 70, Losses: 92, Attendance: 1768728, Avg_Attendance: 21836, Payroll: 142490390, Playoffs: 'No', HR: 191 }
  ];

  // --- COMPUTE DYNAMIC STATS ---
  const data = useMemo(() => {
    return allData.filter(d => {
      const inRange = d.Year >= yearRange[0] && d.Year <= yearRange[1];
      const matchesPlayoff = !showPlayoffsOnly || d.Playoffs === 'Yes';
      return inRange && matchesPlayoff;
    });
  }, [yearRange, showPlayoffsOnly]);

  const latestYear = data.length > 0 ? data[data.length - 1] : {};
  const previousYear = data.length > 1 ? data[data.length - 2] : {};
  const playoffYears = data.filter(d => d.Playoffs === 'Yes').length;
  
  const avgWinPct = data.length > 0 
    ? (data.reduce((sum, d) => sum + (d.Wins / (d.Wins + d.Losses)), 0) / data.length * 100).toFixed(1) 
    : 0;
  
  const avgAttendance = data.length > 0 
    ? Math.round(data.reduce((sum, d) => sum + (d.Avg_Attendance || 0), 0) / data.length) 
    : 0;

  const winPctChange = (latestYear.Wins && previousYear.Wins) 
    ? (((latestYear.Wins/(latestYear.Wins+latestYear.Losses)) - (previousYear.Wins/(previousYear.Wins+previousYear.Losses))) * 100).toFixed(1) 
    : 0;

  const attendanceChange = (latestYear.Avg_Attendance && previousYear.Avg_Attendance)
    ? ((latestYear.Avg_Attendance - previousYear.Avg_Attendance) / previousYear.Avg_Attendance * 100).toFixed(1)
    : 0;

  // --- CSV EXPORT ---
  const exportToCSV = () => {
    const headers = ['Year', 'Wins', 'Losses', 'Win_Percentage', 'Playoffs', 'Total_Attendance', 'Avg_Attendance', 'Payroll', 'Home_Runs'];
    const csvData = data.map(row => [
      row.Year,
      row.Wins,
      row.Losses,
      (row.Wins / (row.Wins + row.Losses)).toFixed(3),
      row.Playoffs,
      row.Attendance || 'N/A',
      row.Avg_Attendance || 'N/A',
      row.Payroll || 'N/A',
      row.HR || 0
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `twins_data_${yearRange[0]}-${yearRange[1]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartColors = {
    primary: darkMode ? '#5B92E5' : '#002B5C',
    red: '#BA0C2F',
    gold: '#D4AF6A',
    light: darkMode ? '#7BA5E8' : '#1e4d7b',
    border: darkMode ? '#1e3a5f' : '#DFE4EA',
    textMuted: darkMode ? '#94A3B8' : '#5a6b7d',
    payroll: '#22c55e'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              {entry.name}: {
                entry.name === 'Payroll' 
                  ? `$${(entry.value / 1000000).toFixed(1)}M` 
                  : (typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value)
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const MetricCard = ({ title, value, change, icon: Icon, trend, subtitle }) => (
    <div className="metric-card">
      <div className="metric-header">
        <div className="metric-title">{title}</div>
        <Icon size={20} className="text-primary-color" style={{ color: 'var(--primary-color)' }} />
      </div>
      <div className="metric-value">{value}</div>
      {subtitle && <div className="metric-subtitle">{subtitle}</div>}
      {change && (
        <div className="metric-trend">
          {trend === 'up' ? <TrendingUp size={16} className="trend-up" /> : <TrendingDown size={16} className="trend-down" />}
          <span className={`trend-text ${trend === 'up' ? 'trend-up' : 'trend-down'}`}>
            {Math.abs(change)}% vs Prev
          </span>
        </div>
      )}
    </div>
  );

  // --- NEW: SANDBOX HELPERS ---
  const metrics = [
    { label: 'Year', key: 'Year' },
    { label: 'Wins', key: 'Wins' },
    { label: 'Losses', key: 'Losses' },
    { label: 'Payroll', key: 'Payroll' },
    { label: 'Attendance', key: 'Avg_Attendance' },
    { label: 'Home Runs', key: 'HR' }
  ];

  const renderSandboxChart = () => {
    const ChartComponent = {
      line: LineChart,
      bar: BarChart,
      area: AreaChart,
      scatter: ScatterChart
    }[sandboxConfig.chartType];

    const DataComponent = {
      line: Line,
      bar: Bar,
      area: Area,
      scatter: Scatter
    }[sandboxConfig.chartType];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
          <XAxis 
            dataKey={sandboxConfig.xAxis} 
            type="number" 
            domain={['auto', 'auto']} 
            tickFormatter={(val) => val > 1000000 ? `${val/1000000}M` : val}
          />
          <YAxis 
            dataKey={sandboxConfig.yAxis} 
            tickFormatter={(val) => val > 1000000 ? `$${val/1000000}M` : val}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <DataComponent 
            type="monotone" 
            dataKey={sandboxConfig.yAxis} 
            fill={sandboxConfig.color} 
            stroke={sandboxConfig.color} 
            name={metrics.find(m => m.key === sandboxConfig.yAxis)?.label}
          />
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <div className={`twins-dashboard ${darkMode ? 'dark' : 'light'}`}>
      <div className="dashboard-container">
        
        {/* Header */}
        <div className="header-section">
          <div className="header-content">
            <div>
              <h1 className="main-title">Minnesota Twins Analytics Dashboard</h1>
              <p className="sub-title">Interactive Performance Analysis • 1901-2025 • 120+ Seasons</p>
              <div className="tag-container">
                <span className="tech-tag">React</span>
                <span className="tech-tag">Recharts</span>
                <span className="tech-tag">Data Visualization</span>
              </div>
            </div>
            <div className="button-group">
              <button onClick={exportToCSV} className="btn btn-primary">
                <Download size={16} /> Export Data
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className="btn btn-secondary">
                {darkMode ? '☀️ Light' : '🌙 Dark'} Mode
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-card">
          <div className="filter-group">
            <Filter size={18} style={{ color: 'var(--primary-color)' }} />
            <span className="filter-label">Filters:</span>
          </div>
          <div className="filter-group" style={{ gap: '12px' }}>
            <label className="filter-sub-label">Year Range:</label>
            <select 
              value={yearRange[0]}
              onChange={(e) => setYearRange([parseInt(e.target.value), yearRange[1]])}
              className="filter-select"
            >
              {allData.map(d => d.Year).filter(y => y < yearRange[1]).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <span className="text-muted" style={{ color: 'var(--text-secondary)' }}>to</span>
            <select 
              value={yearRange[1]}
              onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value)])}
              className="filter-select"
            >
              {allData.map(d => d.Year).filter(y => y > yearRange[0]).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={showPlayoffsOnly}
              onChange={(e) => setShowPlayoffsOnly(e.target.checked)}
              className="checkbox-input"
            />
            <span className="filter-label">Playoff Seasons Only</span>
          </label>
          <div className="filter-count">
            Showing {data.length} season{data.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <MetricCard
            title="2025 Win Percentage"
            value={`${(latestYear.Wins / (latestYear.Wins + latestYear.Losses) * 100).toFixed(1)}%`}
            subtitle={`${latestYear.Wins}-${latestYear.Losses} record`}
            change={winPctChange}
            trend={winPctChange > 0 ? 'up' : 'down'}
            icon={Trophy}
          />
          <MetricCard
            title="Avg Attendance 2025"
            value={latestYear.Avg_Attendance ? latestYear.Avg_Attendance.toLocaleString() : 'N/A'}
            subtitle="per game"
            change={attendanceChange}
            trend={attendanceChange > 0 ? 'up' : 'down'}
            icon={Users}
          />
          <MetricCard
            title="2025 Payroll"
            value={latestYear.Payroll ? `$${(latestYear.Payroll / 1000000).toFixed(1)}M` : 'N/A'}
            subtitle="Team Salary"
            icon={DollarSign}
          />
          <MetricCard
            title="Playoff Appearances"
            value={`${playoffYears}/${data.length}`}
            subtitle={`${((playoffYears / data.length) * 100).toFixed(0)}% success rate`}
            icon={Award}
          />
          <MetricCard
            title="Avg Win Rate"
            value={`${avgWinPct}%`}
            subtitle="selected period"
            icon={TrendingUp}
          />
          <MetricCard
            title="Avg Attendance"
            value={avgAttendance.toLocaleString()}
            subtitle="per game avg"
            icon={Users}
          />
        </div>

        {/* --- NEW: SANDBOX SECTION --- */}
        <div className="chart-card full-width-card" style={{ marginTop: '32px', border: '2px dashed var(--primary-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 className="chart-title">⚾ Sandbox Mode</h3>
              <p className="chart-subtitle">Explore the data yourself. Compare any two metrics.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {/* Chart Type Selector */}
              <select 
                className="filter-select"
                value={sandboxConfig.chartType}
                onChange={(e) => setSandboxConfig({...sandboxConfig, chartType: e.target.value})}
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="area">Area Chart</option>
                <option value="scatter">Scatter Plot</option>
              </select>

              {/* X-Axis Selector */}
              <select 
                className="filter-select"
                value={sandboxConfig.xAxis}
                onChange={(e) => setSandboxConfig({...sandboxConfig, xAxis: e.target.value})}
              >
                <option disabled>X-Axis (Bottom)</option>
                {metrics.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
              </select>

              {/* Y-Axis Selector */}
              <select 
                className="filter-select"
                value={sandboxConfig.yAxis}
                onChange={(e) => setSandboxConfig({...sandboxConfig, yAxis: e.target.value})}
              >
                <option disabled>Y-Axis (Side)</option>
                {metrics.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ backgroundColor: darkMode ? '#0f172a' : '#f8fafc', padding: '20px', borderRadius: '8px' }}>
            {renderSandboxChart()}
          </div>
          <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Try comparing <strong>Payroll</strong> vs <strong>Wins</strong> to see money's impact!
          </p>
        </div>

        {/* Standard Charts Grid */}
        <div className="charts-grid" style={{ marginTop: '32px' }}>
          
          {/* Payroll Trend */}
          <div className="chart-card full-width-card">
            <h3 className="chart-title">Franchise Payroll History</h3>
            <p className="chart-subtitle">
              <strong>Spending has skyrocketed since the 1980s.</strong> The graph highlights the dramatic increase in player salaries in the modern era.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.filter(d => d.Payroll !== null)}>
                <defs>
                  <linearGradient id="colorPayroll" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.payroll} stopOpacity={0.6}/>
                    <stop offset="95%" stopColor={chartColors.payroll} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} opacity={0.5} />
                <XAxis dataKey="Year" stroke={chartColors.textMuted} style={{ fontSize: '13px' }} />
                <YAxis stroke={chartColors.textMuted} style={{ fontSize: '13px' }} tickFormatter={(value) => `$${value / 1000000}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Payroll" stroke={chartColors.payroll} strokeWidth={3} fillOpacity={1} fill="url(#colorPayroll)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Win-Loss Record */}
          <div className="chart-card">
            <h3 className="chart-title">Win-Loss Record Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} opacity={0.5} />
                <XAxis dataKey="Year" stroke={chartColors.textMuted} style={{ fontSize: '13px' }} />
                <YAxis stroke={chartColors.textMuted} style={{ fontSize: '13px' }} domain={[0, 110]}/>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Wins" stroke={chartColors.primary} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Losses" stroke={chartColors.red} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Attendance Analysis */}
          <div className="chart-card">
            <h3 className="chart-title">Average Attendance per Game</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.filter(d => d.Avg_Attendance)}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} opacity={0.5} />
                <XAxis dataKey="Year" stroke={chartColors.textMuted} style={{ fontSize: '13px' }} />
                <YAxis stroke={chartColors.textMuted} style={{ fontSize: '13px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Avg_Attendance" fill={chartColors.gold} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer */}
        <div className="dashboard-footer">
          <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>Built with React & Recharts • Data Source: Baseball-Reference & Retrosheet</p>
          <p style={{ margin: 0 }}>Demonstrates: Data transformation, interactive filtering, and historical trend analysis.</p>
        </div>
      </div>
    </div>
  );
};

export default TwinsDashboard;