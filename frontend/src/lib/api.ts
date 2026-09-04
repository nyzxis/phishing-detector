import { edgeScanUrl, edgeScanEmail } from './edgeDetector';

const viteApiUrl = (import.meta as any)?.env?.VITE_API_URL;
const API_BASE = viteApiUrl
  ? `${viteApiUrl.replace(/\/$/, '')}/api`
  : '/api';

export interface ScanResult {
  id?: number;
  risk_score: number;
  verdict: 'Safe' | 'Suspicious' | 'Phishing';
  confidence: number;
  threat_flags: string[];
  details: Record<string, any>;
  model_active: boolean;
  created_at?: string;
  source?: 'cloud' | 'edge';
}

export interface StatsResponse {
  total_scans: number;
  phishing_detected: number;
  suspicious_detected: number;
  safe_detected: number;
  threat_rate: number;
  url_scans_count: number;
  email_scans_count: number;
  average_risk_score: number;
}

export interface HistoryItem {
  id: number;
  scan_type: 'url' | 'email';
  target_input: string;
  full_input: string;
  risk_score: number;
  verdict: 'Safe' | 'Suspicious' | 'Phishing';
  confidence: number;
  features: {
    details?: Record<string, any>;
    threat_flags?: string[];
  };
  created_at: string;
}

const LOCAL_STORAGE_HISTORY_KEY = 'phishguard_local_history';

function getLocalHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalHistory(item: HistoryItem) {
  try {
    const current = getLocalHistory();
    const updated = [item, ...current.filter((i) => i.id !== item.id)].slice(0, 50);
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updated));
  } catch {}
}

export async function checkHealth(): Promise<{ status: string; engine: string }> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'online') {
        return { status: 'online', engine: 'CLOUD ML' };
      }
    }
  } catch {}
  return { status: 'edge', engine: 'EDGE HEURISTICS' };
}

export async function scanUrl(url: string): Promise<ScanResult> {
  try {
    const res = await fetch(`${API_BASE}/scan/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.result) {
        return { ...data.result, source: 'cloud' };
      }
    }
  } catch {}

  // Edge client fallback
  const result = edgeScanUrl(url);
  const historyItem: HistoryItem = {
    id: Date.now(),
    scan_type: 'url',
    target_input: url.length > 120 ? url.slice(0, 120) + '...' : url,
    full_input: url,
    risk_score: result.risk_score,
    verdict: result.verdict,
    confidence: result.confidence,
    features: {
      details: result.details,
      threat_flags: result.threat_flags,
    },
    created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
  };
  saveLocalHistory(historyItem);
  return { ...result, source: 'edge', id: historyItem.id, created_at: historyItem.created_at };
}

export async function scanEmail(email_text: string): Promise<ScanResult> {
  try {
    const res = await fetch(`${API_BASE}/scan/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_text }),
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.result) {
        return { ...data.result, source: 'cloud' };
      }
    }
  } catch {}

  // Edge client fallback
  const result = edgeScanEmail(email_text);
  const historyItem: HistoryItem = {
    id: Date.now(),
    scan_type: 'email',
    target_input: email_text.length > 120 ? email_text.slice(0, 120) + '...' : email_text,
    full_input: email_text,
    risk_score: result.risk_score,
    verdict: result.verdict,
    confidence: result.confidence,
    features: {
      details: result.details,
      threat_flags: result.threat_flags,
    },
    created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
  };
  saveLocalHistory(historyItem);
  return { ...result, source: 'edge', id: historyItem.id, created_at: historyItem.created_at };
}

export async function getStats(): Promise<StatsResponse> {
  try {
    const res = await fetch(`${API_BASE}/stats`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.total_scans > 0) return data;
    }
  } catch {}

  // Compute from local history
  const local = getLocalHistory();
  const total = local.length;
  if (total === 0) {
    return {
      total_scans: 0,
      phishing_detected: 0,
      suspicious_detected: 0,
      safe_detected: 0,
      threat_rate: 0,
      url_scans_count: 0,
      email_scans_count: 0,
      average_risk_score: 0,
    };
  }

  const phishing = local.filter((i) => i.verdict === 'Phishing').length;
  const suspicious = local.filter((i) => i.verdict === 'Suspicious').length;
  const safe = local.filter((i) => i.verdict === 'Safe').length;
  const urls = local.filter((i) => i.scan_type === 'url').length;
  const emails = local.filter((i) => i.scan_type === 'email').length;
  const avg = Number((local.reduce((acc, i) => acc + i.risk_score, 0) / total).toFixed(1));
  const threatRate = Number((((phishing + suspicious) / total) * 100).toFixed(1));

  return {
    total_scans: total,
    phishing_detected: phishing,
    suspicious_detected: suspicious,
    safe_detected: safe,
    threat_rate: threatRate,
    url_scans_count: urls,
    email_scans_count: emails,
    average_risk_score: avg,
  };
}

export async function getHistory(type?: 'url' | 'email', q?: string): Promise<HistoryItem[]> {
  try {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (q) params.append('q', q);

    const res = await fetch(`${API_BASE}/history?${params.toString()}`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.history && data.history.length > 0) return data.history;
    }
  } catch {}

  // Fallback to local storage
  let items = getLocalHistory();
  if (type) items = items.filter((i) => i.scan_type === type);
  if (q) items = items.filter((i) => i.target_input.toLowerCase().includes(q.toLowerCase()));
  return items;
}

export async function deleteHistoryItem(id: number): Promise<void> {
  try {
    await fetch(`${API_BASE}/history/${id}`, { method: 'DELETE', signal: AbortSignal.timeout(3000) });
  } catch {}

  const current = getLocalHistory().filter((i) => i.id !== id);
  localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(current));
}

export async function clearAllHistory(): Promise<void> {
  try {
    await fetch(`${API_BASE}/history`, { method: 'DELETE', signal: AbortSignal.timeout(3000) });
  } catch {}

  localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
}
