import React, { useState, useEffect } from 'react';
import { Globe, Mail, ShieldAlert, Cpu, Terminal, RefreshCw } from 'lucide-react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import UrlScanner from './components/UrlScanner';
import EmailScanner from './components/EmailScanner';
import ScanHistory from './components/ScanHistory';
import { getStats, getHistory, checkHealth, StatsResponse, HistoryItem } from './lib/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<'url' | 'email'>('url');
  const [systemOnline, setSystemOnline] = useState(false);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const health = await checkHealth();
      setSystemOnline(health.status === 'online');
    } catch {
      setSystemOnline(false);
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
    <div className="min-h-screen bg-[#06070a] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 cyber-grid-bg opacity-30 pointer-events-none z-0" />

      {/* Top Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-[140px] pointer-events-none z-0" />

      {/* Navigation */}
      <Navbar systemOnline={systemOnline} />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Hero / Intro Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono mb-2">
              <Cpu className="w-3.5 h-3.5" />
              DUAL ML INFERENCE ENGINE (RANDOM FOREST + TF-IDF NAIVE BAYES)
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-mono">
              AI Threat Inspector
            </h1>
            <p className="text-xs sm:text-sm text-white/50 font-mono mt-1 max-w-2xl">
              Real-time classification and telemetry breakdown for weaponized URLs and deceptive social engineering emails.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono text-white/70 hover:text-white transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Telemetry
          </button>
        </div>

        {/* Stats Metrics Grid */}
        <StatsCards stats={stats} loading={loadingStats} />

        {/* Scanner Workspace */}
        <div className="space-y-4">
          {/* Workspace Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <button
              onClick={() => setActiveTab('url')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'url'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Globe className="w-4 h-4" />
              URL Scanner
            </button>

            <button
              onClick={() => setActiveTab('email')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'email'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email Body Scanner
            </button>
          </div>

          {/* Active Scanner View */}
          {activeTab === 'url' ? (
            <UrlScanner onScanComplete={fetchDashboardData} />
          ) : (
            <EmailScanner onScanComplete={fetchDashboardData} />
          )}
        </div>

        {/* Scan History Audit Log */}
        <ScanHistory history={history} onRefresh={fetchDashboardData} />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-6 text-center font-mono text-xs text-white/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>AI-Powered Phishing Detection System • Built by Arfa Danial</span>
          <span>Stack: Python • Scikit-learn • Flask • React • PostgreSQL</span>
        </div>
      </footer>
    </div>
  );
}
