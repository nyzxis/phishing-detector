import React, { useState, useEffect } from 'react';
import { Globe, Mail, Cpu, RefreshCw, Sparkles, Eye, Radio } from 'lucide-react';
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

  useEffect(() => {
    document.documentElement.classList.toggle('theme-minimalist', isMinimal);
    document.body.classList.toggle('theme-minimalist', isMinimal);
    document.documentElement.style.colorScheme = isMinimal ? 'light' : 'dark';
    document.documentElement.style.backgroundColor = isMinimal ? '#F5F2EB' : '#08060F';
    document.body.style.backgroundColor = isMinimal ? '#F5F2EB' : '#08060F';
  }, [isMinimal]);

  return (
    <div
      className={`min-h-[100dvh] flex flex-col antialiased transition-colors duration-150 ${
        isMinimal
          ? 'bg-[#F5F2EB] text-[#201B34] selection:bg-[#ECE7F7] selection:text-[#4F46E5] font-sans-clean theme-minimalist'
          : 'bg-[#08060F] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200'
      }`}
    >
      {/* Background Optical Grid */}
      <div
        className={`fixed inset-0 optical-grid-bg pointer-events-none z-0 transition-opacity duration-200 ${
          isMinimal ? 'opacity-0' : 'opacity-40'
        }`}
        style={{ willChange: 'opacity' }}
      />

      {/* Top Ambient Ultraviolet Glow */}
      <div
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15)_0%,rgba(6,182,212,0.05)_45%,transparent_70%)] pointer-events-none z-0 transition-opacity duration-200 ${
          isMinimal ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ willChange: 'opacity' }}
      />

      {/* Navigation */}
      <Navbar
        systemOnline={systemOnline}
        engineName={engineName}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* Top Hero / Intro Banner */}
        <div
          className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 ${
            isMinimal ? 'border-b border-[#E0DBCF]' : 'border-b border-[#231B3A]'
          }`}
        >
          <div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono mb-2.5 ${
                isMinimal
                  ? 'border border-[#E0DBCF] bg-[#FAF8F2] text-[#6B667A]'
                  : 'border border-purple-500/30 bg-purple-500/10 text-purple-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>OPTICAL NEURAL INTERCEPTOR • SPECTRUM INFERENCE</span>
            </div>

            <h1
              className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-optical ${
                isMinimal ? 'text-[#201B34]' : 'text-white'
              }`}
              style={{ textWrap: 'balance' }}
            >
              PHISHGUARD <span className="text-purple-400 font-light text-2xl sm:text-3xl">// THREAT TELESCOPE</span>
            </h1>

            <p
              className={`text-xs sm:text-sm mt-1.5 max-w-[70ch] leading-relaxed font-mono ${
                isMinimal ? 'text-[#6B667A]' : 'text-white/60'
              }`}
              style={{ textWrap: 'pretty' }}
            >
              Real-time heuristic lexical telescope, NLP deep semantic parser, and adversarial social engineering threat classification.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            className={`self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono transition-all active:scale-[0.98] ${
              isMinimal
                ? 'border border-[#E0DBCF] bg-[#FAF8F2] hover:bg-[#EFECE3] text-[#201B34]'
                : 'border border-[#231B3A] bg-[#120D22] hover:bg-[#1A142E] hover:border-purple-500/40 text-white/80 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Synchronize Telemetry</span>
          </button>
        </div>

        {/* Stats Metrics Grid */}
        <StatsCards stats={stats} loading={loadingStats} theme={theme} />

        {/* Optical Neural Command Center (2-Column Asymmetric Workstation) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Mode Selector & Active Scanner */}
          <div className="lg:col-span-6 space-y-4">
            {/* Workspace Reticle Tabs */}
            <div
              className={`flex items-center gap-2 pb-2 ${
                isMinimal ? 'border-b border-[#E0DBCF]' : 'border-b border-[#231B3A]'
              }`}
            >
              <button
                onClick={() => setActiveTab('url')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] ${
                  activeTab === 'url'
                    ? isMinimal
                      ? 'bg-[#201B34] text-[#FAF8F2]'
                      : 'bg-purple-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                    : isMinimal
                    ? 'text-[#6B667A] hover:text-[#201B34] hover:bg-black/5'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>URL Telescope</span>
              </button>

              <button
                onClick={() => setActiveTab('email')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] ${
                  activeTab === 'email'
                    ? isMinimal
                      ? 'bg-[#201B34] text-[#FAF8F2]'
                      : 'bg-purple-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                    : isMinimal
                    ? 'text-[#6B667A] hover:text-[#201B34] hover:bg-black/5'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email NLP Spectrum</span>
              </button>
            </div>

            {/* Active Scanner View */}
            {activeTab === 'url' ? (
              <UrlScanner onScanComplete={fetchDashboardData} theme={theme} />
            ) : (
              <EmailScanner onScanComplete={fetchDashboardData} theme={theme} />
            )}
          </div>

          {/* Right Column: Historical Audit Stream & Database */}
          <div className="lg:col-span-6 space-y-4">
            <ScanHistory history={history} onRefresh={fetchDashboardData} theme={theme} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`relative z-10 py-6 text-center font-mono text-xs transition-colors duration-150 ${
          isMinimal
            ? 'border-t border-[#E0DBCF] bg-[#FAF8F2] text-[#6B667A]'
            : 'border-t border-[#231B3A] bg-[#08060F] text-white/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>PhishGuard • Optical Neural Phishing Interceptor • Built by Arfa Danial</span>
          <span>Stack: Python • Scikit-learn • Flask • React 19 • PostgreSQL</span>
        </div>
      </footer>
    </div>
  );
}
