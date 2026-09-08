import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, X, Sparkles, MessageSquare } from 'lucide-react';
import { scanEmail, ScanResult } from '../lib/api';
import ResultCard from './ResultCard';

interface EmailScannerProps {
  onScanComplete: () => void;
  theme?: 'cyber' | 'minimalist';
}

const SAMPLE_EMAILS = [
  {
    label: 'Safe: Team Meeting',
    tag: 'BENIGN',
    text: 'Hi Arfa, just confirming our project code review session tomorrow at 2:00 PM. We will go through the pull request for the new authentication module. Let me know if you need anything beforehand.',
  },
  {
    label: 'Phishing: Fake PayPal Lock',
    tag: 'CREDENTIAL-HARVEST',
    text: 'URGENT NOTICE: Your PayPal account has been temporarily restricted due to unauthorized login attempts. You must confirm your identity and verify your password within 24 hours at http://192.168.1.105/paypal/login or your account will be permanently deactivated.',
  },
  {
    label: 'Phishing: CEO Wire Request',
    tag: 'BEC-FRAUD',
    text: 'Hey Arfa, I am currently stuck in an executive meeting and need you to urgently process an emergency wire transfer of $18,500 to a new client vendor. Send me confirmation once processed.',
  },
];

export default function EmailScanner({ onScanComplete, theme = 'cyber' }: EmailScannerProps) {
  const [emailText, setEmailText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const isMinimal = theme === 'minimalist';

  const handleScan = async (sampleText?: string) => {
    const textToScan = (sampleText || emailText).trim();
    if (!textToScan) {
      setError('Please paste the email content to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await scanEmail(textToScan);
      setResult(data);
      onScanComplete();
    } catch (err: any) {
      setError(err.message || 'Error occurred while scanning email.');
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
          <MessageSquare className="w-4 h-4" />
          <span>DEEP NLP OPTICAL PARSER // SEMANTIC INTENT CLASSIFIER</span>
        </div>

        <h2
          className={`text-xl sm:text-2xl font-bold tracking-tight ${
            isMinimal ? 'font-sans-clean text-[#201B34]' : 'font-mono text-white'
          }`}
        >
          Inspect Phishing Emails with Natural Language Inference
        </h2>

        <p
          className={`text-xs sm:text-sm font-mono mt-1.5 max-w-[70ch] leading-relaxed ${
            isMinimal ? 'text-[#6B667A]' : 'text-white/60'
          }`}
        >
          Detects psychological urgency coercion, false authority claims, deceptive financial requests, and spoofed verification workflows.
        </p>

        {/* Text Area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScan();
          }}
          className="mt-6 space-y-3"
        >
          <div className="relative">
            <textarea
              rows={5}
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              placeholder="Paste email headers and body text here for NLP tokenization & vector analysis..."
              className={`w-full p-4 font-mono text-xs sm:text-sm rounded-lg transition-all ${
                isMinimal
                  ? 'bg-[#EFECE3] border border-[#E0DBCF] text-[#201B34] placeholder-[#6B667A]/60 focus:outline-none focus:border-[#201B34]'
                  : 'bg-[#06040C] border border-[#231B3A] text-white placeholder-white/30 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_24px_rgba(139,92,246,0.25)]'
              }`}
            />
            {emailText && (
              <button
                type="button"
                onClick={() => setEmailText('')}
                className={`absolute top-3 right-3 p-1.5 rounded ${
                  isMinimal ? 'text-[#6B667A] hover:text-[#201B34]' : 'text-white/40 hover:text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className={`text-xs font-mono tabular-nums ${isMinimal ? 'text-[#6B667A]' : 'text-white/40'}`}>
              {emailText.length} characters • {emailText.split(/\s+/).filter(Boolean).length} tokens
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                isMinimal
                  ? 'bg-[#201B34] text-[#FAF8F2] hover:bg-[#322A50]'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.35)]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>PARSING NLP TOKENS...</span>
                </>
              ) : (
                <>
                  <span>ANALYZE SEMANTIC INTENT</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
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

        {/* Benchmark Sample Emails */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className={`text-xs font-mono mr-1 ${isMinimal ? 'text-[#6B667A]' : 'text-white/40'}`}>
            Test Samples:
          </span>
          {SAMPLE_EMAILS.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => {
                setEmailText(sample.text);
                handleScan(sample.text);
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
      {result && <ResultCard result={result} type="email" theme={theme} />}
    </div>
  );
}
