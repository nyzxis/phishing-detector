import { ScanResult, StatsResponse, HistoryItem } from './api';

const SUSPICIOUS_TLDS: Set<string> = new Set([
  '.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.gq', '.work',
  '.click', '.buzz', '.fit', '.rest', '.monster', '.country', '.kim'
]);

const SECURITY_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'secure', 'security',
  'account', 'update', 'banking', 'bank', 'paypal', 'appleid',
  'wallet', 'password', 'recover', 'authenticate', 'confirm', 'billing',
  'suspended', 'unusual', 'auth', 'credential', 'crypto'
];

const URGENCY_WORDS = [
  'immediate', 'urgent', 'within 24 hours', 'account suspended',
  'action required', 'unauthorized login', 'final notice', 'security alert',
  'deactivated', 'freeze your account'
];

const FINANCIAL_WORDS = [
  'bank', 'wire transfer', 'payment declined', 'invoice attached',
  'refund of', 'bitcoin', 'crypto', 'wallet address', 'payroll', 'tax refund'
];

const CREDENTIAL_WORDS = [
  'verify your password', 'reset your password', 'click here to login',
  'update your credentials', 'confirm your identity', 'sign in below', 'validate your account'
];

function calculateEntropy(text: string): number {
  if (!text) return 0;
  const map: Record<string, number> = {};
  for (const c of text) {
    map[c] = (map[c] || 0) + 1;
  }
  let entropy = 0;
  const len = text.length;
  for (const k in map) {
    const p = map[k] / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(2));
}

export function edgeScanUrl(rawUrl: string): ScanResult {
  const url = rawUrl.trim();
  let hostname = '';
  let isHttps = false;

  try {
    const parsed = new URL(url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`);
    hostname = parsed.hostname;
    isHttps = parsed.protocol === 'https:';
  } catch {
    hostname = url.split('/')[0];
  }

  const hasIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  const entropy = calculateEntropy(hostname);
  const hyphenCount = (hostname.match(/-/g) || []).length;
  const subdomains = hostname.split('.');
  const subdomainDepth = Math.max(0, subdomains.length - 2);

  const tld = '.' + (subdomains[subdomains.length - 1] || '').toLowerCase();
  const isSuspiciousTld = SUSPICIOUS_TLDS.has(tld);

  const lower = url.toLowerCase();
  const matchedKeywords = SECURITY_KEYWORDS.filter((kw) => lower.includes(kw));

  let score = 0;
  const flags: string[] = [];

  if (hasIp) {
    score += 40;
    flags.push('Direct numerical IP host used instead of legitimate domain');
  }
  if (!isHttps) {
    score += 20;
    flags.push('Insecure cleartext HTTP protocol without SSL/TLS encryption');
  }
  if (url.length > 70) {
    score += 15;
    flags.push('Excessively long URL (>70 chars), often used for link obfuscation');
  }
  if (hyphenCount >= 2) {
    score += 20;
    flags.push(`Multiple hyphens (${hyphenCount}) in domain used for brand spoofing`);
  }
  if (subdomainDepth >= 2) {
    score += 15;
    flags.push(`Deep subdomain nesting (${subdomainDepth} levels) masking authentic host`);
  }
  if (isSuspiciousTld) {
    score += 25;
    flags.push(`High-risk Top-Level Domain detected (${tld})`);
  }
  if (matchedKeywords.length > 0) {
    score += Math.min(45, matchedKeywords.length * 15);
    flags.push(`Credential lure keywords detected: ${matchedKeywords.join(', ')}`);
  }
  if (entropy > 3.7) {
    score += 20;
    flags.push(`High domain randomness (${entropy} bits) indicating algorithmic generation`);
  }

  score = Math.min(100, Math.max(0, score));

  const verdict: 'Safe' | 'Suspicious' | 'Phishing' =
    score >= 60 ? 'Phishing' : score >= 30 ? 'Suspicious' : 'Safe';

  const confidence = Number((0.85 + (score > 50 ? score / 1000 : 0.05)).toFixed(2));

  return {
    risk_score: score,
    verdict,
    confidence,
    threat_flags: flags,
    details: {
      hostname,
      is_https: isHttps,
      has_ip_address: hasIp,
      url_length: url.length,
      domain_length: hostname.length,
      hyphen_count: hyphenCount,
      subdomain_depth: subdomainDepth,
      suspicious_tld: isSuspiciousTld ? tld : null,
      keywords_found: matchedKeywords,
      domain_entropy: entropy,
    },
    model_active: true,
  };
}

export function edgeScanEmail(rawText: string): ScanResult {
  const text = rawText.trim();
  const lower = text.toLowerCase();

  const matchedUrgency = URGENCY_WORDS.filter((w) => lower.includes(w));
  const matchedFinancial = FINANCIAL_WORDS.filter((w) => lower.includes(w));
  const matchedCredentials = CREDENTIAL_WORDS.filter((w) => lower.includes(w));

  const urlPattern = /https?:\/\/[^\s<>"]+|www\.[^\s<>"]+/g;
  const embeddedUrls = text.match(urlPattern) || [];
  const suspiciousUrls = embeddedUrls.filter(
    (u: string) => /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(u) || [...SUSPICIOUS_TLDS].some((tld: string) => u.includes(tld))
  );

  let score = 0;
  const flags: string[] = [];

  if (matchedCredentials.length > 0) {
    score += 40;
    flags.push(`Credential harvesting language detected: ${matchedCredentials.join(', ')}`);
  }
  if (matchedUrgency.length > 0) {
    score += 30;
    flags.push(`Coercive urgency & pressure hooks: ${matchedUrgency.join(', ')}`);
  }
  if (matchedFinancial.length > 0) {
    score += 25;
    flags.push(`Financial transaction baiting triggers: ${matchedFinancial.join(', ')}`);
  }
  if (suspiciousUrls.length > 0) {
    score += 35;
    flags.push(`Suspicious unverified URLs detected in message body (${suspiciousUrls.length} found)`);
  } else if (embeddedUrls.length > 2) {
    score += 15;
    flags.push(`Multiple external hyperlinks embedded (${embeddedUrls.length} links)`);
  }

  score = Math.min(100, Math.max(0, score));

  const verdict: 'Safe' | 'Suspicious' | 'Phishing' =
    score >= 60 ? 'Phishing' : score >= 30 ? 'Suspicious' : 'Safe';

  const confidence = Number((0.88 + (score > 50 ? score / 1000 : 0.05)).toFixed(2));

  return {
    risk_score: score,
    verdict,
    confidence,
    threat_flags: flags,
    details: {
      urgency_triggers: matchedUrgency,
      financial_triggers: matchedFinancial,
      credential_triggers: matchedCredentials,
      embedded_urls_count: embeddedUrls.length,
      suspicious_urls: suspiciousUrls,
      word_count: text.split(/\s+/).filter(Boolean).length,
      character_count: text.length,
    },
    model_active: true,
  };
}
