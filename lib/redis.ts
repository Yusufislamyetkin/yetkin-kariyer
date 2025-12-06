import { createClient, RedisClientType } from "redis";

/**
 * Redis Cache Utility Module
 * Provides helper functions for caching dashboard data using node-redis
 * 
 * Uses REDIS_URL environment variable for connection (format: redis://... or rediss://... for TLS)
 * Implements singleton pattern for serverless compatibility
 */

// Singleton Redis client instance
let redisClient: RedisClientType | null = null;
let isConnecting = false;
let connectionPromise: Promise<RedisClientType> | null = null;

/**
 * Get or create Redis client instance
 * Uses singleton pattern to reuse connection in serverless environments
 */
async function getRedisClient(): Promise<RedisClientType | null> {
  // Check if Redis URL is configured
  if (!process.env.REDIS_URL) {
    return null;
  }

  // Return existing client if already connected
  if (redisClient?.isOpen) {
    return redisClient;
  }

  // If connection is in progress, wait for it
  if (isConnecting && connectionPromise) {
    await connectionPromise;
    if (redisClient?.isOpen) {
      return redisClient;
    }
  }

  // Create new client and connect
  try {
    isConnecting = true;
    
    // If client exists but is closed, create a new one
    if (redisClient && !redisClient.isOpen) {
      try {
        await redisClient.quit();
      } catch {
        // Ignore errors when quitting closed client
      }
      redisClient = null;
    }

    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    // Handle connection errors
    redisClient.on("error", (err) => {
      console.error("[Redis] Client error:", err);
    });

    connectionPromise = redisClient.connect();
    await connectionPromise;
    isConnecting = false;
    return redisClient;
  } catch (error) {
    isConnecting = false;
    connectionPromise = null;
    redisClient = null;
    console.error("[Redis] Failed to connect:", error);
    return null;
  }
}

// Check if Redis is available
const isRedisAvailable = () => {
  return !!process.env.REDIS_URL;
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

    const client = await getRedisClient();
    if (!client) {
      return null;
    }

    const data = await client.get(key);
    if (!data) {
      return null;
    }

    // Parse JSON data
    try {
      return JSON.parse(data) as T;
    } catch (parseError) {
      // If parsing fails, return as string (for backward compatibility)
      return data as unknown as T;
    }
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

    const client = await getRedisClient();
    if (!client) {
      return false;
    }

    // Serialize value to JSON string
    const serializedValue =
      typeof value === "string" ? value : JSON.stringify(value);

    if (ttlSeconds) {
      await client.setEx(key, ttlSeconds, serializedValue);
    } else {
      await client.set(key, serializedValue);
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

    const client = await getRedisClient();
    if (!client) {
      return false;
    }

    await client.del(key);
    return true;
  } catch (error) {
    console.error(`[Redis] Error deleting cache for key ${key}:`, error);
    return false;
  }
}

/**
 * Delete multiple cached keys by pattern
 * Uses Redis SCAN command for pattern matching
 */
export async function deleteCachePattern(pattern: string): Promise<boolean> {
  try {
    // Check if Redis is available
    if (!isRedisAvailable()) {
      console.warn(
        "[Redis] Redis not configured, skipping cache pattern deletion"
      );
      return false;
    }

    const client = await getRedisClient();
    if (!client) {
      return false;
    }

    // Convert glob pattern to Redis pattern
    // e.g., "dashboard:activity:userId:*" -> "dashboard:activity:userId:*"
    const redisPattern = pattern;

    // Use SCAN to find all matching keys
    const keys: string[] = [];
    let cursor = 0;

    do {
      const result = await client.scan(cursor, {
        MATCH: redisPattern,
        COUNT: 100,
      });
      cursor = result.cursor;
      keys.push(...result.keys);
    } while (cursor !== 0);

    // Delete all matching keys
    if (keys.length > 0) {
      await client.del(keys);
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
