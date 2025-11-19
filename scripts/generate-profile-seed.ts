import fs from "fs";
import path from "path";

type UserSeed = {
  id: string;
  email: string;
  password: string | null;
  name: string;
  role: "candidate" | "employer" | "admin";
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
};

type UserBadgeSeed = {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
  isDisplayed: boolean;
  featuredOrder?: number | null;
};

type QuizAttemptSeed = {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  answers: Record<string, unknown>;
  aiAnalysis?: Record<string, unknown> | null;
  duration?: number | null;
  topic?: string | null;
  level?: string | null;
  completedAt: string;
};

type GenericAttemptSeed = {
  id: string;
  userId: string;
  quizId: string;
  metrics: Record<string, unknown>;
  aiAnalysis?: Record<string, unknown> | null;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
};

type HackatonAttemptSeed = GenericAttemptSeed & {
  hackathonId?: string | null;
  projectUrl?: string | null;
};

type UserBalanceSeed = {
  userId: string;
  points: number;
  lifetimeXp: number;
  level: number;
};

type UserStreakSeed = {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  totalDaysActive: number;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

function pickRand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysAgo(numDays: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - numDays);
  return d;
}

function randomDateBetween(start: Date, end: Date): Date {
  const startMs = start.getTime();
  const endMs = end.getTime();
  const rand = startMs + Math.random() * (endMs - startMs);
  return new Date(rand);
}

function readAllProfileImages(baseDir: string): string[] {
  const entries: string[] = [];
  const subdirs = ["Man", "Woman"];
  for (const sub of subdirs) {
    const dir = path.join(baseDir, sub);
    if (fs.existsSync(dir)) {
      for (const file of fs.readdirSync(dir)) {
        if (/\.(png|jpg|jpeg|webp)$/i.test(file)) {
          entries.push(path.join(sub, file));
        }
      }
    }
  }
  return entries.sort();
}

