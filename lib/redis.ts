import { kv } from "@vercel/kv";

/**
 * Redis/KV Cache Utility Module
 * Provides helper functions for caching dashboard data using Vercel KV
 * 
 * Supports both KV_URL (Vercel KV) and REDIS_URL (Upstash Redis or other Redis services)
 * Vercel automatically adds REDIS_URL when integrating with Redis services like Upstash
 * 
 * Note: @vercel/kv looks for KV_URL and KV_REST_API_URL by default.
 * If REDIS_URL is provided instead, we map it to KV_URL for compatibility.
 */

// Map REDIS_URL to KV_URL if KV_URL is not set (for Upstash Redis compatibility)
// Vercel automatically adds REDIS_URL when integrating with Redis services
// @vercel/kv looks for KV_URL by default, so we map REDIS_URL to KV_URL if needed
if (process.env.REDIS_URL && !process.env.KV_URL && !process.env.KV_REST_API_URL) {
  // If REDIS_URL is provided but KV_URL is not, map REDIS_URL to KV_URL
  // This allows @vercel/kv to work with REDIS_URL environment variable
  process.env.KV_URL = process.env.REDIS_URL;
}

// Check if Redis is available
const isRedisAvailable = () => {
  return !!(
    process.env.KV_URL ||
    process.env.KV_REST_API_URL ||
    process.env.REDIS_URL
  );
};

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  DASHBOARD_DATA: 300, // 5 minutes
  AI_INSIGHTS: 900, // 15 minutes
  MOTIVATION: 3600, // 1 hour
  ACTIVITY: 120, // 2 minutes
} as const;

/**
 * Get cached data by key
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    // Check if Redis is available
    if (!isRedisAvailable()) {
      console.warn("[Redis] Redis not configured, skipping cache");
      return null;
    }
    
    const data = await kv.get<T>(key);
    return data;
  } catch (error) {
    console.error(`[Redis] Error getting cache for key ${key}:`, error);
    return null;
  }
}

/**
 * Set cached data with TTL
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds?: number
): Promise<boolean> {
  try {
    // Check if Redis is available
    if (!isRedisAvailable()) {
      console.warn("[Redis] Redis not configured, skipping cache");
      return false;
    }
    
    if (ttlSeconds) {
      await kv.set(key, value, { ex: ttlSeconds });
    } else {
      await kv.set(key, value);
    }
    return true;
  } catch (error) {
    console.error(`[Redis] Error setting cache for key ${key}:`, error);
    return false;
  }
}

/**
 * Delete cached data by key
 */
export async function deleteCache(key: string): Promise<boolean> {
  try {
    // Check if Redis is available
    if (!isRedisAvailable()) {
      console.warn("[Redis] Redis not configured, skipping cache deletion");
      return false;
    }
    
    await kv.del(key);
    return true;
  } catch (error) {
    console.error(`[Redis] Error deleting cache for key ${key}:`, error);
    return false;
  }
}

/**
 * Delete multiple cached keys by pattern
 * Note: Vercel KV doesn't support pattern matching directly
 * This function will attempt to delete common activity cache keys for a user
 */
export async function deleteCachePattern(pattern: string): Promise<boolean> {
  try {
    // For activity cache, we'll delete common skip values (0, 10, 20, etc.)
    // This is a workaround since Vercel KV doesn't support pattern matching
    if (pattern.includes("dashboard:activity:")) {
      const userId = pattern.match(/dashboard:activity:([^:]+)/)?.[1];
      const type = pattern.match(/dashboard:activity:[^:]+:([^:]+)/)?.[1];
      
      if (userId && type) {
        // Delete common skip values
        const commonSkips = [0, 10, 20, 30, 40, 50];
        const keysToDelete = commonSkips.map(skip => 
          cacheKeys.activity(userId, type, skip)
        );
        await kv.del(...keysToDelete);
      }
    }
    return true;
  } catch (error) {
    console.error(`[Redis] Error deleting cache pattern ${pattern}:`, error);
    return false;
  }
}

/**
 * Generate cache keys for dashboard data
 */
export const cacheKeys = {
  dashboardData: (userId: string) => `dashboard:data:${userId}`,
  aiInsights: (userId: string) => `dashboard:insights:${userId}`,
  motivation: (userId: string) => `dashboard:motivation:${userId}`,
  activity: (userId: string, type: string, skip: number) =>
    `dashboard:activity:${userId}:${type}:${skip}`,
};

/**
 * Invalidate all dashboard-related cache for a user
 */
export async function invalidateUserDashboardCache(
  userId: string
): Promise<void> {
  try {
    const keys = [
      cacheKeys.dashboardData(userId),
      cacheKeys.aiInsights(userId),
      cacheKeys.motivation(userId),
    ];

    // Delete activity cache pattern
    const activityPattern = `dashboard:activity:${userId}:*`;
    await deleteCachePattern(activityPattern);

    // Delete other keys
    await Promise.all(keys.map((key) => deleteCache(key)));
  } catch (error) {
    console.error(
      `[Redis] Error invalidating dashboard cache for user ${userId}:`,
      error
    );
  }
}

