import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, X } from 'lucide-react';
import { scanEmail, ScanResult } from '../lib/api';
import ResultCard from './ResultCard';

interface EmailScannerProps {
  onScanComplete: () => void;
  theme?: 'cyber' | 'minimalist';
}

const SAMPLE_EMAILS = [
  {
    label: 'Safe: Team Meeting',
    text: 'Hi Arfa, just confirming our project code review session tomorrow at 2:00 PM. We will go through the pull request for the new authentication module. Let me know if you need anything beforehand.',
  },
  {
    label: 'Phishing: Fake PayPal Lock',
    text: 'URGENT NOTICE: Your PayPal account has been temporarily restricted due to unauthorized login attempts. You must confirm your identity and verify your password within 24 hours at http://192.168.1.105/paypal/login or your account will be permanently deactivated.',
  },
  {
    label: 'Phishing: CEO Wire Request',
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
          <Mail className="w-4 h-4" />
          RAW EMAIL &amp; HEADER NLP INSPECTOR
        </div>

        <h2
          className={`text-xl sm:text-2xl font-bold tracking-tight ${
            isMinimal ? 'font-serif-editorial text-[#111111] font-semibold text-2xl sm:text-3xl' : 'font-mono text-white'
          }`}
        >
          Detect phishing emails using Natural Language Processing
        </h2>

        <p
          className={`text-xs sm:text-sm font-mono mt-1.5 max-w-[65ch] leading-relaxed ${
            isMinimal ? 'text-[#787774]' : 'text-white/50'
          }`}
        >
          Scans for deceptive urgency hooks, credential harvesting triggers, social engineering, and fraudulent embedded links.
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
              placeholder="Paste email subject, body text, or headers here..."
              className={`w-full p-4 text-sm font-mono transition-all resize-y ${
                isMinimal
                  ? 'bg-[#F7F6F3] border border-[#EAEAEA] text-[#111111] placeholder-[#787774]/60 rounded-[6px] focus:outline-none focus:border-[#111111] focus:bg-white'
                  : 'rounded-xl border border-white/15 bg-black/60 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
              }`}
            />
            {emailText && (
              <button
                type="button"
                onClick={() => setEmailText('')}
                className={`absolute top-3 right-3 p-1 rounded-lg ${
                  isMinimal ? 'text-[#787774] hover:text-[#111111]' : 'text-white/30 hover:text-white hover:bg-white/10'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex justify-end">
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
                  ANALYZING TEXT...
                </>
              ) : (
                <>
                  SCAN EMAIL
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
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
          {SAMPLE_EMAILS.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setEmailText(sample.text);
                handleScan(sample.text);
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

      {result && <ResultCard result={result} type="email" theme={theme} />}
    </div>
  );
}
