import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Cell, Brush
} from 'recharts';
import {
  Download, TrendingUp, TrendingDown, Users, Trophy,
  Filter, Award, DollarSign, X, Loader
} from 'lucide-react';
import Papa from 'papaparse'; // Import the CSV parser
import '../styles/TwinsDashboard.css';

const TwinsDashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [yearRange, setYearRange] = useState([1901, 2026]);
  const [showPlayoffsOnly, setShowPlayoffsOnly] = useState(false);
  const [minWins, setMinWins] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [focusYear, setFocusYear] = useState(2026);

  // --- STATE FOR EXTERNAL DATA ---
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA FROM GOOGLE SHEETS ---
  useEffect(() => {
    const fetchSheetData = async () => {
      // Your Sheet URL (Published as CSV)
      const sheetId = '1ZbAOpAwGV-pUhrLOrz7Dzz6qTm8bnftSdOCVUeN2o1U';
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

      try {
        const response = await fetch(url);
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Clean and Transform the data (Strings -> Numbers)
            const cleanData = results.data.map(row => ({
              Year: parseInt(row.Year) || 0,
              Wins: parseInt(row.Wins) || 0,
              Losses: parseInt(row.Losses) || 0,
              Attendance: row.Attendance ? parseInt(row.Attendance.replace(/,/g, '')) : null,
              Avg_Attendance: row.Avg_Attendance ? parseInt(row.Avg_Attendance.replace(/,/g, '')) : null,
              Payroll: row.Payroll ? parseFloat(row.Payroll.replace(/[$,]/g, '')) : null,
              Playoffs: row.Playoffs || 'No',
              HR: parseInt(row.HR) || 0
            })).filter(d => d.Year > 0); // Remove bad rows

            // Sort by year just in case
            cleanData.sort((a, b) => a.Year - b.Year);

            setAllData(cleanData);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchSheetData();
  }, []);

  // --- FILTERING ---
  const data = useMemo(() => {
    return allData.filter(d => {
      const inRange = d.Year >= yearRange[0] && d.Year <= yearRange[1];
      const matchesPlayoff = !showPlayoffsOnly || d.Playoffs === 'Yes';
      const matchesWin = d.Wins >= minWins;
      return inRange && matchesPlayoff && matchesWin;
    });
  }, [allData, yearRange, showPlayoffsOnly, minWins]);

  // --- METRICS CALCULATIONS ---
  const latestYear = data.length > 0 ? data[data.length - 1] : {};
  const previousYear = data.length > 1 ? data[data.length - 2] : {};
  
  const winPctChange = (latestYear.Wins && previousYear.Wins) 
    ? (((latestYear.Wins/(latestYear.Wins+latestYear.Losses)) - (previousYear.Wins/(previousYear.Wins+previousYear.Losses))) * 100).toFixed(1) 
    : 0;

  const attendanceChange = (latestYear.Avg_Attendance && previousYear.Avg_Attendance)
    ? ((latestYear.Avg_Attendance - previousYear.Avg_Attendance) / previousYear.Avg_Attendance * 100).toFixed(1)
    : 0;

  const avgWinPct = data.length > 0 
    ? (data.reduce((sum, d) => sum + (d.Wins / (d.Wins + d.Losses)), 0) / data.length * 100).toFixed(1) 
    : 0;
  
  // Dynamic Average (Slider based)
  const avgAttendance = data.length > 0 
    ? Math.round(data.reduce((sum, d) => sum + (d.Avg_Attendance || 0), 0) / data.length) 
    : 0;

  // Static Average (1960-Present)
  const dataSince1960 = allData.filter(d => d.Year >= 1960 && d.Avg_Attendance);
  const avgAttendance1960 = dataSince1960.length > 0
    ? Math.round(dataSince1960.reduce((sum, d) => sum + d.Avg_Attendance, 0) / dataSince1960.length)
    : 0;

  const playoffYears = data.filter(d => d.Playoffs === 'Yes').length;

  // Focus Year Data
  const focusData = data.find(d => d.Year === focusYear) || latestYear || {};

  // --- EXPORT ---
  const exportToCSV = () => {
    const headers = ['Year', 'Wins', 'Losses', 'Win_Percentage', 'Playoffs', 'Total_Attendance', 'Avg_Attendance', 'Payroll', 'Home_Runs'];
    const csvData = data.map(row => [
      row.Year, row.Wins, row.Losses, (row.Wins / (row.Wins + row.Losses)).toFixed(3),
      row.Playoffs, row.Attendance || 'N/A', row.Avg_Attendance || 'N/A',
      row.Payroll || 'N/A', row.HR || 0
    ]);
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `twins_data_${yearRange[0]}-${yearRange[1]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- MODAL HELPERS ---
  const getMetricConfig = (key) => {
    switch(key) {
      case 'Wins': return { label: 'Wins', color: '#5B92E5', format: val => val };
      case 'Avg_Attendance': return { label: 'Avg Attendance', color: '#D4AF6A', format: val => val.toLocaleString() };
      case 'Payroll': return { label: 'Payroll', color: '#22c55e', format: val => `$${(val/1000000).toFixed(1)}M` };
      case 'HR': return { label: 'Home Runs', color: '#BA0C2F', format: val => val };
      default: return { label: key, color: '#fff', format: val => val };
    }
  };

  const openModal = (key) => {
    const config = getMetricConfig(key);
    const sorted = [...data].sort((a, b) => (b[key] || 0) - (a[key] || 0));
    const latestVal = focusData[key]; // Use focus year value
    const rank = sorted.findIndex(d => d[key] === latestVal) + 1;
    setSelectedMetric({ key, ...config, rank, value: latestVal });
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

  const MetricCard = ({ title, value, change, icon: Icon, trend, subtitle, onClick }) => (
    <div className={`metric-card ${onClick ? 'clickable' : ''}`} onClick={onClick}>
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

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', color: '#94a3b8' }}>
        <Loader className="animate-spin" size={48} />
        <span style={{ marginLeft: '12px' }}>Loading data...</span>
      </div>
    );
  }

  return (
    <div className={`twins-dashboard ${darkMode ? 'dark' : 'light'}`}>
      <div className="dashboard-container">
        
        <div className="header-section">
          <div className="header-content">
            <div>
              <h1 className="main-title">Minnesota Twins Analytics</h1>
              <p className="sub-title">Interactive Analysis • 1901-2026</p>
            </div>
            <div className="button-group">
              <button onClick={exportToCSV} className="btn btn-primary">
                <Download size={16} /> Export Data
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className="btn btn-secondary">
                {darkMode ? '☀️' : '🌙'} Mode
              </button>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="filter-card">
          <div className="filter-group">
            <Filter size={18} className="text-primary" />
            <span className="filter-label">Focus Year: <strong style={{color: '#fff', fontSize: '1.2em'}}>{focusYear}</strong></span>
            <input 
              type="range" 
              min={yearRange[0]} 
              max={2026} 
              value={focusYear} 
              onChange={(e) => setFocusYear(parseInt(e.target.value))}
              className="year-slider"
              style={{ width: '200px' }}
            />
          </div>

          <div className="filter-group">
            <label className="filter-sub-label">Min Wins: {minWins}</label>
            <input 
              type="range" min="0" max="100" value={minWins} 
              onChange={(e) => setMinWins(parseInt(e.target.value))} 
            />
          </div>

          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={showPlayoffsOnly}
              onChange={(e) => setShowPlayoffsOnly(e.target.checked)}
              className="checkbox-input"
            />
            <span className="filter-label">Playoffs Only</span>
          </label>
        </div>

        {/* METRICS GRID */}
        <div className="metrics-grid">
          <MetricCard
            title={`${focusData.Year} Win Percentage`}
            value={focusData.Wins ? `${(focusData.Wins / (focusData.Wins + focusData.Losses) * 100).toFixed(1)}%` : 'N/A'}
            subtitle={`${focusData.Wins}-${focusData.Losses} record`}
            change={winPctChange}
            trend={winPctChange > 0 ? 'up' : 'down'}
            icon={Trophy}
            onClick={() => openModal('Wins')}
          />
          <MetricCard
            title="Avg Attendance"
            value={avgAttendance1960.toLocaleString()}
            subtitle="per game avg (Since 1960)"
            icon={Users}
            onClick={() => openModal('Avg_Attendance')}
          />
          <MetricCard
            title={`${focusData.Year} Payroll`}
            value={focusData.Payroll ? `$${(focusData.Payroll / 1000000).toFixed(1)}M` : 'N/A'}
            subtitle="Team Salary"
            icon={DollarSign}
            onClick={() => openModal('Payroll')}
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
            title={`${focusData.Year} Attendance`}
            value={focusData.Avg_Attendance ? focusData.Avg_Attendance.toLocaleString() : 'N/A'}
            subtitle="Single Season Avg"
            icon={Users}
            onClick={() => openModal('Avg_Attendance')}
          />
        </div>

        {/* MODAL */}
        {selectedMetric && (
          <div className="search-overlay" onClick={() => setSelectedMetric(null)}>
            <div className="search-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="search-header" style={{ justifyContent: 'space-between' }}>
                <h2 style={{ margin: 0, color: '#fff' }}>{selectedMetric.label} History</h2>
                <button onClick={() => setSelectedMetric(null)} className="close-btn"><X /></button>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <div className="metric-title">Value in {focusYear}</div>
                    <div className="metric-value" style={{ fontSize: '2.5rem', color: selectedMetric.color }}>
                      {selectedMetric.format(selectedMetric.value || 0)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="metric-title">All-Time Rank</div>
                    <div className="metric-value">#{selectedMetric.rank}</div>
                    <div className="metric-subtitle">out of {data.length} seasons</div>
                  </div>
                </div>
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer>
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="modalGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={selectedMetric.color} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={selectedMetric.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="Year" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey={selectedMetric.key} 
                        stroke={selectedMetric.color} 
                        fill="url(#modalGradient)" 
                        strokeWidth={3}
                      />
                      <Brush dataKey="Year" height={30} stroke={selectedMetric.color} />
                      <ReferenceLine x={focusYear} stroke="#fff" strokeDasharray="3 3" label="Focus" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CHARTS */}
        <div className="charts-grid" style={{ marginTop: '32px' }}>
          <div className="chart-card full-width-card">
            <h3 className="chart-title">Franchise Payroll History</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.filter(d => d.Payroll !== null && d.Year >= 1985)}>
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
                <ReferenceLine x={focusYear} stroke="#fff" strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Win-Loss Record</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} opacity={0.5} />
                <XAxis dataKey="Year" stroke={chartColors.textMuted} style={{ fontSize: '13px' }} />
                <YAxis stroke={chartColors.textMuted} style={{ fontSize: '13px' }} domain={[0, 110]}/>
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Wins" stroke={chartColors.primary} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Losses" stroke={chartColors.red} strokeWidth={2} dot={false} />
                <ReferenceLine x={focusYear} stroke="#fff" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Avg Attendance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.filter(d => d.Avg_Attendance)}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} opacity={0.5} />
                <XAxis dataKey="Year" stroke={chartColors.textMuted} style={{ fontSize: '13px' }} />
                <YAxis stroke={chartColors.textMuted} style={{ fontSize: '13px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Avg_Attendance" fill={chartColors.gold} radius={[4, 4, 0, 0]} >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.Year === focusYear ? '#fff' : chartColors.gold} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-footer">
          <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>Built with React & Recharts • Data Source: Baseball-Reference & Retrosheet</p>
        </div>
      </div>
    </div>
  );
};

export default TwinsDashboard;