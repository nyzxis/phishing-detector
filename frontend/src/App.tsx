import React, { useState, useEffect } from 'react';
import { Globe, Mail, Cpu, RefreshCw, Sparkles } from 'lucide-react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import UrlScanner from './components/UrlScanner';
import EmailScanner from './components/EmailScanner';
import ScanHistory from './components/ScanHistory';
import { getStats, getHistory, checkHealth, StatsResponse, HistoryItem } from './lib/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<'url' | 'email'>('url');
  const [systemOnline, setSystemOnline] = useState(false);
  const [engineName, setEngineName] = useState('EDGE HEURISTICS');
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [theme, setTheme] = useState<'cyber' | 'minimalist'>(() => {
    const saved = localStorage.getItem('phishguard_theme');
    return saved === 'minimalist' || saved === 'cyber' ? saved : 'cyber';
  });

  const isMinimal = theme === 'minimalist';

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'cyber' ? 'minimalist' : 'cyber';
      localStorage.setItem('phishguard_theme', next);
      return next;
    });
  };

  const fetchDashboardData = async () => {
    try {
      const health = await checkHealth();
      setSystemOnline(health.status === 'online');
      setEngineName(health.engine);
    } catch {
      setSystemOnline(false);
      setEngineName('EDGE HEURISTICS');
    }

    try {
      setLoadingStats(true);
      const [statsData, historyData] = await Promise.all([
        getStats(),
        getHistory(),
      ]);
      setStats(statsData);
      setHistory(historyData);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div
      className={`min-h-[100dvh] flex flex-col antialiased transition-colors duration-300 ${
        isMinimal
          ? 'bg-[#F7F6F3] text-[#111111] selection:bg-[#E1F3FE] selection:text-[#1F6C9F]'
          : 'bg-[#06080e] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200'
      }`}
    >
      {/* Background Cyber Grid (cyber mode only) */}
      {!isMinimal && (
        <div className="fixed inset-0 cyber-grid-bg opacity-30 pointer-events-none z-0" />
      )}

      {/* Top Ambient Glow (cyber mode only) */}
      {!isMinimal && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[750px] h-[300px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-[140px] pointer-events-none z-0" />
      )}

      {/* Navigation */}
      <Navbar
        systemOnline={systemOnline}
        engineName={engineName}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Hero / Intro Banner */}
        <div
          className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 ${
            isMinimal ? 'border-b border-[#EAEAEA]' : 'border-b border-white/10'
          }`}
        >
          <div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-2.5 ${
                isMinimal
                  ? 'border border-[#EAEAEA] bg-white text-[#787774]'
                  : 'border border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>HYBRID AI DEFENSE SYSTEM • ACTIVE INFERENCE</span>
            </div>
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${
                isMinimal ? 'font-serif-editorial text-[#111111]' : 'font-mono text-white'
              }`}
            >
              AI Threat Inspector
            </h1>
            <p
              className={`text-xs sm:text-sm mt-1.5 max-w-[65ch] leading-relaxed ${
                isMinimal ? 'text-[#787774] font-sans-clean' : 'text-white/50 font-mono'
              }`}
            >
              Real-time classification and telemetry breakdown for weaponized URLs and deceptive social engineering emails.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            className={`self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all active:scale-[0.98] ${
              isMinimal
                ? 'border border-[#EAEAEA] bg-white hover:bg-[#FBFBFA] text-[#111111] shadow-none'
                : 'border border-white/15 bg-white/5 hover:bg-white/10 hover:border-cyan-500/40 text-white/70 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Telemetry
          </button>
        </div>

        {/* Stats Metrics Grid */}
        <StatsCards stats={stats} loading={loadingStats} theme={theme} />

        {/* Scanner Workspace */}
        <div className="space-y-4">
          {/* Workspace Tabs */}
          <div
            className={`flex items-center gap-2 pb-2 ${
              isMinimal ? 'border-b border-[#EAEAEA]' : 'border-b border-white/10'
            }`}
          >
            <button
              onClick={() => setActiveTab('url')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-[0.98] ${
                activeTab === 'url'
                  ? isMinimal
                    ? 'bg-[#111111] text-white shadow-none'
                    : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : isMinimal
                  ? 'text-[#787774] hover:text-[#111111] hover:bg-black/5 border border-transparent'
                  : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Globe className="w-4 h-4" />
              URL Scanner
            </button>

            <button
              onClick={() => setActiveTab('email')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-[0.98] ${
                activeTab === 'email'
                  ? isMinimal
                    ? 'bg-[#111111] text-white shadow-none'
                    : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : isMinimal
                  ? 'text-[#787774] hover:text-[#111111] hover:bg-black/5 border border-transparent'
                  : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email Body Scanner
            </button>
          </div>

          {/* Active Scanner View */}
          {activeTab === 'url' ? (
            <UrlScanner onScanComplete={fetchDashboardData} theme={theme} />
          ) : (
            <EmailScanner onScanComplete={fetchDashboardData} theme={theme} />
          )}
        </div>

        {/* Scan History Audit Log */}
        <ScanHistory history={history} onRefresh={fetchDashboardData} theme={theme} />
      </main>

      {/* Footer */}
      <footer
        className={`relative z-10 py-6 text-center font-mono text-xs transition-colors ${
          isMinimal
            ? 'border-t border-[#EAEAEA] bg-[#FBFBFA] text-[#787774]'
            : 'border-t border-white/10 text-white/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>AI-Powered Phishing Detection System • Built by Arfa Danial</span>
          <span>Stack: Python • Scikit-learn • Flask • React 19 • PostgreSQL</span>
        </div>
      </footer>
    </div>
  );
}
