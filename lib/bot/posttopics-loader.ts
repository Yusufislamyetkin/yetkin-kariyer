import fs from 'fs';
import path from 'path';

export interface PostTopic {
  category: string;
  topics: string[];
}

export interface PostTopicsIndex {
  description: string;
  categories: Array<{
    file: string;
    name: string;
    count: number;
  }>;
  totalTopics: number;
}

/**
 * Load all post topics from JSON files
 */
export async function loadAllPostTopics(): Promise<string[]> {
  try {
    const indexPath = path.join(process.cwd(), 'data', 'posttopics', 'index.json');
    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    const index: PostTopicsIndex = JSON.parse(indexContent);

    const allTopics: string[] = [];

    for (const category of index.categories) {
      const categoryPath = path.join(process.cwd(), 'data', 'posttopics', category.file);
      if (fs.existsSync(categoryPath)) {
        const categoryContent = fs.readFileSync(categoryPath, 'utf-8');
        const categoryData: PostTopic = JSON.parse(categoryContent);
        allTopics.push(...categoryData.topics);
      }
    }

    return allTopics;
  } catch (error) {
    console.error('[POSTTOPICS_LOADER] Error loading post topics:', error);
    // Return fallback topics
    return [
      "Yazılım geliştirme",
      "Teknoloji trendleri",
      "Programlama ipuçları",
      "Kariyer tavsiyeleri",
      "Best practices",
    ];
  }
}

/**
 * Get a random topic that hasn't been used by the user
 */
export async function getRandomUnusedTopic(
  userId: string,
  usedTopics: string[]
): Promise<string | null> {
  try {
    const allTopics = await loadAllPostTopics();
    const availableTopics = allTopics.filter(topic => !usedTopics.includes(topic));

    if (availableTopics.length === 0) {
      return null; // All topics have been used
    }

    const randomIndex = Math.floor(Math.random() * availableTopics.length);
    return availableTopics[randomIndex];
  } catch (error) {
    console.error('[POSTTOPICS_LOADER] Error getting random topic:', error);
    return null;
  }
}

