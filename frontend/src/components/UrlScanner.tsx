import React, { useState } from 'react';
import { Globe, ArrowRight, Loader2, Link as LinkIcon, X } from 'lucide-react';
import { scanUrl, ScanResult } from '../lib/api';
import ResultCard from './ResultCard';

interface UrlScannerProps {
  onScanComplete: () => void;
}

const SAMPLE_URLS = [
  { label: 'Safe: GitHub Repo', url: 'https://github.com/nyzxis/personal-portfolio' },
  { label: 'Phishing: Fake PayPal IP', url: 'http://192.168.1.105/paypal-login/verify.html' },
  { label: 'Phishing: Apple ID Spoof', url: 'http://secure-appleid-verification-update.xyz/login.php' },
  { label: 'Suspicious: Urgent Banking', url: 'http://chase-online-banking-security-alert.top/signin' },
];

export default function UrlScanner({ onScanComplete }: UrlScannerProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = async (targetUrl?: string) => {
    const inputUrl = (targetUrl || url).trim();
    if (!inputUrl) {
      setError('Please provide a URL to inspect.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await scanUrl(inputUrl);
      setResult(data);
      onScanComplete();
    } catch (err: any) {
      setError(err.message || 'Error occurred while scanning URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#0a0d16]/90 p-5 sm:p-7 backdrop-blur-xl transition-all">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-wider uppercase mb-2">
          <Globe className="w-4 h-4" />
          TARGET URL INSPECTOR
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
          Inspect suspicious hyperlinks with Machine Learning
        </h2>
        <p className="text-xs sm:text-sm text-white/50 font-mono mt-1 max-w-[65ch] leading-relaxed">
          Extracts lexical telemetry, structural entropy, numerical IP host indicators, and deceptive social engineering cues.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScan();
          }}
          className="mt-6 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
              <LinkIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/login or http://192.168.1.1/..."
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-white/15 bg-black/60 text-sm font-mono text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
            />
            {url && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/30 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                ANALYZING...
              </>
            ) : (
              <>
                SCAN URL
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Sample Presets */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-white/40 text-[11px]">Quick presets:</span>
          {SAMPLE_URLS.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setUrl(sample.url);
                handleScan(sample.url);
              }}
              className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/40 text-white/70 hover:text-white transition-all text-[11px] active:scale-[0.97]"
            >
              {sample.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-mono">
            {error}
          </div>
        )}
      </div>

      {result && <ResultCard result={result} type="url" />}
    </div>
  );
}
