import { strict as assert } from "node:assert";
import * as crypto from "node:crypto";
import test from "node:test";

import { generateUniqueGroupInviteCode } from "@/lib/chat/invite";

test("generateUniqueGroupInviteCode returns uppercase alphanumeric code", async () => {
  const code = await generateUniqueGroupInviteCode({
    chatGroup: {
      findFirst: async () => null,
    },
  } as any);

  assert.equal(code.length, 10);
  assert.match(code, /^[A-Z0-9]+$/);
});

test("generateUniqueGroupInviteCode retries when collisions occur", async (t) => {
  let callCount = 0;

  t.mock.method(crypto, "randomUUID", () => {
    callCount += 1;
    return callCount === 1
      ? "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      : "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
  });

  const prismaMock = {
    chatGroup: {
      findFirst: async ({ where }: { where: { inviteCode: string } }) => {
        if (where.inviteCode === "AAAAAAAAAA") {
          return { id: "existing" };
        }
        return null;
      },
    },
  };

  const code = await generateUniqueGroupInviteCode(prismaMock as any);
  assert.equal(code, "BBBBBBBBBB");
});


