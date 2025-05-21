// src/lib/search/cache.ts

import type { SearchAPIResponse } from './types'

const CACHE_PREFIX = 'search:'
const DEFAULT_TTL_MS = 15 * 60 * 1000 // 15 minutes

interface CachedItem {
  data: SearchAPIResponse
  expiry: number
  cachedAt: number
}

export const getCachedSearch = (key: string): SearchAPIResponse | null => {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null

    const parsed: CachedItem = JSON.parse(raw)
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(CACHE_PREFIX + key)
      return null
    }

    return parsed.data
  } catch {
    return null
  }
}

export const setCachedSearch = (key: string, data: SearchAPIResponse, ttl = DEFAULT_TTL_MS) => {
  // Don't cache empty or invalid results
  if (!data || !Array.isArray(data.results) || data.results.length === 0) return

  const item: CachedItem = {
    data,
    expiry: Date.now() + ttl,
    cachedAt: Date.now(),
  }

  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item))
  } catch (error) {
    // Try to free up space by deleting the oldest cached item
    evictOldestCacheEntry()
    try {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item))
    } catch {
      // Still failed, log the error
      console.error('Failed to cache search results:', error)
    }
  }
}

const evictOldestCacheEntry = () => {
  let oldestKey: string | null = null
  let oldestTime = Infinity

  for (let i = 0; i < localStorage.length; i++) {
    const fullKey = localStorage.key(i)
    if (!fullKey || !fullKey.startsWith(CACHE_PREFIX)) continue

    try {
      const raw = localStorage.getItem(fullKey)
      if (!raw) continue

      const parsed: CachedItem = JSON.parse(raw)
      if (parsed.cachedAt < oldestTime) {
        oldestTime = parsed.cachedAt
        oldestKey = fullKey
      }
    } catch {
      continue // Skip malformed entries
    }
  }

  if (oldestKey) {
    localStorage.removeItem(oldestKey)
  }
}
