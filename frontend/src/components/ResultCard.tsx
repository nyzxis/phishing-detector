import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, AlertOctagon, Copy, Check, Terminal, Cpu } from 'lucide-react';
import { ScanResult } from '../lib/api';

interface ResultCardProps {
  result: ScanResult;
  type: 'url' | 'email';
  theme?: 'cyber' | 'minimalist';
}

export default function ResultCard({ result, type, theme = 'cyber' }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const isMinimal = theme === 'minimalist';

  const isSafe = result.verdict === 'Safe';
  const isSuspicious = result.verdict === 'Suspicious';
  const isPhishing = result.verdict === 'Phishing';

  // Minimalist pastel colors vs Cyber glow
  const styles = isPhishing
    ? {
        border: isMinimal ? 'border-[#F8D7DA]' : 'border-rose-500/40',
        bg: isMinimal ? 'bg-white' : 'bg-[#0a0d16] bg-gradient-to-b from-rose-500/15 via-rose-500/5 to-transparent',
        text: isMinimal ? 'text-[#9F2F2D]' : 'text-rose-400',
        badge: isMinimal ? 'bg-[#FDEBEC] text-[#9F2F2D] border border-[#F8D7DA]' : 'bg-rose-500/20 border-rose-500/40 text-rose-300',
        glow: isMinimal ? 'shadow-[0_2px_8px_rgba(159,47,45,0.06)]' : 'cyber-glow-rose',
        icon: ShieldAlert,
        iconBox: isMinimal ? 'bg-[#FDEBEC] text-[#9F2F2D]' : 'bg-black/50 text-rose-400 border border-rose-500/40',
        gaugeStroke: isMinimal ? '#9F2F2D' : '#f43f5e',
        directive: 'Quarantine immediately. Block sender/domain across firewall and advise users against credential submission.',
      }
    : isSuspicious
    ? {
        border: isMinimal ? 'border-[#F5E79E]' : 'border-amber-500/40',
        bg: isMinimal ? 'bg-white' : 'bg-[#0a0d16] bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent',
        text: isMinimal ? 'text-[#956400]' : 'text-amber-400',
        badge: isMinimal ? 'bg-[#FBF3DB] text-[#956400] border border-[#F5E79E]' : 'bg-amber-500/20 border-amber-500/40 text-amber-300',
        glow: isMinimal ? 'shadow-[0_2px_8px_rgba(149,100,0,0.06)]' : 'cyber-glow-amber',
        icon: AlertTriangle,
        iconBox: isMinimal ? 'bg-[#FBF3DB] text-[#956400]' : 'bg-black/50 text-amber-400 border border-amber-500/40',
        gaugeStroke: isMinimal ? '#956400' : '#fbbf24',
        directive: 'Inspect destination server certificates manually. Verify out-of-band before executing actions.',
      }
    : {
        border: isMinimal ? 'border-[#D4EDDA]' : 'border-emerald-500/40',
        bg: isMinimal ? 'bg-white' : 'bg-[#0a0d16] bg-gradient-to-b from-emerald-500/15 via-emerald-500/5 to-transparent',
        text: isMinimal ? 'text-[#346538]' : 'text-emerald-400',
        badge: isMinimal ? 'bg-[#EDF3EC] text-[#346538] border border-[#D4EDDA]' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
        glow: isMinimal ? 'shadow-[0_2px_8px_rgba(52,101,56,0.06)]' : 'cyber-glow-emerald',
        icon: ShieldCheck,
        iconBox: isMinimal ? 'bg-[#EDF3EC] text-[#346538]' : 'bg-black/50 text-emerald-400 border border-emerald-500/40',
        gaugeStroke: isMinimal ? '#346538' : '#34d399',
        directive: 'Standard security posture. No malicious indicators found in current analysis snapshot.',
      };

  const Icon = styles.icon;

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

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.risk_score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`border ${styles.border} ${styles.bg} ${styles.glow} p-5 sm:p-6 transition-all duration-300 space-y-6 ${
        isMinimal ? 'rounded-[10px]' : 'rounded-2xl backdrop-blur-xl'
      }`}
    >
      {/* Top Banner */}
      <div
        className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b ${
          isMinimal ? 'border-[#EAEAEA]' : 'border-white/10'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-[8px] ${styles.iconBox} shrink-0`}>
            <Icon className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase ${styles.badge}`}>
                {result.verdict}
              </span>
              <span className={`text-[11px] font-mono flex items-center gap-1 ${isMinimal ? 'text-[#787774]' : 'text-white/40'}`}>
                <Cpu className={`w-3 h-3 ${isMinimal ? 'text-[#111111]' : 'text-cyan-400'}`} />
                {result.source === 'edge' ? 'EDGE HEURISTICS' : 'RANDOM FOREST ML'} • CONFIDENCE {(result.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <h3
              className={`text-lg sm:text-xl font-bold tracking-tight ${
                isMinimal ? 'font-sans-clean text-[#111111]' : 'font-mono text-white'
              }`}
            >
              {isPhishing
                ? 'Critical Threat // Malicious Payload Detected'
                : isSuspicious
                ? 'Elevated Risk // Anomalies Identified'
                : 'Verified Benign // Clean Signature'}
            </h3>
            <p className={`text-xs font-mono max-w-xl leading-relaxed ${isMinimal ? 'text-[#787774]' : 'text-white/60'}`}>
              {isPhishing
                ? 'High probability of credential theft or deceptive social engineering. Do not authenticate or interact.'
                : isSuspicious
                ? 'This item exhibits deceptive structural patterns or urgency hooks common in spoofing.'
                : 'Zero weaponized heuristics or credential harvesting signals were triggered during telemetry evaluation.'}
            </p>
          </div>
        </div>

        {/* Radial Risk Gauge */}
        <div
          className={`flex items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 ${
            isMinimal ? 'border-[#EAEAEA]' : 'border-white/10'
          }`}
        >
          <div className="text-right">
            <span className={`text-[10px] font-mono tracking-wider uppercase block ${isMinimal ? 'text-[#787774]' : 'text-white/40'}`}>
              SECURITY INDEX
            </span>
            <div className={`text-3xl sm:text-4xl font-mono font-black ${styles.text} tracking-tight`}>
              {result.risk_score}
              <span className={`text-sm font-normal ${isMinimal ? 'text-[#787774]' : 'text-white/30'}`}>/100</span>
            </div>
          </div>

          <div className="relative w-18 h-18 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className={isMinimal ? 'text-[#EAEAEA]' : 'text-white/10'}
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
                stroke={styles.gaugeStroke}
                fill="transparent"
              />
            </svg>
            <div
              className={`absolute inset-0 flex items-center justify-center font-mono text-xs font-bold ${
                isMinimal ? 'text-[#111111]' : 'text-white/80'
              }`}
            >
              {result.risk_score}%
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Security Directive */}
      <div
        className={`p-3.5 rounded-[8px] flex items-start gap-3 text-xs font-mono transition-colors ${
          isMinimal ? 'bg-[#F7F6F3] border border-[#EAEAEA]' : 'bg-white/[0.03] border border-white/10'
        }`}
      >
        <Terminal className={`w-4 h-4 shrink-0 mt-0.5 ${isMinimal ? 'text-[#111111]' : 'text-cyan-400'}`} />
        <div className="flex-1">
          <span className={`text-[10px] uppercase tracking-wider block mb-0.5 ${isMinimal ? 'text-[#787774]' : 'text-white/40'}`}>
            RECOMMENDED PROTOCOL
          </span>
          <span className={isMinimal ? 'text-[#111111]' : 'text-white/80'}>{styles.directive}</span>
        </div>
        <button
          onClick={handleCopyReport}
          className={`shrink-0 px-2.5 py-1 rounded-[6px] text-[11px] flex items-center gap-1.5 transition-all active:scale-[0.97] ${
            isMinimal
              ? 'bg-white border border-[#EAEAEA] text-[#111111] hover:bg-[#F0EFEB]'
              : 'bg-white/5 border border-white/15 text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-slate-400" />
              <span>Copy Report</span>
            </>
          )}
        </button>
      </div>

      {/* Threat Breakdown Flags */}
      <div>
        <h4 className={`text-xs font-mono tracking-wider uppercase mb-3 flex items-center gap-2 ${isMinimal ? 'text-[#787774]' : 'text-white/50'}`}>
          EXPLAINABLE AI DEVIATION BREAKDOWN
        </h4>

        {result.threat_flags.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {result.threat_flags.map((flag, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-[8px] text-xs font-mono leading-snug ${
                  isMinimal
                    ? 'bg-[#FDEBEC] border border-[#F8D7DA] text-[#9F2F2D]'
                    : 'border border-rose-500/25 bg-rose-500/5 text-rose-200'
                }`}
              >
                <AlertOctagon className={`w-4 h-4 shrink-0 mt-0.5 ${isMinimal ? 'text-[#9F2F2D]' : 'text-rose-400'}`} />
                <span>{flag}</span>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`flex items-center gap-3 p-3.5 rounded-[8px] text-xs font-mono ${
              isMinimal
                ? 'bg-[#EDF3EC] border border-[#D4EDDA] text-[#346538]'
                : 'border border-emerald-500/20 bg-emerald-500/5 text-emerald-300'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 shrink-0 ${isMinimal ? 'text-[#346538]' : 'text-emerald-400'}`} />
            <span>Telemetry verified. Passed all structural, entropy, and NLP keyword thresholds without red flags.</span>
          </div>
        )}
      </div>

      {/* Extracted Telemetry Attributes */}
      {result.details && Object.keys(result.details).length > 0 && (
        <div className={`pt-5 border-t ${isMinimal ? 'border-[#EAEAEA]' : 'border-white/10'}`}>
          <h4 className={`text-[11px] font-mono tracking-wider uppercase mb-3 ${isMinimal ? 'text-[#787774]' : 'text-white/40'}`}>
            TECHNICAL ATTRIBUTES &amp; METRICS
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 font-mono text-xs">
            {type === 'url' ? (
              <>
                <div className={`p-3 rounded-[8px] ${isMinimal ? 'bg-[#F7F6F3] border border-[#EAEAEA]' : 'border border-white/10 bg-white/[0.03]'}`}>
                  <div className={`text-[10px] uppercase ${isMinimal ? 'text-[#787774]' : 'text-white/40'}`}>HTTPS Protocol</div>
                  <div className={`font-bold mt-1 ${isMinimal ? 'text-[#111111]' : 'text-white'}`}>
                    {result.details.is_https ? 'TLS / Encrypted' : 'Cleartext HTTP'}
                  </div>
                </div>
                <div className={`p-3 rounded-[8px] ${isMinimal ? 'bg-[#F7F6F3] border border-[#EAEAEA]' : 'border border-white/10 bg-white/[0.03]'}`}>
                  <div className={`text-[10px] uppercase ${isMinimal ? 'text-[#787774]' : 'text-white/40'}`}>Direct IP Host</div>
                  <div className={`font-bold mt-1 ${isMinimal ? 'text-[#111111]' : 'text-white'}`}>
                    {result.details.has_ip_address ? 'Detected (High Risk)' : 'Clean (Domain FQDN)'}
                  </div>
                </div>
                <div className={`p-3 rounded-[8px] ${isMinimal ? 'bg-[#F7F6F3] border border-[#EAEAEA]' : 'border border-white/10 bg-white/[0.03]'}`}>
                  <div className={`text-[10px] uppercase ${isMinimal ? 'text-[#787774]' : 'text-white/40'}`}>Domain Entropy</div>
                  <div className={`font-bold mt-1 ${isMinimal ? 'text-[#111111]' : 'text-white'}`}>
                    {result.details.domain_entropy || 0} bits
                  </div>
                </div>
                <div className={`p-3 rounded-[8px] ${isMinimal ? 'bg-[#F7F6F3] border border-[#EAEAEA]' : 'border border-white/10 bg-white/[0.03]'}`}>
                  <div className={`text-[10px] uppercase ${isMinimal ? 'text-[#787774]' : 'text-white/40'}`}>Subdomain Depth</div>
                  <div className={`font-bold mt-1 ${isMinimal ? 'text-[#111111]' : 'text-white'}`}>
                    {result.details.subdomain_depth || 0} levels
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={`p-3 rounded-[8px] ${isMinimal ? 'bg-[#F7F6F3] border border-[#EAEAEA]' : 'border border-white/10 bg-white/[0.03]'}`}>
                  <div className={`text-[10px] uppercase ${isMinimal ? 'text-[#787774]' : 'text-white/40'}`}>Word Count</div>
                  <div className={`font-bold mt-1 ${isMinimal ? 'text-[#111111]' : 'text-white'}`}>
                    {result.details.word_count || 0} words
                  </div>
                </div>
                <div className={`p-3 rounded-[8px] ${isMinimal ? 'bg-[#F7F6F3] border border-[#EAEAEA]' : 'border border-white/10 bg-white/[0.03]'}`}>
                  <div className={`text-[10px] uppercase ${isMinimal ? 'text-[#787774]' : 'text-white/40'}`}>Embedded Links</div>
                  <div className={`font-bold mt-1 ${isMinimal ? 'text-[#111111]' : 'text-white'}`}>
                    {result.details.embedded_urls_count || 0} URLs
                  </div>
                </div>
                <div className={`p-3 rounded-[8px] ${isMinimal ? 'bg-[#F7F6F3] border border-[#EAEAEA]' : 'border border-white/10 bg-white/[0.03]'}`}>
                  <div className={`text-[10px] uppercase ${isMinimal ? 'text-[#787774]' : 'text-white/40'}`}>Urgency Triggers</div>
                  <div className={`font-bold mt-1 ${isMinimal ? 'text-[#111111]' : 'text-white'}`}>
                    {result.details.urgency_triggers?.length || 0} detected
                  </div>
                </div>
                <div className={`p-3 rounded-[8px] ${isMinimal ? 'bg-[#F7F6F3] border border-[#EAEAEA]' : 'border border-white/10 bg-white/[0.03]'}`}>
                  <div className={`text-[10px] uppercase ${isMinimal ? 'text-[#787774]' : 'text-white/40'}`}>Financial Lures</div>
                  <div className={`font-bold mt-1 ${isMinimal ? 'text-[#111111]' : 'text-white'}`}>
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
