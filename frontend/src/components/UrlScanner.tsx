import React, { useState } from 'react';
import { Globe, ArrowRight, Loader2, Link as LinkIcon, X } from 'lucide-react';
import { scanUrl, ScanResult } from '../lib/api';
import ResultCard from './ResultCard';

interface UrlScannerProps {
  onScanComplete: () => void;
  theme?: 'cyber' | 'minimalist';
}

const SAMPLE_URLS = [
  { label: 'Safe: GitHub Repo', url: 'https://github.com/nyzxis/personal-portfolio' },
  { label: 'Phishing: Fake PayPal IP', url: 'http://192.168.1.105/paypal-login/verify.html' },
  { label: 'Phishing: Apple ID Spoof', url: 'http://secure-appleid-verification-update.xyz/login.php' },
  { label: 'Suspicious: Urgent Banking', url: 'http://chase-online-banking-security-alert.top/signin' },
];

export default function UrlScanner({ onScanComplete, theme = 'cyber' }: UrlScannerProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const isMinimal = theme === 'minimalist';

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
      <div
        className={`transition-all duration-300 ${
          isMinimal
            ? 'rounded-[10px] bg-white border border-[#EAEAEA] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
            : 'rounded-2xl border border-white/10 bg-[#0a0d16]/90 p-5 sm:p-7 backdrop-blur-xl'
        }`}
      >
        <div
          className={`flex items-center gap-2 text-xs font-mono tracking-wider uppercase mb-2 ${
            isMinimal ? 'text-[#787774]' : 'text-cyan-400'
          }`}
        >
          <Globe className="w-4 h-4" />
          TARGET HYPERLINK INSPECTOR
        </div>

        <h2
          className={`text-xl sm:text-2xl font-bold tracking-tight ${
            isMinimal ? 'font-serif-editorial text-[#111111] font-semibold text-2xl sm:text-3xl' : 'font-mono text-white'
          }`}
        >
          Inspect suspicious hyperlinks with Machine Learning
        </h2>

        <p
          className={`text-xs sm:text-sm font-mono mt-1.5 max-w-[65ch] leading-relaxed ${
            isMinimal ? 'text-[#787774]' : 'text-white/50'
          }`}
        >
          Extracts lexical telemetry, structural entropy, numerical IP host indicators, and deceptive social engineering cues.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScan();
          }}
          className="mt-6 flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <div
              className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                isMinimal ? 'text-[#787774]' : 'text-white/30'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/login or http://192.168.1.1/..."
              className={`w-full pl-10 pr-10 py-3 text-sm font-mono transition-all ${
                isMinimal
                  ? 'bg-[#F7F6F3] border border-[#EAEAEA] text-[#111111] placeholder-[#787774]/60 rounded-[6px] focus:outline-none focus:border-[#111111] focus:bg-white'
                  : 'rounded-xl border border-white/15 bg-black/60 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
              }`}
            />
            {url && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className={`absolute inset-y-0 right-0 pr-3.5 flex items-center ${
                  isMinimal ? 'text-[#787774] hover:text-[#111111]' : 'text-white/30 hover:text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-mono font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
              isMinimal
                ? 'rounded-[6px] bg-[#111111] text-white hover:bg-[#2F3437]'
                : 'rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]'
            }`}
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
        <div
          className={`mt-4 pt-4 border-t flex flex-wrap items-center gap-2 text-xs font-mono ${
            isMinimal ? 'border-[#EAEAEA]' : 'border-white/10'
          }`}
        >
          <span className={`text-[11px] ${isMinimal ? 'text-[#787774]' : 'text-white/40'}`}>
            Quick presets:
          </span>
          {SAMPLE_URLS.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setUrl(sample.url);
                handleScan(sample.url);
              }}
              className={`px-2.5 py-1 text-[11px] transition-all active:scale-[0.97] ${
                isMinimal
                  ? 'rounded-[4px] bg-[#F7F6F3] border border-[#EAEAEA] text-[#111111] hover:bg-[#EBEAE5]'
                  : 'rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/40 text-white/70 hover:text-white'
              }`}
            >
              {sample.label}
            </button>
          ))}
        </div>

        {error && (
          <div
            className={`mt-4 p-3 rounded-[6px] text-xs font-mono ${
              isMinimal ? 'bg-[#FDEBEC] border border-[#F8D7DA] text-[#9F2F2D]' : 'border border-rose-500/30 bg-rose-500/10 text-rose-300'
            }`}
          >
            {error}
          </div>
        )}
      </div>

      {result && <ResultCard result={result} type="url" theme={theme} />}
    </div>
  );
}