function main() {
  const projectRoot = path.join(__dirname, "..");
  const photosBase = path.join(projectRoot, "Photos", "ProfilePhotos");
  const outputDir = path.join(projectRoot, "data", "seed-data");
  const outputFile = path.join(outputDir, "seed-data-for-profile.json");

  ensureDir(outputDir);

  const images = readAllProfileImages(photosBase);
  if (images.length === 0) {
    throw new Error("No profile images found in Photos/ProfilePhotos");
  }

  const femaleFirstNames = [
    "Ayşe","Zeynep","Elif","Fatma","Merve","Seda","Derya","Gizem","Büşra","Sibel",
    "Ece","Pelin","Hande","Sevgi","İrem","Tuğçe","Aslı","Nisan","Melis","Cansu",
    "Naz","Yasemin","Kübra","Nil","Gül","Sena","Esra","Hale","Selin","Gonca"
  ];
  const maleFirstNames = [
    "Mehmet","Ahmet","Mustafa","Hüseyin","Emre","Burak","Cem","Can","Ozan","Eren",
    "Deniz","Hakan","Onur","Tolga","Yasin","Kerem","Umut","Murat","Gökhan","Kaan",
    "Baran","Bora","Halil","Suat","Serkan","Berk","Mert","Kadir","Furkan","Çağrı"
  ];
  const lastNames = [
    "Yılmaz","Kaya","Demir","Şahin","Çelik","Yıldız","Yıldırım","Aydın","Öztürk","Arslan",
    "Doğan","Kılıç","Aslan","Kara","Koç","Kurt","Özdemir","Polat","Özcan","Kaplan",
    "Sarı","Tekin","Taş","Güneş","Bozkurt","Aksoy","Erdoğan","Bulut","Avcı","Keskin",
    "Işık","Yalçın","Ceylan","Çetin","Eren","Sezer","Dinç","Karaaslan","Bal","Uçar",
    "Özkan","Erdoğdu","Bayrak","Toprak","Öztuna","Duman","Karaca","Kuzu","Gökmen","Öz"
  ];

  const roles: Array<UserSeed["role"]> = ["candidate", "candidate", "candidate", "candidate", "candidate", "employer"];
  const emailDomains = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "proton.me"];

  const now = new Date();
  const oneMonthAgo = daysAgo(30);

  const users: UserSeed[] = [];
  const userBadges: UserBadgeSeed[] = [];
  const quizAttempts: QuizAttemptSeed[] = [];
  const testAttempts: GenericAttemptSeed[] = [];
  const liveCodingAttempts: GenericAttemptSeed[] = [];
  const bugFixAttempts: GenericAttemptSeed[] = [];
  const hackatonAttempts: HackatonAttemptSeed[] = [];
  const userBalances: UserBalanceSeed[] = [];
  const userStreaks: UserStreakSeed[] = [];

  // Common references (must exist in DB if inserted later)
  const badgeIds = [
    "badge-react-track","badge-flutter-track","badge-node-track","badge-python-track",
    "badge-perf-expert","badge-testing-guru",
    "badge-angular-track","badge-vue-track","badge-rn-track","badge-java-track","badge-go-track"
  ];
  // Real quiz ID prefixes from new-seed-data.sql
  // Intermediate level (range 1-100)
  // Advanced level (range 1-50)
  const quizPools = [
    // Intermediate - React
    { prefix: "quiz-react-live-", range: 100 },
    { prefix: "quiz-react-bug-", range: 100 },
    { prefix: "quiz-react-test-", range: 100 },
    // Intermediate - Flutter
    { prefix: "quiz-flutter-live-", range: 100 },
    { prefix: "quiz-flutter-bug-", range: 100 },
    { prefix: "quiz-flutter-test-", range: 100 },
    // Intermediate - Node
    { prefix: "quiz-node-live-", range: 100 },
    { prefix: "quiz-node-bug-", range: 100 },
    { prefix: "quiz-node-test-", range: 100 },
    // Intermediate - Python
    { prefix: "quiz-python-live-", range: 100 },
    { prefix: "quiz-python-bug-", range: 100 },
    { prefix: "quiz-python-test-", range: 100 },
    // Intermediate - Angular
    { prefix: "quiz-angular-live-", range: 100 },
    { prefix: "quiz-angular-bug-", range: 100 },
    { prefix: "quiz-angular-test-", range: 100 },
    // Intermediate - Vue
    { prefix: "quiz-vue-live-", range: 100 },
    { prefix: "quiz-vue-bug-", range: 100 },
    { prefix: "quiz-vue-test-", range: 100 },
    // Intermediate - React Native
    { prefix: "quiz-rn-live-", range: 100 },
    { prefix: "quiz-rn-bug-", range: 100 },
    { prefix: "quiz-rn-test-", range: 100 },
    // Intermediate - Java Spring
    { prefix: "quiz-java-live-", range: 100 },
    { prefix: "quiz-java-bug-", range: 100 },
    { prefix: "quiz-java-test-", range: 100 },
    // Intermediate - Go
    { prefix: "quiz-go-live-", range: 100 },
    { prefix: "quiz-go-bug-", range: 100 },
    { prefix: "quiz-go-test-", range: 100 },
    // Intermediate - .NET
    { prefix: "quiz-dotnet-live-", range: 100 },
    { prefix: "quiz-dotnet-bug-", range: 100 },
    { prefix: "quiz-dotnet-test-", range: 100 },
    // Advanced - React
    { prefix: "quiz-react-adv-live-", range: 50 },
    { prefix: "quiz-react-adv-bug-", range: 50 },
    { prefix: "quiz-react-adv-test-", range: 50 },
    // Advanced - Flutter
    { prefix: "quiz-flutter-adv-live-", range: 50 },
    { prefix: "quiz-flutter-adv-bug-", range: 50 },
    { prefix: "quiz-flutter-adv-test-", range: 50 },
    // Advanced - Node
    { prefix: "quiz-node-adv-live-", range: 50 },
    { prefix: "quiz-node-adv-bug-", range: 50 },
    { prefix: "quiz-node-adv-test-", range: 50 },
    // Advanced - Python
    { prefix: "quiz-python-adv-live-", range: 50 },
    { prefix: "quiz-python-adv-bug-", range: 50 },
    { prefix: "quiz-python-adv-test-", range: 50 }
  ];

  // Create one user per available photo
  for (let i = 0; i < images.length; i++) {
    const imgRel = images[i];
    const isWoman = imgRel.replace(/\\/g, "/").startsWith("Woman/");
    const first =
      isWoman ? pick(femaleFirstNames, i) : pick(maleFirstNames, i);
    const last = pick(lastNames, images.length - i - 1);
    const name = `${first} ${last}`;
    const slug = slugify(`${first}-${last}`);
    const domain = pick(emailDomains, i);
    const numSuffix = Math.random() < 0.5 ? "" : String(randInt(1, 99));
    const emailPattern =
      Math.random() < 0.6
        ? `${slug}.${numSuffix || randInt(1, 9)}@${domain}`
        : `${first.toLowerCase()}.${last.toLowerCase()}${numSuffix}@${domain}`;
    const email = emailPattern.replace(/\.\.@/, "@").replace(/\.\./g, ".");
    const role = pick(roles, i);
    const created = randomDateBetween(oneMonthAgo, now);
    const updated = randomDateBetween(created, now);
    const profileImage = `/Photos/ProfilePhotos/${imgRel.replace(/\\\\/g, "/")}`;

    const userId = `user-${slug}-${i + 1}`;
    users.push({
      id: userId,
      email,
      password: null,
      name,
      role,
      profileImage,
      createdAt: created.toISOString(),
      updatedAt: updated.toISOString()
    });

    // Badges: 2-4 per user, some displayed
    const badgeCount = randInt(2, 4);
    const shuffledBadges = [...badgeIds].sort(() => Math.random() - 0.5);
    for (let b = 0; b < badgeCount; b++) {
      const badgeId = shuffledBadges[b];
      const earnedAt = randomDateBetween(created, now);
      userBadges.push({
        id: `userbadge-${slug}-${badgeId}`,
        userId,
        badgeId,
        earnedAt: earnedAt.toISOString(),
        isDisplayed: b < 2,
        featuredOrder: b < 2 ? b + 1 : undefined
      });
    }

    // Activity: attempts that look realistic
    const attemptCount = randInt(3, 6);
    for (let a = 0; a < attemptCount; a++) {
      const quizPool = pick(quizPools, i + a);
      const quizIndex = String(randInt(1, quizPool.range)).padStart(3, "0");
      const quizId = `${quizPool.prefix}${quizIndex}`;
      const when = randomDateBetween(created, now);
      const score = randInt(65, 98);
      const duration = randInt(300, 1800);
      // QuizAttempt
      quizAttempts.push({
        id: `quizattempt-${slug}-${a + 1}`,
        userId,
        quizId,
        score,
        answers: { answered: randInt(8, 15), correct: Math.round(score / 10) },
        aiAnalysis: { strengths: ["consistency"], focus: ["refactoring"] },
        duration,
        topic: undefined,
        level: "intermediate",
        completedAt: when.toISOString()
      });
      // TestAttempt
      testAttempts.push({
        id: `testattempt-${slug}-${a + 1}`,
        userId,
        quizId,
        metrics: { score, duration, attempts: 1 },
        aiAnalysis: { summary: "Stable performance" },
        completedAt: when.toISOString(),
        createdAt: when.toISOString(),
        updatedAt: when.toISOString()
      });
      // LiveCodingAttempt
      liveCodingAttempts.push({
        id: `liveattempt-${slug}-${a + 1}`,
        userId,
        quizId,
        metrics: {
          codeQuality: randInt(70, 95),
          completionTime: duration,
          testsPassed: randInt(5, 8)
        },
        aiAnalysis: { suggestion: "Use memoization where relevant" },
        completedAt: when.toISOString(),
        createdAt: when.toISOString(),
        updatedAt: when.toISOString()
      });
      // BugFixAttempt
      bugFixAttempts.push({
        id: `bugfix-${slug}-${a + 1}`,
        userId,
        quizId,
        metrics: { bugsFixed: randInt(1, 4), codeQuality: randInt(70, 95) },
        aiAnalysis: { risk: "low" },
        completedAt: when.toISOString(),
        createdAt: when.toISOString(),
        updatedAt: when.toISOString()
      });
    }

    // Hackathon attempt: looks like applied and delivered a project, possibly won
    const hkWhen = randomDateBetween(created, now);
    const won = Math.random() < 0.25;
    const hackathonQuizPool = pick(quizPools, i * 2);
    const hackathonQuizIndex = String(randInt(1, hackathonQuizPool.range)).padStart(3, "0");
    const hackathonQuizId = `${hackathonQuizPool.prefix}${hackathonQuizIndex}`;
    hackatonAttempts.push({
      id: `hackaton-${slug}-1`,
      userId,
      quizId: hackathonQuizId,
      hackathonId: won ? "hackathon-spring-2025" : "hackathon-fall-2025",
      projectUrl: `https://github.com/${slug}/${won ? "award-winning" : "project"}`,
      metrics: {
        projectScore: randInt(75, 99),
        featuresCompleted: randInt(3, 6),
        codeQuality: randInt(70, 95),
        award: won ? "winner" : "participant"
      },
      aiAnalysis: { notes: won ? "Excellent submission" : "Good effort" },
      completedAt: hkWhen.toISOString(),
      createdAt: hkWhen.toISOString(),
      updatedAt: hkWhen.toISOString()
    });

    // Balance & streaks to look engaged
    const points = randInt(200, 2000);
    const lifetimeXp = points * randInt(3, 8);
    const level = Math.max(1, Math.floor(Math.sqrt(lifetimeXp / 100)));
    userBalances.push({
      userId,
      points,
      lifetimeXp,
      level
    });
    const lastActivity = randomDateBetween(created, now);
    const currentStreak = randInt(3, 20);
    const longestStreak = Math.max(currentStreak, randInt(7, 30));
    userStreaks.push({
      userId,
      currentStreak,
      longestStreak,
      lastActivityDate: lastActivity.toISOString(),
      totalDaysActive: randInt(10, 60)
    });
  }

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      users: users.length,
      sourcePhotosDir: "Kariyer/Photos/ProfilePhotos",
      notes:
        "Users are generated one-per-photo with realistic emails, dates, badges, attempts, hackathon activity."
    },
    users,
    userBadges,
    quizAttempts,
    testAttempts,
    liveCodingAttempts,
    bugFixAttempts,
    hackatonAttempts,
    userBalances,
    userStreaks
  };

  fs.writeFileSync(outputFile, JSON.stringify(payload, null, 2), "utf8");
  // eslint-disable-next-line no-console
  console.log(
    `Wrote ${users.length} users (and related activity) to ${path.relative(
      projectRoot,
      outputFile
    )}`
  );
}

main();
