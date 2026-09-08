import React, { useState } from 'react';
import { Globe, ArrowRight, Loader2, Link as LinkIcon, X, Eye, Sparkles } from 'lucide-react';
import { scanUrl, ScanResult } from '../lib/api';
import ResultCard from './ResultCard';

interface UrlScannerProps {
  onScanComplete: () => void;
  theme?: 'cyber' | 'minimalist';
}

const SAMPLE_URLS = [
  { label: 'Safe: GitHub Repo', url: 'https://github.com/nyzxis/personal-portfolio', tag: 'BENIGN' },
  { label: 'Phishing: Fake PayPal IP', url: 'http://192.168.1.105/paypal-login/verify.html', tag: 'IP-HOST' },
  { label: 'Phishing: Apple ID Spoof', url: 'http://secure-appleid-verification-update.xyz/login.php', tag: 'HOMOGLYPH' },
  { label: 'Suspicious: Urgent Banking', url: 'http://chase-online-banking-security-alert.top/signin', tag: 'URGENT' },
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
        className={`p-6 sm:p-8 transition-all duration-300 rounded-xl ${
          isMinimal
            ? 'minimalist-card'
            : 'optical-panel'
        }`}
      >
        <div
          className={`flex items-center gap-2 text-xs font-mono tracking-wider uppercase mb-2 ${
            isMinimal ? 'text-[#6B667A]' : 'text-purple-400'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>OPTICAL HYPERLENS // TARGET URL TELESCOPE</span>
        </div>

        <h2
          className={`text-xl sm:text-2xl font-bold tracking-tight ${
            isMinimal ? 'font-sans-clean text-[#201B34]' : 'font-mono text-white'
          }`}
        >
          Spectrographic URL &amp; Hyperlink Classifier
        </h2>

        <p
          className={`text-xs sm:text-sm font-mono mt-1.5 max-w-[70ch] leading-relaxed ${
            isMinimal ? 'text-[#6B667A]' : 'text-white/60'
          }`}
        >
          Scans lexical entropy, suspicious top-level domains (.xyz, .top), raw IP hosts, homoglyphs, and embedded phishing heuristics.
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
                isMinimal ? 'text-[#6B667A]' : 'text-purple-400/60'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste suspicious target URL e.g. http://192.168.1.105/login..."
              className={`w-full pl-10 pr-10 py-3.5 text-sm font-mono transition-all rounded-lg ${
                isMinimal
                  ? 'bg-[#EFECE3] border border-[#E0DBCF] text-[#201B34] placeholder-[#6B667A]/60 focus:outline-none focus:border-[#201B34]'
                  : 'bg-[#06040C] border border-[#231B3A] text-white placeholder-white/30 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_24px_rgba(139,92,246,0.25)]'
              }`}
            />
            {url && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className={`absolute inset-y-0 right-0 pr-3.5 flex items-center ${
                  isMinimal ? 'text-[#6B667A] hover:text-[#201B34]' : 'text-white/40 hover:text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
              isMinimal
                ? 'bg-[#201B34] text-[#FAF8F2] hover:bg-[#322A50]'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.35)]'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>INSPECTING...</span>
              </>
            ) : (
              <>
                <span>ENGAGE TELESCOPE</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Error Notice */}
        {error && (
          <div
            className={`mt-4 p-3 rounded-lg text-xs font-mono border ${
              isMinimal
                ? 'bg-[#FDEBEC] border-[#F8D7DA] text-[#9F2F2D]'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {error}
          </div>
        )}

        {/* Benchmark Sample Targets */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className={`text-xs font-mono mr-1 ${isMinimal ? 'text-[#6B667A]' : 'text-white/40'}`}>
            Test Targets:
          </span>
          {SAMPLE_URLS.map((sample) => (
            <button
              key={sample.url}
              type="button"
              onClick={() => {
                setUrl(sample.url);
                handleScan(sample.url);
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 ${
                isMinimal
                  ? 'bg-[#EFECE3] border border-[#E0DBCF] text-[#201B34] hover:border-[#201B34]'
                  : 'bg-[#120D22] border border-[#231B3A] text-white/70 hover:text-white hover:border-purple-500/40'
              }`}
            >
              <span>{sample.label}</span>
              <span className={`text-[9px] px-1 py-0.2 rounded ${
                isMinimal ? 'bg-[#E5E0D5] text-[#201B34]' : 'bg-white/5 text-purple-300 border border-purple-500/20'
              }`}>
                {sample.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Forensic Verdict Result Card */}
      {result && <ResultCard result={result} type="url" theme={theme} />}
    </div>
  );
}
