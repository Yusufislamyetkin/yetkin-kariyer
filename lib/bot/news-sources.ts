/**
 * Yazılım dünyasından güncel haber kaynakları
 * Botlar bu kaynaklardan içerik paylaşacak
 */

export type NewsSourceCategory =
  | "general"
  | "javascript"
  | "python"
  | "java"
  | "csharp"
  | "react"
  | "backend"
  | "devops"
  | "ai-ml";

export interface NewsSource {
  id: string;
  name: string;
  category: NewsSourceCategory;
  website: string;
  rssFeed?: string;
  description?: string;
}

export const NEWS_SOURCES: NewsSource[] = [
  // Genel teknoloji haberleri
  {
    id: "techcrunch",
    name: "TechCrunch",
    category: "general",
    website: "https://techcrunch.com",
    rssFeed: "https://techcrunch.com/feed/",
    description: "Teknoloji ve startup haberleri",
  },
  {
    id: "the-verge-tech",
    name: "The Verge - Tech",
    category: "general",
    website: "https://www.theverge.com/tech",
    description: "Teknoloji haberleri ve incelemeler",
  },
  {
    id: "hacker-news",
    name: "Hacker News",
    category: "general",
    website: "https://news.ycombinator.com",
    description: "Programcılar için teknoloji haberleri",
  },
  {
    id: "dev-to",
    name: "DEV Community",
    category: "general",
    website: "https://dev.to",
    description: "Yazılım geliştiriciler topluluğu",
  },

  // JavaScript/TypeScript
  {
    id: "javascript-weekly",
    name: "JavaScript Weekly",
    category: "javascript",
    website: "https://javascriptweekly.com",
    description: "JavaScript haberleri ve kaynakları",
  },
  {
    id: "typescript-blog",
    name: "TypeScript Blog",
    category: "javascript",
    website: "https://devblogs.microsoft.com/typescript/",
    description: "TypeScript resmi blog",
  },
  {
    id: "nodejs-blog",
    name: "Node.js Blog",
    category: "javascript",
    website: "https://nodejs.org/en/blog",
    description: "Node.js resmi blog",
  },
  {
    id: "mdn-web-docs",
    name: "MDN Web Docs",
    category: "javascript",
    website: "https://developer.mozilla.org",
    description: "Web teknolojileri dokümantasyonu",
  },

  // Python
  {
    id: "python-org-news",
    name: "Python.org News",
    category: "python",
    website: "https://www.python.org/news/",
    description: "Python resmi haberler",
  },
  {
    id: "real-python",
    name: "Real Python",
    category: "python",
    website: "https://realpython.com",
    description: "Python öğrenme kaynakları ve haberler",
  },
  {
    id: "pycoders-weekly",
    name: "PyCoder's Weekly",
    category: "python",
    website: "https://pycoders.com",
    description: "Python haberleri ve kaynakları",
  },

  // Java
  {
    id: "oracle-java-blog",
    name: "Oracle Java Blog",
    category: "java",
    website: "https://blogs.oracle.com/java/",
    description: "Java resmi blog",
  },
  {
    id: "baeldung-java",
    name: "Baeldung Java",
    category: "java",
    website: "https://www.baeldung.com/java",
    description: "Java öğreticileri ve haberler",
  },
  {
    id: "infoq-java",
    name: "InfoQ Java",
    category: "java",
    website: "https://www.infoq.com/java/",
    description: "Java teknolojileri haberleri",
  },

  // C# / .NET
  {
    id: "dotnet-blog",
    name: ".NET Blog",
    category: "csharp",
    website: "https://devblogs.microsoft.com/dotnet/",
    description: ".NET resmi blog",
  },
  {
    id: "microsoft-learn-dotnet",
    name: "Microsoft Learn .NET",
    category: "csharp",
    website: "https://learn.microsoft.com/dotnet/",
    description: ".NET öğrenme kaynakları",
  },
  {
    id: "csharp-corner",
    name: "C# Corner",
    category: "csharp",
    website: "https://www.c-sharpcorner.com",
    description: "C# ve .NET kaynakları",
  },

  // React/Next.js
  {
    id: "react-blog",
    name: "React Blog",
    category: "react",
    website: "https://react.dev/blog",
    description: "React resmi blog",
  },
  {
    id: "nextjs-blog",
    name: "Next.js Blog",
    category: "react",
    website: "https://nextjs.org/blog",
    description: "Next.js resmi blog",
  },
  {
    id: "vercel-blog",
    name: "Vercel Blog",
    category: "react",
    website: "https://vercel.com/blog",
    description: "Vercel ve frontend teknolojileri",
  },
  {
    id: "kentcdodds-blog",
    name: "Kent C. Dodds Blog",
    category: "react",
    website: "https://kentcdodds.com/blog",
    description: "React ve frontend best practices",
  },

  // Backend teknolojileri
  {
    id: "aws-blog",
    name: "AWS Blog",
    category: "backend",
    website: "https://aws.amazon.com/blogs/",
    description: "AWS ve cloud teknolojileri",
  },
  {
    id: "google-cloud-blog",
    name: "Google Cloud Blog",
    category: "backend",
    website: "https://cloud.google.com/blog",
    description: "Google Cloud haberleri",
  },
  {
    id: "redis-blog",
    name: "Redis Blog",
    category: "backend",
    website: "https://redis.io/blog/",
    description: "Redis ve veritabanı teknolojileri",
  },
  {
    id: "postgresql-news",
    name: "PostgreSQL News",
    category: "backend",
    website: "https://www.postgresql.org/about/newsarchive/",
    description: "PostgreSQL haberleri",
  },

  // DevOps
  {
    id: "docker-blog",
    name: "Docker Blog",
    category: "devops",
    website: "https://www.docker.com/blog/",
    description: "Docker ve container teknolojileri",
  },
  {
    id: "kubernetes-blog",
    name: "Kubernetes Blog",
    category: "devops",
    website: "https://kubernetes.io/blog/",
    description: "Kubernetes haberleri",
  },
  {
    id: "github-blog",
    name: "GitHub Blog",
    category: "devops",
    website: "https://github.blog",
    description: "GitHub ve git teknolojileri",
  },
  {
    id: "gitlab-blog",
    name: "GitLab Blog",
    category: "devops",
    website: "https://about.gitlab.com/blog/",
    description: "GitLab ve CI/CD",
  },

  // AI/ML
  {
    id: "openai-blog",
    name: "OpenAI Blog",
    category: "ai-ml",
    website: "https://openai.com/blog",
    description: "OpenAI ve AI teknolojileri",
  },
  {
    id: "google-ai-blog",
    name: "Google AI Blog",
    category: "ai-ml",
    website: "https://ai.googleblog.com/",
    description: "Google AI araştırmaları",
  },
  {
    id: "hugging-face-blog",
    name: "Hugging Face Blog",
    category: "ai-ml",
    website: "https://huggingface.co/blog",
    description: "Machine learning modelleri ve araçları",
  },
];

