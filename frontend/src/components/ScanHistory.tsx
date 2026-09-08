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
    if (window.confirm('Are you sure you want to clear all forensic telemetry records?')) {
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
      className={`rounded-xl transition-all p-6 sm:p-7 space-y-4 ${
        isMinimal
          ? 'minimalist-card'
          : 'optical-panel'
      }`}
    >
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <div
            className={`flex items-center gap-2 text-xs font-mono tracking-wider uppercase mb-1 ${
              isMinimal ? 'text-[#6B667A]' : 'text-purple-400'
            }`}
          >
            <History className="w-4 h-4" />
            <span>OPTICAL SPECTROGRAPH // AUDIT DATABASE</span>
          </div>
          <h3
            className={`text-lg font-bold tracking-tight ${
              isMinimal ? 'font-sans-clean text-[#201B34]' : 'font-mono text-white'
            }`}
          >
            Historical Forensic Scan Corpus ({history.length})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-all ${
                isMinimal
                  ? 'border border-[#E0DBCF] hover:border-red-300 bg-[#EFECE3] hover:bg-red-50 text-[#6B667A] hover:text-[#9F2F2D]'
                  : 'border border-[#231B3A] hover:border-rose-500/40 bg-[#120D22] hover:bg-rose-500/10 text-white/50 hover:text-rose-300'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Corpus</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <div className="relative flex-1">
          <Search
            className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
              isMinimal ? 'text-[#6B667A]' : 'text-white/30'
            }`}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inspected target payloads..."
            className={`w-full pl-9 pr-4 py-2 rounded-lg text-xs font-mono transition-colors focus:outline-none ${
              isMinimal
                ? 'border border-[#E0DBCF] bg-[#EFECE3] text-[#201B34] placeholder-[#6B667A] focus:border-[#201B34]'
                : 'border border-[#231B3A] bg-[#06040C] text-white placeholder-white/30 focus:border-purple-500'
            }`}
          />
        </div>

        <div
          className={`flex items-center gap-1 p-1 rounded-lg text-xs font-mono ${
            isMinimal ? 'border border-[#E0DBCF] bg-[#EFECE3]' : 'border border-[#231B3A] bg-[#0A0714]'
          }`}
        >
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded transition-all ${
              filterType === 'all'
                ? isMinimal
                  ? 'bg-[#201B34] text-[#FAF8F2]'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : isMinimal
                ? 'text-[#6B667A] hover:text-[#201B34]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            All ({history.length})
          </button>
          <button
            onClick={() => setFilterType('url')}
            className={`px-3 py-1 rounded transition-all ${
              filterType === 'url'
                ? isMinimal
                  ? 'bg-[#201B34] text-[#FAF8F2]'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : isMinimal
                ? 'text-[#6B667A] hover:text-[#201B34]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            URLs
          </button>
          <button
            onClick={() => setFilterType('email')}
            className={`px-3 py-1 rounded transition-all ${
              filterType === 'email'
                ? isMinimal
                  ? 'bg-[#201B34] text-[#FAF8F2]'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : isMinimal
                ? 'text-[#6B667A] hover:text-[#201B34]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Emails
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className={`overflow-x-auto rounded-lg border ${
          isMinimal ? 'border-[#E0DBCF] bg-[#FAF8F2]' : 'border-[#231B3A] bg-[#06040C]'
        }`}
      >
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr
              className={`border-b uppercase text-[10px] tracking-wider ${
                isMinimal
                  ? 'border-[#E0DBCF] bg-[#EFECE3] text-[#6B667A]'
                  : 'border-[#231B3A] bg-[#0E0A1A] text-white/40'
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
          <tbody className={isMinimal ? 'divide-y divide-[#E0DBCF]' : 'divide-y divide-[#1A142A]'}>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className={`p-8 text-center ${isMinimal ? 'text-[#6B667A]' : 'text-white/30'}`}
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
                      isMinimal ? 'hover:bg-[#EFECE3]/50' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border ${
                          isMinimal
                            ? 'border-[#E0DBCF] bg-[#EFECE3] text-[#201B34]'
                            : 'border-[#231B3A] bg-[#0E0A1A] text-white/70'
                        }`}
                      >
                        {item.scan_type === 'url' ? (
                          <Globe className={`w-3 h-3 ${isMinimal ? 'text-[#4F46E5]' : 'text-purple-400'}`} />
                        ) : (
                          <Mail className={`w-3 h-3 ${isMinimal ? 'text-[#4F46E5]' : 'text-cyan-400'}`} />
                        )}
                        {item.scan_type.toUpperCase()}
                      </span>
                    </td>
                    <td
                      className={`p-3 max-w-xs truncate ${
                        isMinimal ? 'text-[#201B34]' : 'text-white/80'
                      }`}
                      title={item.full_input}
                    >
                      {item.target_input}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold ${
                          isPhish
                            ? isMinimal
                              ? 'border-[#F8D7DA] bg-[#FDEBEC] text-[#9F2F2D]'
                              : 'border-rose-500/40 bg-rose-500/15 text-rose-300'
                            : isSuspicious
                            ? isMinimal
                              ? 'border-[#F5E79E] bg-[#FBF3DB] text-[#956400]'
                              : 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                            : isMinimal
                            ? 'border-[#DCD3F1] bg-[#ECE7F7] text-[#4F46E5]'
                            : 'border-purple-500/40 bg-purple-500/15 text-purple-300'
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
                    <td className="p-3 whitespace-nowrap font-bold tabular-nums">
                      <span
                        className={
                          isPhish
                            ? isMinimal ? 'text-[#9F2F2D]' : 'text-rose-400'
                            : isSuspicious
                            ? isMinimal ? 'text-[#956400]' : 'text-amber-400'
                            : isMinimal ? 'text-[#4F46E5]' : 'text-purple-400'
                        }
                      >
                        {item.risk_score}
                      </span>
                    </td>
                    <td
                      className={`p-3 whitespace-nowrap text-[11px] ${
                        isMinimal ? 'text-[#6B667A]' : 'text-white/40'
                      }`}
                    >
                      {item.created_at}
                    </td>
                    <td className="p-3 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className={`p-1.5 rounded transition-colors ${
                          isMinimal
                            ? 'hover:bg-[#FDEBEC] text-[#6B667A] hover:text-[#9F2F2D]'
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
