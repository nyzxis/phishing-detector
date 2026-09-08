import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Activity, Eye, Zap, Radio } from 'lucide-react';
import { StatsResponse } from '../lib/api';

interface StatsCardsProps {
  stats: StatsResponse | null;
  loading: boolean;
  theme?: 'cyber' | 'minimalist';
}

export default function StatsCards({ stats, loading, theme = 'cyber' }: StatsCardsProps) {
  const isMinimal = theme === 'minimalist';

  const cards = [
    {
      title: 'SPECTRUM ANALYZED',
      value: loading ? '--' : stats?.total_scans.toLocaleString() || '0',
      subtitle: `${stats?.url_scans_count || 0} URLs • ${stats?.email_scans_count || 0} Emails`,
      icon: Activity,
      color: 'text-purple-400',
      glow: 'hover:border-purple-500/40',
      minimalBadge: 'bg-[#ECE7F7] text-[#4F46E5] border border-[#DCD3F1]',
    },
    {
      title: 'WEAPONIZED INTERCEPTIONS',
      value: loading ? '--' : stats?.phishing_detected.toLocaleString() || '0',
      subtitle: 'Critical phishing vectors blocked',
      icon: ShieldAlert,
      color: 'text-rose-400',
      glow: 'hover:border-rose-500/40',
      minimalBadge: 'bg-[#FDEBEC] text-[#9F2F2D] border border-[#F8D7DA]',
    },
    {
      title: 'SPECTRAL ANOMALIES',
      value: loading ? '--' : stats?.suspicious_detected.toLocaleString() || '0',
      subtitle: 'Deceptive cues flagged',
      icon: AlertTriangle,
      color: 'text-amber-400',
      glow: 'hover:border-amber-500/40',
      minimalBadge: 'bg-[#FBF3DB] text-[#956400] border border-[#F5E79E]',
    },
    {
      title: 'INTERCEPTION EFFICIENCY',
      value: loading ? '--' : `${stats?.threat_rate || 0}%`,
      subtitle: `Mean Risk Score: ${stats?.average_risk_score || 0}/100`,
      icon: Zap,
      color: 'text-cyan-400',
      glow: 'hover:border-cyan-500/40',
      minimalBadge: 'bg-[#E1F3FE] text-[#1F6C9F] border border-[#BEE3F8]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-5 transition-all duration-200 rounded-xl ${
              isMinimal
                ? 'minimalist-card-interactive'
                : `optical-panel-interactive ${card.glow}`
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-[10px] font-mono tracking-wider uppercase ${
                  isMinimal ? 'text-[#6B667A] font-semibold' : 'text-white/40'
                }`}
              >
                {card.title}
              </span>
              <div
                className={`p-1.5 rounded-lg ${
                  isMinimal ? card.minimalBadge : `bg-white/5 ${card.color} border border-white/10`
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              className={`text-3xl font-bold font-mono tracking-tight mb-1 tabular-nums ${
                isMinimal ? 'text-[#201B34]' : 'text-white'
              }`}
            >
              {card.value}
            </div>

            <p className={`text-xs font-mono ${isMinimal ? 'text-[#6B667A]' : 'text-white/50'}`}>
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}
