import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, AlertOctagon, Copy, Check, Terminal, ExternalLink, Cpu } from 'lucide-react';
import { ScanResult } from '../lib/api';

interface ResultCardProps {
  result: ScanResult;
  type: 'url' | 'email';
}

export default function ResultCard({ result, type }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const isSafe = result.verdict === 'Safe';
  const isSuspicious = result.verdict === 'Suspicious';
  const isPhishing = result.verdict === 'Phishing';

  const theme = isPhishing
    ? {
        border: 'border-rose-500/40',
        bg: 'from-rose-500/15 via-rose-500/5 to-transparent',
        text: 'text-rose-400',
        badgeBg: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
        glow: 'cyber-glow-rose',
        icon: ShieldAlert,
        title: 'CRITICAL THREAT // MALICIOUS PAYLOAD DETECTED',
        desc: 'High probability of credential theft or deceptive social engineering. Do not open, click, or authenticate.',
        directive: 'Quarantine immediately. Block sender/domain across firewall and advise users against credential submission.',
      }
    : isSuspicious
    ? {
        border: 'border-amber-500/40',
        bg: 'from-amber-500/15 via-amber-500/5 to-transparent',
        text: 'text-amber-400',
        badgeBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
        glow: 'cyber-glow-amber',
        icon: AlertTriangle,
        title: 'ELEVATED RISK // ANOMALIES IDENTIFIED',
        desc: 'This item exhibits deceptive structural patterns or urgency hooks common in spoofing attacks.',
        directive: 'Inspect destination server certificates manually. Verify out-of-band before executing actions.',
      }
    : {
        border: 'border-emerald-500/40',
        bg: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
        text: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
        glow: 'cyber-glow-emerald',
        icon: ShieldCheck,
        title: 'VERIFIED BENIGN // CLEAN SIGNATURE',
        desc: 'Zero weaponized heuristics or credential harvesting signals were triggered during telemetry evaluation.',
        directive: 'Standard security posture. No malicious indicators found in current analysis snapshot.',
      };

  const Icon = theme.icon;

  const handleCopyReport = () => {
    const report = [
      `=== PHISHGUARD THREAT AUDIT REPORT ===`,
      `Type: ${type.toUpperCase()}`,
      `Verdict: ${result.verdict.toUpperCase()} (Risk: ${result.risk_score}/100)`,
      `Confidence: ${(result.confidence * 100).toFixed(0)}%`,
      `Engine: ${result.source === 'edge' ? 'Edge Heuristics' : 'Cloud Scikit-learn ML'}`,
      `Timestamp: ${result.created_at || new Date().toISOString()}`,
      `Threat Flags:`,
      result.threat_flags.length > 0 ? result.threat_flags.map((f) => ` - ${f}`).join('\n') : ' - None (Clean)',
    ].join('\n');

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Radial dial calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.risk_score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-2xl border ${theme.border} bg-[#0a0d16] bg-gradient-to-b ${theme.bg} p-5 sm:p-6 backdrop-blur-xl ${theme.glow} space-y-6`}
    >
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="flex items-start gap-4">
          <div className={`p-3.5 rounded-2xl border ${theme.border} bg-black/50 ${theme.text} shrink-0 shadow-inner`}>
            <Icon className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold tracking-widest uppercase ${theme.badgeBg}`}>
                {result.verdict}
              </span>
              <span className="text-[11px] font-mono text-white/40 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" />
                {result.source === 'edge' ? 'EDGE HEURISTICS' : 'RANDOM FOREST ML'} • CONFIDENCE {(result.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-white">
              {theme.title}
            </h3>
            <p className="text-xs text-white/60 font-mono max-w-xl leading-relaxed">
              {theme.desc}
            </p>
          </div>
        </div>

        {/* Radial Risk Gauge */}
        <div className="flex items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/10">
          <div className="text-right">
            <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase block">
              SECURITY INDEX
            </span>
            <div className={`text-3xl sm:text-4xl font-mono font-black ${theme.text} tracking-tight`}>
              {result.risk_score}
              <span className="text-sm font-normal text-white/30">/100</span>
            </div>
          </div>

          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="text-white/10"
                strokeWidth="7"
                stroke="currentColor"
                fill="transparent"
              />
              <motion.circle
                cx="48"
                cy="48"
                r={radius}
                strokeWidth="7"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                strokeLinecap="round"
                className={isPhishing ? 'text-rose-500' : isSuspicious ? 'text-amber-400' : 'text-emerald-400'}
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-white/80">
              {result.risk_score}%
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Security Directive */}
      <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03] flex items-start gap-3 text-xs font-mono">
        <Terminal className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="text-[10px] uppercase text-white/40 tracking-wider block mb-0.5">
            RECOMMENDED PROTOCOL
          </span>
          <span className="text-white/80">{theme.directive}</span>
        </div>
        <button
          onClick={handleCopyReport}
          className="shrink-0 px-2.5 py-1 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-[11px] text-white/70 hover:text-white flex items-center gap-1.5 transition-all active:scale-[0.97]"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-300">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-white/50" />
              <span>Copy Report</span>
            </>
          )}
        </button>
      </div>

      {/* Threat Breakdown Flags */}
      <div>
        <h4 className="text-xs font-mono tracking-widest uppercase text-white/50 mb-3 flex items-center gap-2">
          EXPLAINABLE AI DEVIATION BREAKDOWN
        </h4>

        {result.threat_flags.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {result.threat_flags.map((flag, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl border border-rose-500/25 bg-rose-500/5 text-xs font-mono text-rose-200"
              >
                <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{flag}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs font-mono text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Telemetry verified. Passed all structural, entropy, and NLP keyword thresholds without red flags.</span>
          </div>
        )}
      </div>

      {/* Extracted Telemetry Attributes */}
      {result.details && Object.keys(result.details).length > 0 && (
        <div className="pt-5 border-t border-white/10">
          <h4 className="text-[11px] font-mono tracking-widest uppercase text-white/40 mb-3">
            TECHNICAL ATTRIBUTES &amp; METRICS
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 font-mono text-xs">
            {type === 'url' ? (
              <>
                <div className="p-3 rounded-xl border border-white/10 bg-white/[0.03]">
                  <div className="text-[10px] text-white/40 uppercase">HTTPS Protocol</div>
                  <div className="text-white font-bold mt-1">
                    {result.details.is_https ? 'TLS / Encrypted' : 'Cleartext HTTP'}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-white/10 bg-white/[0.03]">
                  <div className="text-[10px] text-white/40 uppercase">Direct IP Host</div>
                  <div className="text-white font-bold mt-1">
                    {result.details.has_ip_address ? 'Detected (High Risk)' : 'Clean (Domain FQDN)'}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-white/10 bg-white/[0.03]">
                  <div className="text-[10px] text-white/40 uppercase">Domain Entropy</div>
                  <div className="text-white font-bold mt-1">
                    {result.details.domain_entropy || 0} bits
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-white/10 bg-white/[0.03]">
                  <div className="text-[10px] text-white/40 uppercase">Subdomain Depth</div>
                  <div className="text-white font-bold mt-1">
                    {result.details.subdomain_depth || 0} levels
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 rounded-xl border border-white/10 bg-white/[0.03]">
                  <div className="text-[10px] text-white/40 uppercase">Word Count</div>
                  <div className="text-white font-bold mt-1">
                    {result.details.word_count || 0} words
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-white/10 bg-white/[0.03]">
                  <div className="text-[10px] text-white/40 uppercase">Embedded Links</div>
                  <div className="text-white font-bold mt-1">
                    {result.details.embedded_urls_count || 0} URLs
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-white/10 bg-white/[0.03]">
                  <div className="text-[10px] text-white/40 uppercase">Urgency Triggers</div>
                  <div className="text-white font-bold mt-1">
                    {result.details.urgency_triggers?.length || 0} detected
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-white/10 bg-white/[0.03]">
                  <div className="text-[10px] text-white/40 uppercase">Financial Lures</div>
                  <div className="text-white font-bold mt-1">
                    {result.details.financial_triggers?.length || 0} detected
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