/**
 * Kategoriye göre kaynakları getir
 */
export function getSourcesByCategory(category: NewsSourceCategory): NewsSource[] {
  return NEWS_SOURCES.filter((source) => source.category === category);
}

/**
 * Tüm kategorileri getir
 */
export function getAllCategories(): NewsSourceCategory[] {
  return Array.from(new Set(NEWS_SOURCES.map((source) => source.category)));
}

/**
 * ID'ye göre kaynak bul
 */
export function getSourceById(id: string): NewsSource | undefined {
  return NEWS_SOURCES.find((source) => source.id === id);
}

/**
 * Bot'un uzmanlık alanına göre uygun kaynakları getir
 */
export function getSourcesByExpertise(expertise: string[]): NewsSource[] {
  if (!expertise || expertise.length === 0) {
    return NEWS_SOURCES;
  }

  const expertiseLower = expertise.map((e) => e.toLowerCase());
  const matchedSources: NewsSource[] = [];

  for (const source of NEWS_SOURCES) {
    // Kategori eşleşmesi
    if (
      (expertiseLower.some((e) => e.includes("javascript") || e.includes("js")) &&
        (source.category === "javascript" || source.category === "react")) ||
      (expertiseLower.some((e) => e.includes("python")) && source.category === "python") ||
      (expertiseLower.some((e) => e.includes("java")) && source.category === "java") ||
      (expertiseLower.some((e) => e.includes("c#") || e.includes("csharp") || e.includes("dotnet")) &&
        source.category === "csharp") ||
      (expertiseLower.some((e) => e.includes("react") || e.includes("next")) && source.category === "react") ||
      (expertiseLower.some((e) => e.includes("backend") || e.includes("server")) && source.category === "backend") ||
      (expertiseLower.some((e) => e.includes("devops") || e.includes("docker")) && source.category === "devops") ||
      (expertiseLower.some((e) => e.includes("ai") || e.includes("ml") || e.includes("machine learning")) &&
        source.category === "ai-ml")
    ) {
      matchedSources.push(source);
    }
  }

  // Eşleşme yoksa genel kaynakları döndür
  return matchedSources.length > 0 ? matchedSources : getSourcesByCategory("general");
}

