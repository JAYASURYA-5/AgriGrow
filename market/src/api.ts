import { CommodityData } from './types';

/**
 * Fetch commodity data from configured API.
 * Configure base URL with VITE_API_BASE in your .env (e.g. VITE_API_BASE=https://api.example.com)
 */
export async function fetchCommodityData(commodity: string): Promise<CommodityData> {
  const base = (import.meta.env.VITE_API_BASE ?? '').toString().replace(/\/$/, '');
  if (!base) {
    throw new Error('VITE_API_BASE not configured');
  }

  const url = `${base}/commodities/${encodeURIComponent(commodity.toLowerCase())}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  const json = await res.json();
  return json as CommodityData;
}
