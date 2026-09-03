import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, FileText } from 'lucide-react';
import { scanEmail, ScanResult } from '../lib/api';
import ResultCard from './ResultCard';

interface EmailScannerProps {
  onScanComplete: () => void;
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

export default function EmailScanner({ onScanComplete }: EmailScannerProps) {
  const [emailText, setEmailText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

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
      <div className="rounded-2xl border border-white/10 bg-[#0a0d16]/80 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-wider uppercase mb-2">
          <Mail className="w-4 h-4" />
          RAW EMAIL & HEADER NLP INSPECTOR
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
          Detect phishing emails using Natural Language Processing
        </h2>
        <p className="text-xs sm:text-sm text-white/50 font-mono mt-1">
          Scans for deceptive urgency hooks, credential harvesting triggers, social engineering, and fraudulent links.
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
              rows={6}
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              placeholder="Paste email subject, body text, or headers here..."
              className="w-full p-4 rounded-xl border border-white/15 bg-black/50 text-sm font-mono text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-y"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(6,182,212,0.4)]"
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
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-white/40">Try sample email templates:</span>
          {SAMPLE_EMAILS.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setEmailText(sample.text);
                handleScan(sample.text);
              }}
              className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all text-[11px]"
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

      {result && <ResultCard result={result} type="email" />}
    </div>
  );
}
