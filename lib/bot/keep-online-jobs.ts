/**
 * Memory-based job storage for keeping bots online
 * Lightweight, performant, and auto-cleans expired jobs
 */

interface KeepOnlineJob {
  jobId: string;
  userIds: Set<string>;
  startTime: Date;
  endTime: Date;
  lastUpdateTime: Date; // For throttling
}

// In-memory storage for active jobs
const activeJobs = new Map<string, KeepOnlineJob>();

// Throttling: Minimum time between updates (30 seconds)
const UPDATE_THROTTLE_MS = 30 * 1000;

/**
 * Generate unique job ID
 */
function generateJobId(): string {
  return `keep-online-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Start a new keep-online job
 */
export function startKeepOnlineJob(
  userIds: string[],
  durationHours: number
): { jobId: string; endTime: Date } {
  // Validate duration (1-24 hours)
  const hours = Math.max(1, Math.min(24, durationHours));
  
  const jobId = generateJobId();
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + hours * 60 * 60 * 1000);

  const job: KeepOnlineJob = {
    jobId,
    userIds: new Set(userIds),
    startTime,
    endTime,
    lastUpdateTime: new Date(0), // Initialize to allow first update
  };

  activeJobs.set(jobId, job);

  return { jobId, endTime };
}

/**
 * Stop a keep-online job
 */
export function stopKeepOnlineJob(jobId: string): boolean {
  return activeJobs.delete(jobId);
}

/**
 * Stop all jobs for specific user IDs
 */
export function stopJobsForUsers(userIds: string[]): number {
  const userIdSet = new Set(userIds);
  let stopped = 0;

  for (const [jobId, job] of activeJobs.entries()) {
    // Check if any of the user IDs are in this job
    const hasUser = Array.from(job.userIds).some((id) => userIdSet.has(id));
    if (hasUser) {
      activeJobs.delete(jobId);
      stopped++;
    }
  }

  return stopped;
}

/**
 * Get all active jobs
 */
export function getActiveJobs(): Array<{
  jobId: string;
  userIds: string[];
  startTime: Date;
  endTime: Date;
  remainingHours: number;
}> {
  const now = new Date();
  const jobs: Array<{
    jobId: string;
    userIds: string[];
    startTime: Date;
    endTime: Date;
    remainingHours: number;
  }> = [];

  for (const job of activeJobs.values()) {
    // Auto-cleanup expired jobs
    if (now >= job.endTime) {
      activeJobs.delete(job.jobId);
      continue;
    }

    const remainingMs = job.endTime.getTime() - now.getTime();
    const remainingHours = remainingMs / (1000 * 60 * 60);

    jobs.push({
      jobId: job.jobId,
      userIds: Array.from(job.userIds),
      startTime: job.startTime,
      endTime: job.endTime,
      remainingHours: Math.max(0, remainingHours),
    });
  }

  return jobs;
}

/**
 * Get user IDs that should be kept online for a specific group
 * Returns empty array if throttling is active
 */
export function getBotsToUpdateForGroup(
  groupId: string,
  allGroupMemberIds: string[]
): { userIds: string[]; shouldUpdate: boolean } {
  const now = new Date();
  const userIdsToUpdate: string[] = [];

  // Cleanup expired jobs first
  for (const [jobId, job] of activeJobs.entries()) {
    if (now >= job.endTime) {
      activeJobs.delete(jobId);
      continue;
    }

    // Check throttling (30 seconds)
    const timeSinceLastUpdate = now.getTime() - job.lastUpdateTime.getTime();
    if (timeSinceLastUpdate < UPDATE_THROTTLE_MS) {
      // Throttling active, skip this update
      return { userIds: [], shouldUpdate: false };
    }

    // Find bots in this job that are also members of this group
    for (const userId of job.userIds) {
      if (allGroupMemberIds.includes(userId)) {
        userIdsToUpdate.push(userId);
      }
    }

    // Update last update time
    job.lastUpdateTime = now;
  }

  return {
    userIds: [...new Set(userIdsToUpdate)], // Remove duplicates
    shouldUpdate: userIdsToUpdate.length > 0,
  };
}

/**
 * Get all user IDs that should be kept online (across all groups)
 * Used for batch updates
 */
export function getAllBotsToKeepOnline(): string[] {
  const now = new Date();
  const userIds = new Set<string>();

  // Cleanup expired jobs first
  for (const [jobId, job] of activeJobs.entries()) {
    if (now >= job.endTime) {
      activeJobs.delete(jobId);
      continue;
    }

    // Add all user IDs from active jobs
    for (const userId of job.userIds) {
      userIds.add(userId);
    }
  }

  return Array.from(userIds);
}

/**
 * Check if a specific user should be kept online
 */
export function shouldKeepUserOnline(userId: string): boolean {
  const now = new Date();

  for (const job of activeJobs.values()) {
    if (now >= job.endTime) {
      activeJobs.delete(job.jobId);
      continue;
    }

    if (job.userIds.has(userId)) {
      return true;
    }
  }

  return false;
}

/**
 * Cleanup all expired jobs (called periodically)
 */
export function cleanupExpiredJobs(): number {
  const now = new Date();
  let cleaned = 0;

  for (const [jobId, job] of activeJobs.entries()) {
    if (now >= job.endTime) {
      activeJobs.delete(jobId);
      cleaned++;
    }
  }

  return cleaned;
}

/**
 * Get job statistics
 */
export function getJobStats(): {
  totalJobs: number;
  totalBots: number;
  expiredJobs: number;
} {
  const now = new Date();
  let totalBots = 0;
  let expiredJobs = 0;

  for (const job of activeJobs.values()) {
    if (now >= job.endTime) {
      expiredJobs++;
    } else {
      totalBots += job.userIds.size;
    }
  }

  return {
    totalJobs: activeJobs.size,
    totalBots,
    expiredJobs,
  };
}

