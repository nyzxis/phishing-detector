import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Activity } from 'lucide-react';
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
      title: 'TOTAL SCANNED',
      value: loading ? '--' : stats?.total_scans.toLocaleString() || '0',
      subtitle: `${stats?.url_scans_count || 0} URLs • ${stats?.email_scans_count || 0} Emails`,
      icon: Activity,
      cyberColor: 'text-cyan-400',
      cyberBorder: 'border-cyan-500/20',
      cyberBg: 'from-cyan-500/10 via-transparent to-transparent',
      minimalBadge: 'bg-[#E1F3FE] text-[#1F6C9F]',
    },
    {
      title: 'PHISHING BLOCKED',
      value: loading ? '--' : stats?.phishing_detected.toLocaleString() || '0',
      subtitle: 'Critical security threats',
      icon: ShieldAlert,
      cyberColor: 'text-rose-400',
      cyberBorder: 'border-rose-500/20',
      cyberBg: 'from-rose-500/10 via-transparent to-transparent',
      minimalBadge: 'bg-[#FDEBEC] text-[#9F2F2D]',
    },
    {
      title: 'SUSPICIOUS FLAGGED',
      value: loading ? '--' : stats?.suspicious_detected.toLocaleString() || '0',
      subtitle: 'Cautionary risk indicators',
      icon: AlertTriangle,
      cyberColor: 'text-amber-400',
      cyberBorder: 'border-amber-500/20',
      cyberBg: 'from-amber-500/10 via-transparent to-transparent',
      minimalBadge: 'bg-[#FBF3DB] text-[#956400]',
    },
    {
      title: 'THREAT INTERCEPTION RATE',
      value: loading ? '--' : `${stats?.threat_rate || 0}%`,
      subtitle: `Avg Risk: ${stats?.average_risk_score || 0}/100`,
      icon: ShieldCheck,
      cyberColor: 'text-emerald-400',
      cyberBorder: 'border-emerald-500/20',
      cyberBg: 'from-emerald-500/10 via-transparent to-transparent',
      minimalBadge: 'bg-[#EDF3EC] text-[#346538]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`transition-all duration-200 ${
              isMinimal
                ? 'rounded-[10px] bg-white border border-[#EAEAEA] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-[#D0D0D0]'
                : `relative rounded-2xl border ${card.cyberBorder} bg-[#0c0e17]/70 bg-gradient-to-b ${card.cyberBg} p-5 backdrop-blur-xl hover:border-white/20`
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-[11px] font-mono tracking-wider uppercase ${
                  isMinimal ? 'text-[#787774] font-medium' : 'text-white/50'
                }`}
              >
                {card.title}
              </span>
              <div
                className={`p-1.5 rounded-lg ${
                  isMinimal ? card.minimalBadge : `bg-white/5 ${card.cyberColor}`
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              className={`text-3xl font-bold font-mono tracking-tight mb-1 ${
                isMinimal ? 'text-[#111111]' : 'text-white'
              }`}
            >
              {card.value}
            </div>

            <p className={`text-xs font-mono ${isMinimal ? 'text-[#787774]' : 'text-white/40'}`}>
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}
