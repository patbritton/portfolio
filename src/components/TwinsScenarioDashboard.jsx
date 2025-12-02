import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, Cell, Line, ComposedChart, Legend
} from 'recharts';
import {
  TrendingUp, Activity, Loader, Star, User, Info, ArrowUpRight, Zap, HelpCircle, X, RotateCcw
} from 'lucide-react';
import Papa from 'papaparse'; 
import '../styles/TwinsScenarioDashboard.css'; 

const TOTAL_GAMES = 162;
const CURRENT_YEAR = 2025; 
const LEAGUE_AVG_RS = 734; 

const TwinsScenarioDashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  
  // --- PREDICTIVE INPUTS ---
  const [projectedWRC, setProjectedWRC] = useState(100); 
  const [projectedFIP, setProjectedFIP] = useState(4.20); 
  const [buxtonHealth, setBuxtonHealth] = useState(false);
  
  const [allData, setAllData] = useState([]);
  const [buxtonData, setBuxtonData] = useState([]);
  const [combinedStats, setCombinedStats] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- NEW: UX IMPROVEMENTS ---
  const [showWelcome, setShowWelcome] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  // --- FETCH DATA (Both Sheets) ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Fetch Team Data
        const teamSheetId = '1qGJ8xlBOdsPr7PJqyjQTrsHrAN-yuurgKIahlzwThDA'; 
        const teamUrl = `https://docs.google.com/spreadsheets/d/${teamSheetId}/gviz/tq?tqx=out:csv`;
        const teamRes = await fetch(teamUrl);
        const teamCsv = await teamRes.text();
        
        // 2. Fetch Buxton Data
        const buxtonSheetId = '171jV-GTvLIcD0cWxa67xk5ZlNTscsRqh98HZGV0VPCY';
        const buxtonUrl = `https://docs.google.com/spreadsheets/d/${buxtonSheetId}/gviz/tq?tqx=out:csv`;
        const buxtonRes = await fetch(buxtonUrl);
        const buxtonCsv = await buxtonRes.text();

        let teamStats = [];
        let playerStats = [];

        // Parse Team Data
        Papa.parse(teamCsv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            teamStats = results.data.map(row => ({
              Year: parseInt(row.Year) || 0,
              Wins: parseInt(row.Wins) || parseInt(row.W) || 0,
              RS: parseInt(row.R) || parseInt(row.RS) || 0, 
              RA: parseInt(row.RA) || 0,
            })).filter(d => d.Year > 0);
            teamStats.sort((a, b) => a.Year - b.Year);
            setAllData(teamStats);
          }
        });

        // Parse Buxton Data
        Papa.parse(buxtonCsv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            playerStats = results.data.map(row => ({
              Season: parseInt(row.Season) || 0,
              PA: parseInt(row.PA) || 0,
              Rbat: parseInt(row['Rbat+']) || 100,
              WPA: parseFloat(row.WPA) || 0,
            })).filter(d => d.Season > 0);
            playerStats.sort((a, b) => a.Season - b.Season);
            setBuxtonData(playerStats);
          }
        });

        // Join Data for Correlation Analysis
        const joined = teamStats.map(team => {
            const player = playerStats.find(p => p.Season === team.Year) || {};
            return {
                ...team,
                BuxtonPA: player.PA || 0,
                BuxtonRbat: player.Rbat || null
            };
        });
        setCombinedStats(joined);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // --- "THE BUXTON EFFECT" CALCULATION ---
  const buxtonImpact = useMemo(() => {
    if (combinedStats.length === 0) return { diff: 0, msg: "Loading..." };
    
    // Define "Healthy" as > 300 PA (approx half season +)
    const healthySeasons = combinedStats.filter(d => d.BuxtonPA > 300);
    const injuredSeasons = combinedStats.filter(d => d.BuxtonPA > 0 && d.BuxtonPA <= 300);
    
    if (healthySeasons.length === 0 || injuredSeasons.length === 0) return { diff: 0 };

    const avgWinsHealthy = healthySeasons.reduce((sum, d) => sum + d.Wins, 0) / healthySeasons.length;
    const avgWinsInjured = injuredSeasons.reduce((sum, d) => sum + d.Wins, 0) / injuredSeasons.length;
    
    const diff = Math.round(avgWinsHealthy - avgWinsInjured);
    return { 
        diff, 
        avgHealthy: Math.round(avgWinsHealthy),
        avgInjured: Math.round(avgWinsInjured)
    };
  }, [combinedStats]);

  // --- BUXTON TOGGLE LOGIC ---
  useEffect(() => {
    if (buxtonHealth) {
        setProjectedWRC(prev => Math.min(prev + 5, 130)); // Boost offense
    }
  }, [buxtonHealth]);

  // --- PRESETS ---
  const applyPreset = (type) => {
    setBuxtonHealth(false); // Reset toggle first
    switch(type) {
        case 'optimistic':
            setProjectedWRC(115);
            setProjectedFIP(3.80);
            setBuxtonHealth(true);
            break;
        case 'pessimistic':
            setProjectedWRC(90);
            setProjectedFIP(4.60);
            break;
        case '2024':
            setProjectedWRC(102); // Approx 2024 vals
            setProjectedFIP(4.15);
            break;
        default: // realistic
            setProjectedWRC(105);
            setProjectedFIP(4.10);
    }
  };

  // --- RESET FUNCTION ---
  const resetToDefaults = () => {
    setProjectedWRC(100);
    setProjectedFIP(4.20);
    setBuxtonHealth(false);
  };

  // --- MODEL ---
  const { predictedWins, predictedLosses, calcRS, calcRA, winPct } = useMemo(() => {
    const calcRS = Math.round((projectedWRC / 100) * LEAGUE_AVG_RS);
    const calcRA = Math.round((projectedFIP * 162) * 1.08); 
    const exp = 1.83;
    const winPct = Math.pow(calcRS, exp) / (Math.pow(calcRS, exp) + Math.pow(calcRA, exp));
    const wins = Math.round(winPct * TOTAL_GAMES);
    return { 
      predictedWins: wins, 
      predictedLosses: TOTAL_GAMES - wins,
      calcRS,
      calcRA,
      winPct: (winPct * 100).toFixed(1)
    };
  }, [projectedWRC, projectedFIP]);

  // --- COLORS & STYLES ---
  const colors = {
    bg: darkMode ? '#0f172a' : '#f8fafc',
    card: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#f1f5f9' : '#1e293b',
    subtext: darkMode ? '#94a3b8' : '#64748b',
    border: darkMode ? '#334155' : '#e2e8f0',
    accent: '#38bdf8',
    success: '#22c55e',
    danger: '#ef4444',
    buxton: '#a855f7',
    warning: '#f59e0b'
  };

  const getIdentity = (wins) => {
    if (wins >= 95) return { text: "🏆 World Series Contender", desc: "Elite team competing for championship" };
    if (wins >= 88) return { text: "⚾ Postseason Lock", desc: "Very likely playoff appearance" };
    if (wins >= 82) return { text: "🤔 Wild Card Bubble", desc: "Fighting for playoff spot" };
    if (wins < 75) return { text: "🏗️ Rebuilding Mode", desc: "Developing for the future" };
    return { text: "😐 Mediocre Season", desc: "Around .500, middle of the pack" };
  };

  // --- TOOLTIP COMPONENT ---
  const InfoTooltip = ({ id, title, content }) => (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <HelpCircle 
        size={16} 
        style={{ color: colors.accent, cursor: 'help', marginLeft: '6px' }}
        onMouseEnter={() => setActiveTooltip(id)}
        onMouseLeave={() => setActiveTooltip(null)}
      />
      {activeTooltip === id && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
          width: '240px',
          padding: '12px',
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          fontSize: '0.85rem',
          lineHeight: '1.4'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '4px', color: colors.accent }}>{title}</div>
          <div style={{ color: colors.subtext }}>{content}</div>
        </div>
      )}
    </div>
  );

  // --- WELCOME MODAL ---
  const WelcomeModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        background: colors.card,
        borderRadius: '24px',
        padding: '32px',
        maxWidth: '500px',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            fontSize: '3rem', 
            fontWeight: '900', 
            background: 'linear-gradient(90deg, #38bdf8, #818cf8)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            Welcome! ⚾
          </div>
          <p style={{ color: colors.subtext, fontSize: '1.1rem' }}>Minnesota Twins Season Architect</p>
        </div>

        <div style={{ marginBottom: '24px', color: colors.text, lineHeight: '1.6' }}>
          <p style={{ marginBottom: '16px' }}>
            <strong>What is this?</strong> An interactive tool to explore how different scenarios might affect the 2025 Twins season.
          </p>
          
          <div style={{ background: darkMode ? '#111827' : '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
            <div style={{ fontWeight: '600', marginBottom: '8px', color: colors.accent }}>How to use:</div>
            <ol style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem' }}>
              <li style={{ marginBottom: '8px' }}>Adjust the sliders to set batting and pitching strength</li>
              <li style={{ marginBottom: '8px' }}>Try the quick preset scenarios (Optimistic, Realistic, Pessimistic)</li>
              <li style={{ marginBottom: '8px' }}>Toggle the "Buxton Boost" to see his impact when healthy</li>
              <li>Watch the projected wins update in real-time!</li>
            </ol>
          </div>

          <p style={{ fontSize: '0.9rem', color: colors.subtext }}>
            💡 <strong>Tip:</strong> Hover over the <HelpCircle size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> icons for explanations of baseball stats.
          </p>
        </div>

        <button 
          onClick={() => setShowWelcome(false)}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Get Started
        </button>
      </div>
    </div>
  );

  if (loading) return (
    <div className="loading-container" style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.subtext, flexDirection: 'column', gap: '16px'}}>
      <Loader className="animate-spin" size={40} />
      <span style={{ fontSize: '1.1rem' }}>Loading historical data...</span>
    </div>
  );

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', padding: '24px', fontFamily: 'system-ui, sans-serif', color: colors.text }}>
      {showWelcome && <WelcomeModal />}
      
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Twins Season Architect
            </h1>
            <p style={{ margin: '8px 0 0', color: colors.subtext }}>Build your 2025 season scenario • Based on historical data</p>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => applyPreset('optimistic')} className="preset-btn" style={{ borderColor: colors.success, color: colors.success }}>
              🚀 Best Case
            </button>
            <button onClick={() => applyPreset('realistic')} className="preset-btn" style={{ borderColor: colors.accent, color: colors.accent }}>
              ⚖️ Realistic
            </button>
            <button onClick={() => applyPreset('pessimistic')} className="preset-btn" style={{ borderColor: colors.danger, color: colors.danger }}>
              📉 Worst Case
            </button>
            <button onClick={resetToDefaults} className="preset-btn" style={{ borderColor: colors.warning, color: colors.warning }}>
              <RotateCcw size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Reset
            </button>
            <button onClick={() => setShowWelcome(true)} className="preset-btn" style={{ borderColor: colors.border, color: colors.subtext }}>
              <Info size={14} /> Help
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="preset-btn" style={{ borderColor: colors.border, color: colors.subtext }}>
              {darkMode ? '🌙' : '☀️'}
            </button>
          </div>
        </div>

        {/* QUICK STATS BAR */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '12px', 
          marginBottom: '24px',
          padding: '16px',
          background: colors.card,
          borderRadius: '16px',
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: colors.subtext, textTransform: 'uppercase', letterSpacing: '1px' }}>Projected Runs</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.accent }}>{calcRS}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: colors.subtext, textTransform: 'uppercase', letterSpacing: '1px' }}>Runs Allowed</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.danger }}>{calcRA}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: colors.subtext, textTransform: 'uppercase', letterSpacing: '1px' }}>Win %</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.success }}>{winPct}%</div>
          </div>
        </div>

        {/* MAIN SCOREBOARD */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            
            {/* LEFT: RESULT CARD */}
            <div className="glass-card" style={{ 
                background: `linear-gradient(145deg, ${colors.card}, ${darkMode ? '#111827' : '#f1f5f9'})`, 
                padding: '32px', borderRadius: '24px', border: `1px solid ${colors.border}`,
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
            }}>
                <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', color: colors.subtext, marginBottom: '8px' }}>
                  2025 Projected Record
                </div>
                <div style={{ fontSize: '4.5rem', fontWeight: '900', lineHeight: 1, color: predictedWins >= 88 ? colors.success : predictedWins >= 81 ? colors.accent : colors.danger }}>
                    {predictedWins}-{predictedLosses}
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: '600', marginTop: '12px', marginBottom: '6px', color: colors.text }}>
                    {getIdentity(predictedWins).text}
                </div>
                <div style={{ fontSize: '0.9rem', color: colors.subtext }}>
                    {getIdentity(predictedWins).desc}
                </div>
                
                {buxtonHealth && (
                    <div style={{ marginTop: '24px', padding: '10px 18px', borderRadius: '20px', background: 'rgba(168, 85, 247, 0.15)', color: colors.buxton, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                        <Zap size={16} fill={colors.buxton} /> Buxton Boost Active
                    </div>
                )}
            </div>

            {/* RIGHT: CONTROLS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Offense Slider */}
                <div className="control-card" style={{ background: colors.card, padding: '24px', borderRadius: '16px', border: `1px solid ${colors.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="icon-box" style={{ background: 'rgba(56, 189, 248, 0.15)', color: colors.accent, padding: '8px', borderRadius: '8px' }}>
                              <TrendingUp size={20}/>
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center' }}>
                                  Offensive Power
                                  <InfoTooltip 
                                    id="wrc"
                                    title="What is wRC+?"
                                    content="Weighted Runs Created Plus. 100 is league average. Higher is better. It measures overall offensive value."
                                  />
                                </div>
                                <div style={{ fontSize: '0.8rem', color: colors.subtext }}>Team wRC+</div>
                            </div>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: colors.accent }}>{projectedWRC}</div>
                    </div>
                    <input 
                        type="range" min="80" max="125" step="1" 
                        value={projectedWRC}
                        onChange={(e) => { setProjectedWRC(parseInt(e.target.value)); setBuxtonHealth(false); }}
                        style={{ width: '100%', accentColor: colors.accent, cursor: 'pointer' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', color: colors.subtext }}>
                        <span>Poor (80)</span>
                        <span>Average (100)</span>
                        <span>Elite (125)</span>
                    </div>
                </div>

                {/* Pitching Slider */}
                <div className="control-card" style={{ background: colors.card, padding: '24px', borderRadius: '16px', border: `1px solid ${colors.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.15)', color: colors.danger, padding: '8px', borderRadius: '8px' }}>
                              <Activity size={20}/>
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center' }}>
                                  Pitching Quality
                                  <InfoTooltip 
                                    id="fip"
                                    title="What is FIP?"
                                    content="Fielding Independent Pitching. Measures pitcher performance on things they control: walks, strikeouts, home runs. Lower is better."
                                  />
                                </div>
                                <div style={{ fontSize: '0.8rem', color: colors.subtext }}>Team FIP (Lower = Better)</div>
                            </div>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: colors.danger }}>{projectedFIP.toFixed(2)}</div>
                    </div>
                    <input 
                        type="range" min="3.50" max="5.00" step="0.05" 
                        value={projectedFIP}
                        onChange={(e) => setProjectedFIP(parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: colors.danger, cursor: 'pointer', direction: 'rtl' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', color: colors.subtext }}>
                        <span>Struggling (5.00)</span>
                        <span>Average (4.20)</span>
                        <span>Excellent (3.50)</span>
                    </div>
                </div>
            </div>
        </div>

        {/* BUXTON ANALYSIS SECTION */}
        <div style={{ background: colors.card, borderRadius: '24px', border: `1px solid ${colors.border}`, overflow: 'hidden', marginBottom: '40px' }}>
            <div style={{ padding: '24px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      BB
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
                          The Byron Buxton Factor
                          <InfoTooltip 
                            id="buxton"
                            title="Why Buxton?"
                            content="Byron Buxton's health has historically correlated with team success. This analysis shows the Twins' win patterns based on his playing time."
                          />
                        </h3>
                        <p style={{ margin: 0, color: colors.subtext, fontSize: '0.9rem' }}>Historical impact of player availability</p>
                    </div>
                </div>
                
                {/* DYNAMIC STAT BADGE */}
                <div style={{ background: darkMode ? 'rgba(168, 85, 247, 0.1)' : '#faf5ff', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                    <div style={{ fontSize: '0.75rem', color: colors.buxton, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Historical Impact</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 'bold', color: colors.text }}>
                        <span style={{ color: colors.buxton }}>+{buxtonImpact.diff} wins</span> when healthy (300+ PA)
                    </div>
                </div>
            </div>

            <div style={{ padding: '24px' }}>
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer>
                        <ComposedChart data={combinedStats.filter(d => d.BuxtonPA > 0)}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} opacity={0.5} />
                            <XAxis dataKey="Year" stroke={colors.subtext} fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="left" orientation="left" stroke={colors.buxton} fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Buxton PA', angle: -90, position: 'insideLeft', fill: colors.buxton }} />
                            <YAxis yAxisId="right" orientation="right" stroke={colors.subtext} domain={[40, 110]} fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Team Wins', angle: 90, position: 'insideRight', fill: colors.subtext }} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.text, borderRadius: '8px' }} 
                              itemStyle={{ color: colors.text }}
                              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar yAxisId="left" dataKey="BuxtonPA" name="Buxton Plate Appearances" fill={colors.buxton} radius={[4, 4, 0, 0]} barSize={30} opacity={0.8} />
                            <Line yAxisId="right" type="monotone" dataKey="Wins" name="Team Wins" stroke={colors.accent} strokeWidth={3} dot={{r:4, fill:colors.card, stroke:colors.accent, strokeWidth:2}} />
                            <ReferenceLine yAxisId="left" y={300} stroke={colors.success} strokeDasharray="3 3" label={{ value: 'Healthy Threshold', fill: colors.success, fontSize: 11 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ maxWidth: '600px' }}>
                        <p style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: colors.text }}>
                            <strong>Key Finding:</strong> The data reveals a strong correlation between Buxton's playing time and team performance.
                        </p>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: colors.subtext }}>
                            <Info size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                            Healthy seasons (300+ PA): <strong>{buxtonImpact.avgHealthy} wins</strong> • 
                            Injured seasons: <strong>{buxtonImpact.avgInjured} wins</strong>
                        </p>
                    </div>
                    <label className="toggle-label" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px', 
                        cursor: 'pointer', 
                        padding: '12px 20px', 
                        background: buxtonHealth ? 'rgba(168, 85, 247, 0.15)' : (darkMode ? '#1f2937' : '#f3f4f6'), 
                        borderRadius: '12px', 
                        border: buxtonHealth ? `2px solid ${colors.buxton}` : `1px solid ${colors.border}`,
                        transition: 'all 0.2s'
                    }}>
                        <input 
                          type="checkbox" 
                          checked={buxtonHealth} 
                          onChange={(e) => setBuxtonHealth(e.target.checked)} 
                          style={{ width: '20px', height: '20px', accentColor: colors.buxton, cursor: 'pointer' }} 
                        />
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Simulate Healthy Season</div>
                          <div style={{ fontSize: '0.75rem', color: colors.subtext }}>Adds +5 to offensive rating</div>
                        </div>
                    </label>
                </div>
            </div>
        </div>

        {/* FOOTER */}
        <div style={{ textAlign: 'center', color: colors.subtext, fontSize: '0.8rem', marginTop: '40px', padding: '20px', background: colors.card, borderRadius: '12px', border: `1px solid ${colors.border}` }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Data Sources:</strong> Baseball-Reference & FanGraphs • Historical data through 2024
          </p>
          <p style={{ margin: 0 }}>
            Built with React & Recharts • This is a projection tool and not a guarantee of future performance
          </p>
        </div>

      </div>

      <style>{`
        .preset-btn {
            background: transparent;
            border: 1px solid;
            padding: 8px 14px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .preset-btn:hover {
            transform: translateY(-2px);
            background: rgba(255,255,255,0.05);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .preset-btn:active {
            transform: translateY(0);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TwinsScenarioDashboard;