import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Activity, Database, Cpu } from 'lucide-react';
import { StatsResponse } from '../lib/api';

interface StatsCardsProps {
  stats: StatsResponse | null;
  loading: boolean;
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  const cards = [
    {
      title: 'TOTAL SCANNED',
      value: loading ? '--' : stats?.total_scans.toLocaleString() || '0',
      subtitle: `${stats?.url_scans_count || 0} URLs • ${stats?.email_scans_count || 0} Emails`,
      icon: Activity,
      color: 'text-cyan-400',
      border: 'border-cyan-500/20',
      bg: 'from-cyan-500/10 via-transparent to-transparent',
    },
    {
      title: 'PHISHING BLOCKED',
      value: loading ? '--' : stats?.phishing_detected.toLocaleString() || '0',
      subtitle: 'Critical security threats',
      icon: ShieldAlert,
      color: 'text-rose-400',
      border: 'border-rose-500/20',
      bg: 'from-rose-500/10 via-transparent to-transparent',
    },
    {
      title: 'SUSPICIOUS FLAGGED',
      value: loading ? '--' : stats?.suspicious_detected.toLocaleString() || '0',
      subtitle: 'Cautionary risk indicators',
      icon: AlertTriangle,
      color: 'text-amber-400',
      border: 'border-amber-500/20',
      bg: 'from-amber-500/10 via-transparent to-transparent',
    },
    {
      title: 'THREAT INTERCEPTION RATE',
      value: loading ? '--' : `${stats?.threat_rate || 0}%`,
      subtitle: `Avg Risk: ${stats?.average_risk_score || 0}/100`,
      icon: ShieldCheck,
      color: 'text-emerald-400',
      border: 'border-emerald-500/20',
      bg: 'from-emerald-500/10 via-transparent to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative rounded-2xl border ${card.border} bg-[#0c0e17]/70 bg-gradient-to-b ${card.bg} p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/20`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono tracking-widest text-white/50 uppercase">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl bg-white/5 ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="text-3xl font-bold font-mono tracking-tight text-white mb-1">
              {card.value}
            </div>

            <p className="text-xs font-mono text-white/40">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}
