export interface TestItem {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  passingScore: number;
  course: {
    id: string;
    title: string;
    expertise: string | null;
    topic: string | null;
    topicContent: string | null;
    difficulty: string;
  };
}

export interface ChallengeGroup {
  slug: string;
  title: string;
  baseTitle: string;
  expertise: string | null;
  topic: string | null;
  topicContent: string | null;
  tests: TestItem[];
}

const removeDiacritics = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const generateChallengeSlug = (title: string) => {
  const normalized = removeDiacritics(title)
    .toLocaleLowerCase("tr")
    .replace(/challenge$/, "")
    .trim();

  const slug = normalized
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "genel";
};

const buildChallengeTitle = (baseTitle: string) => {
  const trimmed = baseTitle.trim();
  return trimmed.toLowerCase().endsWith("challenge") ? trimmed : `${trimmed} Challenge`;
};

export const createChallengeGroups = (tests: TestItem[]): ChallengeGroup[] => {
  if (!tests.length) return [];

  const map = new Map<string, ChallengeGroup>();

  tests.forEach((test) => {
    const baseTitle =
      test.course.topic?.trim() ||
      test.course.title?.trim() ||
      test.title.trim() ||
      "Genel";

    const slug = generateChallengeSlug(baseTitle);

    if (!map.has(slug)) {
      map.set(slug, {
        slug,
        title: buildChallengeTitle(baseTitle),
        baseTitle,
        expertise: test.course.expertise,
        topic: test.course.topic,
        topicContent: test.course.topicContent,
        tests: [],
      });
    }

    map.get(slug)!.tests.push(test);
  });

  return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title, "tr"));
};

