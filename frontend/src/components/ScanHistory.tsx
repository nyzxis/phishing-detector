import React, { useState } from 'react';
import { History, Search, Trash2, Globe, Mail, ShieldAlert, ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';
import { HistoryItem, deleteHistoryItem, clearAllHistory } from '../lib/api';

interface ScanHistoryProps {
  history: HistoryItem[];
  onRefresh: () => void;
}

export default function ScanHistory({ history, onRefresh }: ScanHistoryProps) {
  const [filterType, setFilterType] = useState<'all' | 'url' | 'email'>('all');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

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
    <div className="rounded-2xl border border-white/10 bg-[#0a0d16]/80 p-6 backdrop-blur-xl space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-wider uppercase mb-1">
            <History className="w-4 h-4" />
            TELEMETRY & AUDIT LOG
          </div>
          <h3 className="text-lg font-bold font-mono text-white tracking-tight">
            Historical Scan Database ({history.length})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-rose-500/40 bg-white/5 hover:bg-rose-500/10 text-white/50 hover:text-rose-300 text-xs font-mono flex items-center gap-1.5 transition-all"
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
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inspected targets..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-white/10 bg-black/40 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-black/40 text-xs font-mono">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterType === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-white/40 hover:text-white'
            }`}
          >
            All ({history.length})
          </button>
          <button
            onClick={() => setFilterType('url')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterType === 'url' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-white/40 hover:text-white'
            }`}
          >
            URLs
          </button>
          <button
            onClick={() => setFilterType('email')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterType === 'email' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-white/40 hover:text-white'
            }`}
          >
            Emails
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/30">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-white/40 uppercase text-[10px] tracking-wider">
              <th className="p-3">Type</th>
              <th className="p-3">Target Payload</th>
              <th className="p-3">Verdict</th>
              <th className="p-3">Risk</th>
              <th className="p-3">Timestamp</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-white/30">
                  No scan records match current criteria.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const isPhish = item.verdict === 'Phishing';
                const isSuspicious = item.verdict === 'Suspicious';

                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-white/10 bg-white/5 text-white/70">
                        {item.scan_type === 'url' ? (
                          <Globe className="w-3 h-3 text-cyan-400" />
                        ) : (
                          <Mail className="w-3 h-3 text-indigo-400" />
                        )}
                        {item.scan_type.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs truncate text-white/80" title={item.full_input}>
                      {item.target_input}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                          isPhish
                            ? 'border-rose-500/40 bg-rose-500/20 text-rose-300'
                            : isSuspicious
                            ? 'border-amber-500/40 bg-amber-500/20 text-amber-300'
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
                          isPhish ? 'text-rose-400' : isSuspicious ? 'text-amber-400' : 'text-emerald-400'
                        }
                      >
                        {item.risk_score}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap text-white/40 text-[11px]">
                      {item.created_at}
                    </td>
                    <td className="p-3 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-white/30 hover:text-rose-300 transition-colors"
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
