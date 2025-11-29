/**
 * Test script for bot activities
 * Usage: npx tsx scripts/test-bot-activity.ts <botUserId> <activityType>
 */

import { executeBotActivity } from "../lib/bot/activity-executor";
import { BotActivityType } from "@prisma/client";

const activityTypes: BotActivityType[] = [
  "POST",
  "COMMENT",
  "LIKE",
  "TEST",
  "LIVE_CODING",
  "BUG_FIX",
  "LESSON",
  "CHAT",
];

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error("Usage: npx tsx scripts/test-bot-activity.ts <botUserId> <activityType>");
    console.error("\nAvailable activity types:");
    activityTypes.forEach((type) => console.error(`  - ${type}`));
    process.exit(1);
  }

  const [userId, activityType] = args;

  if (!activityTypes.includes(activityType as BotActivityType)) {
    console.error(`Invalid activity type: ${activityType}`);
    console.error("Available types:", activityTypes.join(", "));
    process.exit(1);
  }

  console.log(`Testing bot activity: ${activityType} for user ${userId}`);
  console.log("---");

  try {
    const result = await executeBotActivity(
      userId,
      activityType as BotActivityType,
      {}
    );

    if (result.success) {
      console.log("✅ Activity executed successfully!");
      console.log(`   Activity ID: ${result.activityId}`);
    } else {
      console.error("❌ Activity failed:");
      console.error(`   Error: ${result.error}`);
      process.exit(1);
    }
  } catch (error: any) {
    console.error("❌ Error executing activity:");
    console.error(error.message);
    process.exit(1);
  }
}

main();

