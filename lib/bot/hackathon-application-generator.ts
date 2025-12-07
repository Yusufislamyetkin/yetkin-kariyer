import { db } from "@/lib/db";
import { createChatCompletion } from "@/lib/ai/client";

interface BotCharacter {
  id: string;
  name: string;
  persona: string;
  systemPrompt: string;
  expertise: string[];
}

interface HackathonApplicationData {
  motivation: string;
  skills: string[];
  githubProfile?: string;
  portfolioUrl?: string;
}

/**
 * Generate hackathon application data based on bot character
 */
export async function generateHackathonApplicationData(
  botCharacter: BotCharacter,
  hackathonTitle: string,
  hackathonDescription?: string | null
): Promise<HackathonApplicationData> {
  try {
    const systemPrompt =
      botCharacter.systemPrompt ||
      `Sen ${botCharacter.name} karakterisin. ${botCharacter.persona || "Yardımsever ve aktif bir topluluk üyesi."}`;

    const userPrompt = `Aşağıdaki hackathon için bir başvuru hazırla. Bot karakterine uygun, profesyonel ve samimi bir başvuru metni oluştur.

HACKATHON BİLGİLERİ:
Başlık: ${hackathonTitle}
${hackathonDescription ? `Açıklama: ${hackathonDescription}` : ""}

BOT KARAKTERİ:
İsim: ${botCharacter.name}
Kişilik: ${botCharacter.persona}
Uzmanlık Alanları: ${botCharacter.expertise.join(", ") || "Genel yazılım geliştirme"}

GEREKSİNİMLER:
1. Motivation (Başvuru Gerekçesi): 100-300 kelime arası, bot karakterine uygun, hackathon'a katılma motivasyonunu açıklayan bir metin. Türkçe yaz.
2. Skills (Yetenekler): Bot'un expertise alanlarından en az 3, en fazla 8 yetenek seç. Her yetenek kısa ve net olsun (örn: "JavaScript", "React", "Node.js", "Python", "UI/UX Design").

ÖNEMLİ:
- Motivation metni doğal ve samimi olsun, bot karakterinin kişiliğini yansıtsın
- Teknik jargon kullanabilirsin ama aşırıya kaçma
- Bot'un uzmanlık alanlarına uygun yetenekler seç
- Türkçe yaz, profesyonel ama samimi bir dil kullan

Lütfen şu formatta JSON döndür:
{
  "motivation": "Başvuru gerekçesi metni...",
  "skills": ["Yetenek1", "Yetenek2", "Yetenek3"]
}`;

    const result = await createChatCompletion({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      responseFormat: "json_object",
    });

    if (!result.content) {
      throw new Error("Generated application data is empty");
    }

    try {
      const parsed = JSON.parse(result.content);
      const motivation = parsed.motivation?.trim() || "";
      const skills = Array.isArray(parsed.skills)
        ? parsed.skills
            .map((s: any) => String(s).trim())
            .filter((s: string) => s.length > 0 && s.length <= 50)
            .slice(0, 8)
        : [];

      // Validate motivation length
      if (motivation.length < 50) {
        throw new Error("Motivation too short");
      }

      // Ensure we have at least some skills
      const finalSkills =
        skills.length > 0
          ? skills
          : botCharacter.expertise.slice(0, 5).map((e) => e.trim());

      return {
        motivation: motivation.substring(0, 1000), // Limit to 1000 chars
        skills: finalSkills,
        githubProfile: generateGitHubProfile(botCharacter),
        portfolioUrl: generatePortfolioUrl(botCharacter),
      };
    } catch (parseError) {
      console.error("[BOT_HACKATHON] Error parsing AI response:", parseError);
      // Fallback to default values
      return generateFallbackApplicationData(botCharacter);
    }
  } catch (error: any) {
    console.error("[BOT_HACKATHON] Error generating application data:", error);
    return generateFallbackApplicationData(botCharacter);
  }
}

/**
 * Generate a realistic GitHub profile URL based on bot character
 */
function generateGitHubProfile(botCharacter: BotCharacter): string | undefined {
  // 70% chance of having a GitHub profile
  if (Math.random() > 0.3) {
    const username = botCharacter.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 20);
    return `https://github.com/${username}`;
  }
  return undefined;
}

/**
 * Generate a realistic portfolio URL based on bot character
 */
function generatePortfolioUrl(botCharacter: BotCharacter): string | undefined {
  // 40% chance of having a portfolio
  if (Math.random() > 0.6) {
    const username = botCharacter.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 20);
    return `https://${username}.dev`;
  }
  return undefined;
}

/**
 * Fallback application data when AI generation fails
 */
function generateFallbackApplicationData(
  botCharacter: BotCharacter
): HackathonApplicationData {
  const fallbackMotivations = [
    `Bu hackathon'a katılmak için çok heyecanlıyım. ${botCharacter.expertise.join(", ")} alanlarında deneyimim var ve bu hackathon'da öğrendiklerimi uygulayarak yeni projeler geliştirmek istiyorum.`,
    `Bu hackathon'a katılarak hem yeni teknolojiler öğrenmek hem de diğer katılımcılarla işbirliği yapmak istiyorum. ${botCharacter.expertise[0] || "Yazılım geliştirme"} alanında kendimi geliştirmek için harika bir fırsat.`,
    `Bu hackathon, ${botCharacter.expertise.join(" ve ")} konularında pratik yapmak ve yeni fikirler geliştirmek için mükemmel bir platform. Katılım göstermekten mutluluk duyuyorum.`,
  ];

  const motivation =
    fallbackMotivations[Math.floor(Math.random() * fallbackMotivations.length)];

  const skills =
    botCharacter.expertise.length > 0
      ? botCharacter.expertise.slice(0, 6)
      : ["JavaScript", "Web Development", "Problem Solving"];

  return {
    motivation,
    skills,
    githubProfile: generateGitHubProfile(botCharacter),
    portfolioUrl: generatePortfolioUrl(botCharacter),
  };
}

