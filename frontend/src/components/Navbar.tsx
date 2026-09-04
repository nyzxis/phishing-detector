import React from 'react';
import { ShieldAlert, Github, Activity, Terminal } from 'lucide-react';

interface NavbarProps {
  systemOnline: boolean;
  engineName: string;
}

export default function Navbar({ systemOnline, engineName }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#06080e]/85 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-sky-500/10 to-transparent border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.25)] group-hover:border-cyan-400/60 transition-all duration-300">
              <ShieldAlert className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-[#06080e] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-sm sm:text-base text-white font-mono">
                PHISHGUARD
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 tracking-wider">
                v1.2 AI
              </span>
            </div>
            <p className="text-[11px] text-white/40 tracking-wider font-mono">
              REAL-TIME THREAT &amp; NLP TELEMETRY
            </p>
          </div>
        </div>

        {/* Engine Status & GitHub */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${systemOnline ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400 animate-pulse'}`} />
            <span className="text-white/70 text-[11px] uppercase tracking-wider">
              {engineName}
            </span>
          </div>

          <a
            href="https://github.com/nyzxis/phishing-detector"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-cyan-500/40 text-white/80 hover:text-white text-xs font-mono transition-all duration-200 active:scale-[0.98]"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">nyzxis</span>
          </a>
        </div>
      </div>
    </header>
  );
}
