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

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function scanUrl(url: string): Promise<ScanResult> {
  const res = await fetch(`${API_BASE}/scan/url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to scan URL');
  }
  const data = await res.json();
  return data.result;
}

export async function scanEmail(email_text: string): Promise<ScanResult> {
  const res = await fetch(`${API_BASE}/scan/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email_text }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to scan Email');
  }
  const data = await res.json();
  return data.result;
}

export async function getStats(): Promise<StatsResponse> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch statistics');
  return res.json();
}

export async function getHistory(type?: 'url' | 'email', q?: string): Promise<HistoryItem[]> {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (q) params.append('q', q);

  const res = await fetch(`${API_BASE}/history?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch history');
  const data = await res.json();
  return data.history;
}

export async function deleteHistoryItem(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/history/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete item');
}

export async function clearAllHistory(): Promise<void> {
  const res = await fetch(`${API_BASE}/history`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to clear history');
}
