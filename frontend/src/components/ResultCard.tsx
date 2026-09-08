import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, AlertOctagon, Copy, Check, Terminal, Cpu, Eye, Radio } from 'lucide-react';
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

  // Optical Spectrum calibrated styles
  const styles = isPhishing
    ? {
        border: isMinimal ? 'border-[#F8D7DA]' : 'border-rose-500/40',
        bg: isMinimal ? 'bg-[#FAF8F2]' : 'bg-[#12080F]',
        text: isMinimal ? 'text-[#9F2F2D]' : 'text-rose-400',
        badge: isMinimal ? 'bg-[#FDEBEC] text-[#9F2F2D] border border-[#F8D7DA]' : 'bg-rose-500/15 border border-rose-500/35 text-rose-300',
        glow: isMinimal ? 'shadow-sm' : 'optical-glow-coral',
        icon: ShieldAlert,
        iconBox: isMinimal ? 'bg-[#FDEBEC] text-[#9F2F2D]' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40',
        gaugeStroke: isMinimal ? '#9F2F2D' : '#F43F5E',
        directive: 'QUARANTINE PAYLOAD: Severe credential harvesting or phishing threat detected. Block target domain across DNS firewalls.',
      }
    : isSuspicious
    ? {
        border: isMinimal ? 'border-[#F5E79E]' : 'border-amber-500/40',
        bg: isMinimal ? 'bg-[#FAF8F2]' : 'bg-[#140E08]',
        text: isMinimal ? 'text-[#956400]' : 'text-amber-400',
        badge: isMinimal ? 'bg-[#FBF3DB] text-[#956400] border border-[#F5E79E]' : 'bg-amber-500/15 border border-amber-500/35 text-amber-300',
        glow: isMinimal ? 'shadow-sm' : 'shadow-[0_0_24px_rgba(245,158,11,0.2)]',
        icon: AlertTriangle,
        iconBox: isMinimal ? 'bg-[#FBF3DB] text-[#956400]' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
        gaugeStroke: isMinimal ? '#956400' : '#F59E0B',
        directive: 'SPECTRAL CAUTION: Deceptive structural indicators or urgency cues flagged. Manually verify through out-of-band communication.',
      }
    : {
        border: isMinimal ? 'border-[#DCD3F1]' : 'border-purple-500/40',
        bg: isMinimal ? 'bg-[#FAF8F2]' : 'bg-[#0A0714]',
        text: isMinimal ? 'text-[#4F46E5]' : 'text-purple-400',
        badge: isMinimal ? 'bg-[#ECE7F7] text-[#4F46E5] border border-[#DCD3F1]' : 'bg-purple-500/15 border border-purple-500/35 text-purple-300',
        glow: isMinimal ? 'shadow-sm' : 'optical-glow-uv',
        icon: ShieldCheck,
        iconBox: isMinimal ? 'bg-[#ECE7F7] text-[#4F46E5]' : 'bg-purple-500/20 text-purple-400 border border-purple-500/40',
        gaugeStroke: isMinimal ? '#4F46E5' : '#8B5CF6',
        directive: 'SPECTRUM BENIGN: No weaponized keywords, suspicious TLDs, or credential harvesting payloads uncovered in optical sweep.',
      };

  const Icon = styles.icon;

  const handleCopyReport = () => {
    const report = [
      `=== PHISHGUARD OPTICAL FORENSIC DOSSIER ===`,
      `Target Type: ${type.toUpperCase()}`,
      `Verdict: ${result.verdict.toUpperCase()} (Risk Index: ${result.risk_score}/100)`,
      `Inference Confidence: ${(result.confidence * 100).toFixed(0)}%`,
      `Classification Engine: ${result.source === 'edge' ? 'Edge Heuristics' : 'Scikit-learn Optical Ensemble'}`,
      `Timestamp: ${result.created_at || new Date().toISOString()}`,
      `Detected Deviation Flags:`,
      result.threat_flags.length > 0 ? result.threat_flags.map((f) => ` - ${f}`).join('\n') : ' - None (Benign)',
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
      className={`border ${styles.border} ${styles.bg} ${styles.glow} p-6 sm:p-7 rounded-xl transition-all duration-300 space-y-6`}
    >
      {/* Top Banner */}
      <div
        className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b ${
          isMinimal ? 'border-[#E5E0D5]' : 'border-[#231B3A]'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${styles.iconBox} shrink-0`}>
            <Icon className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase ${styles.badge}`}>
                {result.verdict}
              </span>
              <span className={`text-[11px] font-mono flex items-center gap-1.5 ${isMinimal ? 'text-[#6B667A]' : 'text-white/50'}`}>
                <Cpu className={`w-3.5 h-3.5 ${isMinimal ? 'text-[#201B34]' : 'text-purple-400'}`} />
                <span>{result.source === 'edge' ? 'EDGE HEURISTIC TELESCOPE' : 'RANDOM FOREST CLASSIFIER'}</span>
                <span>•</span>
                <span>CONFIDENCE {(result.confidence * 100).toFixed(0)}%</span>
              </span>
            </div>
            <h3
              className={`text-lg sm:text-xl font-bold tracking-tight ${
                isMinimal ? 'font-sans-clean text-[#201B34]' : 'font-mono text-white'
              }`}
            >
              {isPhishing
                ? 'CRITICAL THREAT // WEAPONIZED PAYLOAD DETECTED'
                : isSuspicious
                ? 'ELEVATED RISK // SPECTRAL ANOMALIES IDENTIFIED'
                : 'CLEAN SPECTRUM // VERIFIED BENIGN SIGNATURE'}
            </h3>
            <p className={`text-xs font-mono max-w-xl leading-relaxed ${isMinimal ? 'text-[#6B667A]' : 'text-white/60'}`}>
              {isPhishing
                ? 'High probability of credential theft, social engineering extortion, or deceptive host spoofing. Quarantine immediately.'
                : isSuspicious
                ? 'This artifact exhibits deceptive lexical entropy or urgency cues characteristic of emerging evasion tactics.'
                : 'Passed all optical lexical, structural entropy, and semantic NLP validation thresholds without red flags.'}
            </p>
          </div>
        </div>

        {/* Radial Risk Gauge */}
        <div
          className={`flex items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 ${
            isMinimal ? 'border-[#E5E0D5]' : 'border-[#231B3A]'
          }`}
        >
          <div className="text-right">
            <span className={`text-[10px] font-mono tracking-wider uppercase block ${isMinimal ? 'text-[#6B667A]' : 'text-white/40'}`}>
              RISK INDEX
            </span>
            <div className={`text-3xl sm:text-4xl font-mono font-black ${styles.text} tracking-tight tabular-nums`}>
              {result.risk_score}
              <span className={`text-sm font-normal ${isMinimal ? 'text-[#6B667A]' : 'text-white/30'}`}>/100</span>
            </div>
          </div>

          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className={isMinimal ? 'text-[#E5E0D5]' : 'text-white/10'}
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
              className={`absolute inset-0 flex items-center justify-center font-mono text-xs font-bold tabular-nums ${
                isMinimal ? 'text-[#201B34]' : 'text-white'
              }`}
            >
              {result.risk_score}%
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Security Directive */}
      <div
        className={`p-4 rounded-lg flex items-start gap-3 text-xs font-mono transition-colors ${
          isMinimal ? 'bg-[#EFECE3] border border-[#E0DBCF]' : 'bg-[#08060F] border border-[#231B3A]'
        }`}
      >
        <Terminal className={`w-4 h-4 shrink-0 mt-0.5 ${isMinimal ? 'text-[#201B34]' : 'text-purple-400'}`} />
        <div className="flex-1">
          <span className={`text-[10px] uppercase tracking-wider block mb-0.5 font-bold ${isMinimal ? 'text-[#6B667A]' : 'text-white/40'}`}>
            FORENSIC DIRECTIVE
          </span>
          <span className={isMinimal ? 'text-[#201B34]' : 'text-white/90'}>{styles.directive}</span>
        </div>
        <button
          onClick={handleCopyReport}
          className={`shrink-0 px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-all active:scale-[0.97] ${
            isMinimal
              ? 'bg-[#FAF8F2] border border-[#E0DBCF] text-[#201B34] hover:bg-[#E5E0D5]'
              : 'bg-[#120D22] border border-[#231B3A] text-white/80 hover:text-white hover:border-purple-500/40'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-white/50" />
              <span>Copy Dossier</span>
            </>
          )}
        </button>
      </div>

      {/* Explainable AI Deviation Breakdown */}
      <div>
        <h4 className={`text-xs font-mono tracking-wider uppercase mb-3 flex items-center gap-2 ${isMinimal ? 'text-[#6B667A]' : 'text-white/50'}`}>
          EXPLAINABLE AI DEVIATION BREAKDOWN
        </h4>

        {result.threat_flags.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {result.threat_flags.map((flag, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-lg text-xs font-mono leading-snug border ${
                  isMinimal
                    ? 'bg-[#FDEBEC] border-[#F8D7DA] text-[#9F2F2D]'
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-200'
                }`}
              >
                <AlertOctagon className={`w-4 h-4 shrink-0 mt-0.5 ${isMinimal ? 'text-[#9F2F2D]' : 'text-rose-400'}`} />
                <span>{flag}</span>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`flex items-center gap-3 p-3.5 rounded-lg text-xs font-mono border ${
              isMinimal
                ? 'bg-[#ECE7F7] border-[#DCD3F1] text-[#4F46E5]'
                : 'border-purple-500/30 bg-purple-500/10 text-purple-200'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 shrink-0 ${isMinimal ? 'text-[#4F46E5]' : 'text-purple-400'}`} />
            <span>Optical telemetry clear. Passed all structural, entropy, and NLP semantic keyword thresholds without red flags.</span>
          </div>
        )}
      </div>

      {/* Extracted Telemetry Attributes */}
      {result.details && Object.keys(result.details).length > 0 && (
        <div className={`pt-5 border-t ${isMinimal ? 'border-[#E5E0D5]' : 'border-[#231B3A]'}`}>
          <h4 className={`text-[11px] font-mono tracking-wider uppercase mb-3 ${isMinimal ? 'text-[#6B667A]' : 'text-white/40'}`}>
            OPTICAL SENSOR ATTRIBUTES &amp; METRICS
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 font-mono text-xs">
            {type === 'url' ? (
              <>
                <div className={`p-3 rounded-lg border ${isMinimal ? 'bg-[#EFECE3] border-[#E0DBCF]' : 'border-[#231B3A] bg-[#0A0714]'}`}>
                  <div className={`text-[10px] uppercase ${isMinimal ? 'text-[#6B667A]' : 'text-white/40'}`}>TLS Protocol</div>
                  <div className={`font-bold mt-1 ${isMinimal ? 'text-[#201B34]' : 'text-white'}`}>
                    {result.details.is_https ? 'HTTPS Encrypted' : 'Cleartext HTTP'}
                  </div>
                </div>
                <div className={`p-3 rounded-lg border ${isMinimal ? 'bg-[#EFECE3] border-[#E0DBCF]' : 'border-[#231B3A] bg-[#0A0714]'}`}>
                  <div className={`text-[10px] uppercase ${isMinimal ? 'text-[#6B667A]' : 'text-white/40'}`}>Direct IP Host</div>
                  <div className={`font-bold mt-1 ${isMinimal ? 'text-[#201B34]' : 'text-white'}`}>
                    {result.details.has_ip_address ? 'Detected (High Risk)' : 'Clean FQDN Domain'}
                  </div>
                </div>
                <div className={`p-3 rounded-lg border ${isMinimal ? 'bg-[#EFECE3] border-[#E0DBCF]' : 'border-[#231B3A] bg-[#0A0714]'}`}>
                  <div className={`text-[10px] uppercase ${isMinimal ? 'text-[#6B667A]' : 'text-white/40'}`}>Domain Entropy</div>
                  <div className={`font-bold mt-1 tabular-nums ${isMinimal ? 'text-[#201B34]' : 'text-purple-400'}`}>
                    {result.details.domain_entropy || 0} bits
                  </div>
                </div>
                <div className={`p-3 rounded-lg border ${isMinimal ? 'bg-[#EFECE3] border-[#E0DBCF]' : 'border-[#231B3A] bg-[#0A0714]'}`}>
                  <div className={`text-[10px] uppercase ${isMinimal ? 'text-[#6B667A]' : 'text-white/40'}`}>Subdomain Depth</div>
                  <div className={`font-bold mt-1 tabular-nums ${isMinimal ? 'text-[#201B34]' : 'text-white'}`}>
                    {result.details.subdomain_depth || 0} levels
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={`p-3 rounded-lg border ${isMinimal ? 'bg-[#EFECE3] border-[#E0DBCF]' : 'border-[#231B3A] bg-[#0A0714]'}`}>
                  <div className={`text-[10px] uppercase ${isMinimal ? 'text-[#6B667A]' : 'text-white/40'}`}>Word Count</div>
                  <div className={`font-bold mt-1 tabular-nums ${isMinimal ? 'text-[#201B34]' : 'text-white'}`}>
                    {result.details.word_count || 0} words
                  </div>
                </div>
                <div className={`p-3 rounded-lg border ${isMinimal ? 'bg-[#EFECE3] border-[#E0DBCF]' : 'border-[#231B3A] bg-[#0A0714]'}`}>
                  <div className={`text-[10px] uppercase ${isMinimal ? 'text-[#6B667A]' : 'text-white/40'}`}>Embedded URLs</div>
                  <div className={`font-bold mt-1 tabular-nums ${isMinimal ? 'text-[#201B34]' : 'text-white'}`}>
                    {result.details.embedded_urls_count || 0} links
                  </div>
                </div>
                <div className={`p-3 rounded-lg border ${isMinimal ? 'bg-[#EFECE3] border-[#E0DBCF]' : 'border-[#231B3A] bg-[#0A0714]'}`}>
                  <div className={`text-[10px] uppercase ${isMinimal ? 'text-[#6B667A]' : 'text-white/40'}`}>Urgency Cues</div>
                  <div className={`font-bold mt-1 tabular-nums ${isMinimal ? 'text-[#201B34]' : 'text-white'}`}>
                    {result.details.urgency_triggers?.length || 0} triggers
                  </div>
                </div>
                <div className={`p-3 rounded-lg border ${isMinimal ? 'bg-[#EFECE3] border-[#E0DBCF]' : 'border-[#231B3A] bg-[#0A0714]'}`}>
                  <div className={`text-[10px] uppercase ${isMinimal ? 'text-[#6B667A]' : 'text-white/40'}`}>Financial Lures</div>
                  <div className={`font-bold mt-1 tabular-nums ${isMinimal ? 'text-[#201B34]' : 'text-white'}`}>
                    {result.details.financial_triggers?.length || 0} triggers
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
