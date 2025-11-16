import { db } from "@/lib/db";

export async function getOrCreateAssistantThread(userId: string) {
  let record = await db.assistantThread.findUnique({
    where: { userId },
  });

  if (!record) {
    const thread = await createEmptyRemoteThread();
    record = await db.assistantThread.create({
      data: {
        userId,
        threadId: thread.id,
      },
    });
  }

  return record.threadId;
}

async function createEmptyRemoteThread() {
  const mod = await import("./assistants");
  const client = mod.ensureAssistantClient();
  return client.beta.threads.create();
}


