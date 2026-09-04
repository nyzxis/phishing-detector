import React, { useState } from 'react';
import { History, Search, Trash2, Globe, Mail, ShieldAlert, ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';
import { HistoryItem, deleteHistoryItem, clearAllHistory } from '../lib/api';

interface ScanHistoryProps {
  history: HistoryItem[];
  onRefresh: () => void;
  theme?: 'cyber' | 'minimalist';
}

export default function ScanHistory({ history, onRefresh, theme = 'cyber' }: ScanHistoryProps) {
  const [filterType, setFilterType] = useState<'all' | 'url' | 'email'>('all');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const isMinimal = theme === 'minimalist';

  const filtered = history.filter((item) => {
    if (filterType !== 'all' && item.scan_type !== filterType) return false;
    if (search && !item.target_input.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteHistoryItem(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all scan history records?')) {
      try {
        await clearAllHistory();
        onRefresh();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div
      className={`rounded-2xl transition-all ${
        isMinimal
          ? 'bg-white border border-[#EAEAEA] p-6 shadow-none space-y-4'
          : 'border border-white/10 bg-[#0a0d16]/80 p-6 backdrop-blur-xl space-y-4'
      }`}
    >
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div
            className={`flex items-center gap-2 text-xs font-mono tracking-wider uppercase mb-1 ${
              isMinimal ? 'text-[#787774]' : 'text-cyan-400'
            }`}
          >
            <History className="w-4 h-4" />
            TELEMETRY &amp; AUDIT LOG
          </div>
          <h3
            className={`text-lg font-bold tracking-tight ${
              isMinimal ? 'font-serif-editorial text-[#111111]' : 'font-mono text-white'
            }`}
          >
            Historical Scan Database ({history.length})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                isMinimal
                  ? 'border border-[#EAEAEA] hover:border-red-300 bg-[#FBFBFA] hover:bg-red-50 text-[#787774] hover:text-[#9F2F2D]'
                  : 'border border-white/10 hover:border-rose-500/40 bg-white/5 hover:bg-rose-500/10 text-white/50 hover:text-rose-300'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Log
            </button>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <div className="relative flex-1">
          <Search
            className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
              isMinimal ? 'text-[#787774]' : 'text-white/30'
            }`}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inspected targets..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-mono transition-colors focus:outline-none ${
              isMinimal
                ? 'border border-[#EAEAEA] bg-[#FBFBFA] text-[#111111] placeholder-[#787774] focus:border-[#111111]'
                : 'border border-white/10 bg-black/40 text-white placeholder-white/30 focus:border-cyan-400'
            }`}
          />
        </div>

        <div
          className={`flex items-center gap-1 p-1 rounded-xl text-xs font-mono ${
            isMinimal ? 'border border-[#EAEAEA] bg-[#FBFBFA]' : 'border border-white/10 bg-black/40'
          }`}
        >
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterType === 'all'
                ? isMinimal
                  ? 'bg-[#111111] text-white'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : isMinimal
                ? 'text-[#787774] hover:text-[#111111]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            All ({history.length})
          </button>
          <button
            onClick={() => setFilterType('url')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterType === 'url'
                ? isMinimal
                  ? 'bg-[#111111] text-white'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : isMinimal
                ? 'text-[#787774] hover:text-[#111111]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            URLs
          </button>
          <button
            onClick={() => setFilterType('email')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterType === 'email'
                ? isMinimal
                  ? 'bg-[#111111] text-white'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : isMinimal
                ? 'text-[#787774] hover:text-[#111111]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Emails
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className={`overflow-x-auto rounded-xl border ${
          isMinimal ? 'border-[#EAEAEA] bg-white' : 'border-white/10 bg-black/30'
        }`}
      >
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr
              className={`border-b uppercase text-[10px] tracking-wider ${
                isMinimal
                  ? 'border-[#EAEAEA] bg-[#F7F6F3] text-[#787774]'
                  : 'border-white/10 bg-white/5 text-white/40'
              }`}
            >
              <th className="p-3">Type</th>
              <th className="p-3">Target Payload</th>
              <th className="p-3">Verdict</th>
              <th className="p-3">Risk</th>
              <th className="p-3">Timestamp</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={isMinimal ? 'divide-y divide-[#EAEAEA]' : 'divide-y divide-white/5'}>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className={`p-8 text-center ${isMinimal ? 'text-[#787774]' : 'text-white/30'}`}
                >
                  No scan records match current criteria.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const isPhish = item.verdict === 'Phishing';
                const isSuspicious = item.verdict === 'Suspicious';

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isMinimal ? 'hover:bg-[#FBFBFA]' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border ${
                          isMinimal
                            ? 'border-[#EAEAEA] bg-[#F7F6F3] text-[#111111]'
                            : 'border-white/10 bg-white/5 text-white/70'
                        }`}
                      >
                        {item.scan_type === 'url' ? (
                          <Globe className={`w-3 h-3 ${isMinimal ? 'text-[#1F6C9F]' : 'text-cyan-400'}`} />
                        ) : (
                          <Mail className={`w-3 h-3 ${isMinimal ? 'text-[#6B46C1]' : 'text-indigo-400'}`} />
                        )}
                        {item.scan_type.toUpperCase()}
                      </span>
                    </td>
                    <td
                      className={`p-3 max-w-xs truncate ${
                        isMinimal ? 'text-[#111111]' : 'text-white/80'
                      }`}
                      title={item.full_input}
                    >
                      {item.target_input}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                          isPhish
                            ? isMinimal
                              ? 'border-[#F7C5C8] bg-[#FDEBEC] text-[#9F2F2D]'
                              : 'border-rose-500/40 bg-rose-500/20 text-rose-300'
                            : isSuspicious
                            ? isMinimal
                              ? 'border-[#F5E0A6] bg-[#FBF3DB] text-[#956400]'
                              : 'border-amber-500/40 bg-amber-500/20 text-amber-300'
                            : isMinimal
                            ? 'border-[#C8E6C9] bg-[#EDF3EC] text-[#346538]'
                            : 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {isPhish ? (
                          <ShieldAlert className="w-2.5 h-2.5" />
                        ) : isSuspicious ? (
                          <AlertTriangle className="w-2.5 h-2.5" />
                        ) : (
                          <ShieldCheck className="w-2.5 h-2.5" />
                        )}
                        {item.verdict.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap font-bold">
                      <span
                        className={
                          isPhish
                            ? isMinimal ? 'text-[#9F2F2D]' : 'text-rose-400'
                            : isSuspicious
                            ? isMinimal ? 'text-[#956400]' : 'text-amber-400'
                            : isMinimal ? 'text-[#346538]' : 'text-emerald-400'
                        }
                      >
                        {item.risk_score}
                      </span>
                    </td>
                    <td
                      className={`p-3 whitespace-nowrap text-[11px] ${
                        isMinimal ? 'text-[#787774]' : 'text-white/40'
                      }`}
                    >
                      {item.created_at}
                    </td>
                    <td className="p-3 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isMinimal
                            ? 'hover:bg-[#FDEBEC] text-[#787774] hover:text-[#9F2F2D]'
                            : 'hover:bg-rose-500/20 text-white/30 hover:text-rose-300'
                        }`}
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
