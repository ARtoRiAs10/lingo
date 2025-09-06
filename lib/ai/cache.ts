// lib/ai/cache.ts
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function getCachedResponse(key: string) {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

export function setCachedResponse(key: string, data: any) {
  responseCache.set(key, { data, timestamp: Date.now() });
}
