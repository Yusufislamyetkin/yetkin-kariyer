/* eslint-disable no-console */
import { db } from "@/lib/db";

type SeedLive = {
  title: string;
  description?: string;
  difficulty?: string;
  languages: string[];
  starterCode?: Record<string, string> | null;
  tests?: unknown;
  tags?: string[];
  isPublished?: boolean;
};

type SeedBugfix = {
  title: string;
  buggyCode: string;
  fixDescription?: string;
  language: string;
  tests?: unknown;
  tags?: string[];
  isPublished?: boolean;
};

const LIVE_TEMPLATES: SeedLive[] = Array.from({ length: 10 }).map((_, i) => ({
  title: `Live Coding Görevi #${i + 1}`,
  description: "Çeşitli algoritma ve dil özelliklerini uygulayın.",
  difficulty: i < 3 ? "beginner" : i < 7 ? "intermediate" : "advanced",
  languages: ["javascript", "csharp", "python"],
  starterCode: {
    javascript: "// buraya çözümünüzü yazın\nfunction solve(input) {\n  return input;\n}\nconsole.log(solve('hello'));\n",
    csharp: "using System;\nclass Program { static void Main(){ Console.WriteLine(\"hello\"); } }",
    python: "def solve(x):\n    return x\n\nprint(solve('hello'))\n"
  },
  tests: { samples: [{ input: "hello", output: "hello" }] },
  tags: ["seed", "demo"],
  isPublished: true
}));

const BUGFIX_TEMPLATES: SeedBugfix[] = Array.from({ length: 10 }).map((_, i) => ({
  title: `Bugfix Görevi #${i + 1}`,
  buggyCode: "function add(a, b){\n  // BUG: yanlış topluyor\n  return a - b;\n}\nconsole.log(add(2,2));\n",
  fixDescription: "Toplama işlemi için + kullanılmalı.",
  language: "javascript",
  tests: { samples: [{ code: "add(2,2)", expect: 4 }] },
  tags: ["seed", "demo"],
  isPublished: true
}));

export async function seedChallenges() {
  // Live coding upserts
  for (const item of LIVE_TEMPLATES) {
    const existing = await db.liveCodingChallenge.findFirst({
      where: { title: item.title }
    });

    if (existing) {
      await db.liveCodingChallenge.update({
        where: { id: existing.id },
        data: item
      });
    } else {
      await db.liveCodingChallenge.create({ data: item });
    }
  }

  // Bugfix upserts
  for (const item of BUGFIX_TEMPLATES) {
    const existing = await db.bugFixChallenge.findFirst({
      where: { title: item.title }
    });

    if (existing) {
      await db.bugFixChallenge.update({
        where: { id: existing.id },
        data: item
      });
    } else {
      await db.bugFixChallenge.create({ data: item });
    }
  }
}
