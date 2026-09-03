import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, XCircle, Info, Sparkles, AlertOctagon } from 'lucide-react';
import { ScanResult } from '../lib/api';

interface ResultCardProps {
  result: ScanResult;
  type: 'url' | 'email';
}

export default function ResultCard({ result, type }: ResultCardProps) {
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
        title: 'CRITICAL PHISHING THREAT DETECTED',
        desc: 'High probability of malicious intent. Do not interact, input credentials, or proceed with requested actions.',
      }
    : isSuspicious
    ? {
        border: 'border-amber-500/40',
        bg: 'from-amber-500/15 via-amber-500/5 to-transparent',
        text: 'text-amber-400',
        badgeBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
        glow: 'cyber-glow-amber',
        icon: AlertTriangle,
        title: 'SUSPICIOUS ANOMALIES IDENTIFIED',
        desc: 'This item exhibits patterns common in social engineering or spoofing. Exercise caution and verify manually.',
      }
    : {
        border: 'border-emerald-500/40',
        bg: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
        text: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
        glow: 'cyber-glow-emerald',
        icon: ShieldCheck,
        title: 'VERIFIED LEGITIMATE / CLEAN',
        desc: 'No known phishing signatures or deceptive patterns were detected by the machine learning models.',
      };

  const Icon = theme.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-2xl border ${theme.border} bg-[#0b0e17] bg-gradient-to-b ${theme.bg} p-6 backdrop-blur-xl ${theme.glow}`}
    >
      {/* Top Header Verdict */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl border ${theme.border} bg-black/40 ${theme.text}`}>
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full border text-xs font-mono font-bold tracking-wider uppercase ${theme.badgeBg}`}>
                {result.verdict}
              </span>
              <span className="text-xs font-mono text-white/40">
                Confidence: {result.confidence * 100}%
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-white">
              {theme.title}
            </h3>
            <p className="text-xs text-white/60 font-mono mt-1 max-w-xl">
              {theme.desc}
            </p>
          </div>
        </div>

        {/* Risk Score Meter */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
          <span className="text-[11px] font-mono text-white/50 tracking-widest uppercase">
            RISK SCORE
          </span>
          <div className={`text-4xl font-mono font-black ${theme.text}`}>
            {result.risk_score}
            <span className="text-base text-white/30 font-normal">/100</span>
          </div>
          <div className="w-32 h-2 rounded-full bg-white/10 overflow-hidden mt-1 hidden sm:block">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.risk_score}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full ${
                isPhishing ? 'bg-rose-500' : isSuspicious ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Threat Breakdown Flags */}
      <div className="mt-6">
        <h4 className="text-xs font-mono tracking-widest uppercase text-white/50 mb-3 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          EXPLAINABLE AI THREAT ANALYSIS
        </h4>

        {result.threat_flags.length > 0 ? (
          <div className="space-y-2">
            {result.threat_flags.map((flag, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs font-mono text-rose-200"
              >
                <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{flag}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs font-mono text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Passed all lexical, structural, and NLP threat heuristics without anomaly flags.</span>
          </div>
        )}
      </div>

      {/* Technical Feature Details */}
      {result.details && Object.keys(result.details).length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <h4 className="text-xs font-mono tracking-widest uppercase text-white/50 mb-3">
            EXTRACTED TELEMETRY & ATTRIBUTES
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 font-mono text-xs">
            {type === 'url' ? (
              <>
                <div className="p-2.5 rounded-xl border border-white/10 bg-white/5">
                  <div className="text-[10px] text-white/40 uppercase">HTTPS Protocol</div>
                  <div className="text-white font-bold mt-0.5">
                    {result.details.is_https ? 'TLS / Valid' : 'Insecure HTTP'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl border border-white/10 bg-white/5">
                  <div className="text-[10px] text-white/40 uppercase">Direct IP Host</div>
                  <div className="text-white font-bold mt-0.5">
                    {result.details.has_ip_address ? 'YES (High Risk)' : 'NO (Domain Name)'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl border border-white/10 bg-white/5">
                  <div className="text-[10px] text-white/40 uppercase">Domain Entropy</div>
                  <div className="text-white font-bold mt-0.5">
                    {result.details.domain_entropy} bits
                  </div>
                </div>
                <div className="p-2.5 rounded-xl border border-white/10 bg-white/5">
                  <div className="text-[10px] text-white/40 uppercase">URL Length</div>
                  <div className="text-white font-bold mt-0.5">
                    {result.details.url_length} chars
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-2.5 rounded-xl border border-white/10 bg-white/5">
                  <div className="text-[10px] text-white/40 uppercase">Word Count</div>
                  <div className="text-white font-bold mt-0.5">
                    {result.details.word_count || 0} words
                  </div>
                </div>
                <div className="p-2.5 rounded-xl border border-white/10 bg-white/5">
                  <div className="text-[10px] text-white/40 uppercase">Embedded URLs</div>
                  <div className="text-white font-bold mt-0.5">
                    {result.details.embedded_urls_count || 0} links
                  </div>
                </div>
                <div className="p-2.5 rounded-xl border border-white/10 bg-white/5">
                  <div className="text-[10px] text-white/40 uppercase">Urgency Triggers</div>
                  <div className="text-white font-bold mt-0.5">
                    {result.details.urgency_triggers?.length || 0} detected
                  </div>
                </div>
                <div className="p-2.5 rounded-xl border border-white/10 bg-white/5">
                  <div className="text-[10px] text-white/40 uppercase">Financial Lures</div>
                  <div className="text-white font-bold mt-0.5">
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
