interface CourseModule {
  id: string;
  title: string;
  summary: string;
  durationMinutes: number;
  objectives: string[];
  relatedTopics: Array<{
    label: string;
    href: string;
    description: string;
  }>;
}

interface CourseContent {
  overview: {
    description: string;
    estimatedDurationMinutes: number;
  };
  learningObjectives: string[];
  prerequisites: string[];
  modules: CourseModule[];
}

/**
 * Create complete React course structure with predefined content
 */
export async function createReactCourse(): Promise<CourseContent> {
  console.log("[CREATE_COURSE] Starting React course creation...");

  const modules: CourseModule[] = [];
  let totalDuration = 0;

  const staticModulesData = [
    {
      title: "Module 1: React Temelleri ve Kurulum",
      summary: "React'in ne olduğunu, neden kullanıldığını ve nasıl kurulacağını öğrenin.",
      objectives: ["React nedir", "Neden React", "Kurulum ve setup"],
    },
    {
      title: "Module 2: JSX ve Component Yapısı",
      summary: "JSX syntax'ını ve React component'lerinin nasıl oluşturulacağını kavrayın.",
      objectives: ["JSX syntax", "Component oluşturma", "Component yapısı"],
    },
    {
      title: "Module 3: Props ve State Yönetimi",
      summary: "Props ve state kavramlarını öğrenerek dinamik component'ler oluşturun.",
      objectives: ["Props kullanımı", "State yönetimi", "Props vs State"],
    },
    {
      title: "Module 4: Event Handling ve Form Yönetimi",
      summary: "Kullanıcı etkileşimlerini yönetmeyi ve form işlemlerini öğrenin.",
      objectives: ["Event handling", "Form yönetimi", "Controlled components"],
    },
    {
      title: "Module 5: React Hooks (useState, useEffect)",
      summary: "Modern React geliştirme için temel hooks'ları öğrenin.",
      objectives: ["useState hook", "useEffect hook", "Hooks kuralları"],
    },
    {
      title: "Module 6: İleri Seviye Hooks",
      summary: "useContext, useReducer, useMemo gibi ileri seviye hooks'ları kullanın.",
      objectives: ["useContext", "useReducer", "useMemo ve useCallback"],
    },
    {
      title: "Module 7: React Router ve Navigation",
      summary: "Çok sayfalı uygulamalar için routing ve navigation yapılarını öğrenin.",
      objectives: ["React Router", "Navigation", "Route parameters"],
    },
    {
      title: "Module 8: Context API ve Global State",
      summary: "Global state yönetimi için Context API'yi etkin bir şekilde kullanın.",
      objectives: ["Context API", "Provider pattern", "Global state yönetimi"],
    },
    {
      title: "Module 9: Performance Optimizasyonu",
      summary: "React uygulamalarınızın performansını artırma tekniklerini öğrenin.",
      objectives: ["Memoization", "Code splitting", "Lazy loading"],
    },
    {
      title: "Module 10: Testing (Jest, React Testing Library)",
      summary: "React component'lerinizi test etmeyi ve test stratejileri geliştirmeyi öğrenin.",
      objectives: ["Jest kurulumu", "React Testing Library", "Test yazma"],
    },
    {
      title: "Module 11: Styling (CSS Modules, Styled Components)",
      summary: "React uygulamalarında modern styling yaklaşımlarını uygulayın.",
      objectives: ["CSS Modules", "Styled Components", "CSS-in-JS"],
    },
    {
      title: "Module 12: State Management (Redux, Zustand)",
      summary: "Karmaşık state yönetimi için Redux ve Zustand gibi kütüphaneleri öğrenin.",
      objectives: ["Redux kurulumu", "Zustand kullanımı", "State management patterns"],
    },
    {
      title: "Module 13: Server-Side Rendering (Next.js)",
      summary: "Next.js ile server-side rendering ve modern React uygulamaları geliştirin.",
      objectives: ["Next.js kurulumu", "SSR kavramları", "Static generation"],
    },
    {
      title: "Module 14: React Best Practices ve Patterns",
      summary: "Temiz kod, sürdürülebilirlik ve performans için en iyi uygulamaları benimseyin.",
      objectives: ["Component patterns", "Code organization", "Performance best practices"],
    },
    {
      title: "Module 15: Bitirme Projesi",
      summary: "Öğrendiğiniz tüm bilgileri kullanarak kapsamlı bir React projesi geliştirin.",
      objectives: ["Proje planlama", "Uygulama geliştirme", "Deployment"],
    },
  ];

  for (let i = 0; i < staticModulesData.length; i++) {
    const moduleData = staticModulesData[i];
    const moduleNumber = String(i + 1).padStart(2, "0");
    const moduleId = `module-${moduleNumber}`;

    console.log(
      `[CREATE_COURSE] Creating lessons for module ${i + 1}/15: ${moduleData.title}`
    );

    const lessonsData = Array.from({ length: 15 }).map((_, lessonIndex) => {
      const lessonNum = lessonIndex + 1;
      let title = `Ders ${lessonNum}: ${moduleData.title} Konusu ${lessonNum}`;
      let description = `${moduleData.title} modülünün bu dersinde, ${moduleData.title.toLowerCase()} ile ilgili temel kavramları ve uygulamaları öğreneceksiniz.`;

      // Specific lesson titles for better context
      if (moduleData.title.includes("Temelleri") && lessonNum === 1) {
        title = "Ders 1: React Nedir?";
        description = "React'in ne olduğunu, temel özelliklerini ve neden kullanıldığını keşfedin.";
      } else if (moduleData.title.includes("Temelleri") && lessonNum === 2) {
        title = "Ders 2: React ve Diğer Frontend Framework'leri";
        description = "React'i Vue, Angular gibi diğer frontend framework'leriyle karşılaştırın ve avantajlarını anlayın.";
      } else if (moduleData.title.includes("JSX") && lessonNum === 1) {
        title = "Ders 1: JSX Syntax Temelleri";
        description = "JSX'in ne olduğunu, nasıl kullanıldığını ve HTML'den farklarını öğrenin.";
      } else if (moduleData.title.includes("JSX") && lessonNum === 2) {
        title = "Ders 2: JSX Expressions ve Embedding";
        description = "JSX içinde JavaScript expression'larını kullanmayı ve dinamik içerik oluşturmayı öğrenin.";
      } else if (moduleData.title.includes("Props") && lessonNum === 1) {
        title = "Ders 1: Props Nedir?";
        description = "Props kavramını, nasıl kullanıldığını ve component'ler arası veri aktarımını öğrenin.";
      } else if (moduleData.title.includes("Props") && lessonNum === 2) {
        title = "Ders 2: Props Types ve Default Values";
        description = "PropTypes kullanımını ve default prop değerlerini öğrenin.";
      } else if (moduleData.title.includes("Event Handling") && lessonNum === 1) {
        title = "Ders 1: Event Handling Temelleri";
        description = "React'te event handling'in nasıl yapıldığını ve DOM event'lerinden farklarını öğrenin.";
      } else if (moduleData.title.includes("Hooks") && lessonNum === 1 && moduleData.title.includes("useState")) {
        title = "Ders 1: useState Hook";
        description = "useState hook'unu kullanarak component state'ini yönetmeyi öğrenin.";
      } else if (moduleData.title.includes("Hooks") && lessonNum === 2 && moduleData.title.includes("useState")) {
        title = "Ders 2: useEffect Hook";
        description = "useEffect hook'unu kullanarak side effect'leri yönetmeyi öğrenin.";
      } else if (moduleData.title.includes("Router") && lessonNum === 1) {
        title = "Ders 1: React Router Kurulumu";
        description = "React Router'ı projenize nasıl ekleyeceğinizi ve temel routing yapısını öğrenin.";
      } else if (moduleData.title.includes("Context") && lessonNum === 1) {
        title = "Ders 1: Context API Nedir?";
        description = "Context API'nin ne olduğunu, ne zaman kullanılacağını ve nasıl implement edileceğini öğrenin.";
      } else if (moduleData.title.includes("Performance") && lessonNum === 1) {
        title = "Ders 1: React.memo ve useMemo";
        description = "Component'leri ve hesaplamaları optimize etmek için memoization tekniklerini öğrenin.";
      } else if (moduleData.title.includes("Testing") && lessonNum === 1) {
        title = "Ders 1: Jest ve React Testing Library Kurulumu";
        description = "Test ortamını kurmayı ve ilk testlerinizi yazmayı öğrenin.";
      } else if (moduleData.title.includes("Styling") && lessonNum === 1) {
        title = "Ders 1: CSS Modules Kullanımı";
        description = "CSS Modules ile scoped styling yapmayı öğrenin.";
      } else if (moduleData.title.includes("State Management") && lessonNum === 1) {
        title = "Ders 1: Redux Temelleri";
        description = "Redux'un ne olduğunu, neden kullanıldığını ve temel kavramlarını öğrenin.";
      } else if (moduleData.title.includes("Next.js") && lessonNum === 1) {
        title = "Ders 1: Next.js Nedir?";
        description = "Next.js'in ne olduğunu, React'ten farklarını ve avantajlarını öğrenin.";
      } else if (moduleData.title.includes("Best Practices") && lessonNum === 1) {
        title = "Ders 1: Component Design Patterns";
        description = "Yeniden kullanılabilir ve sürdürülebilir component'ler için design pattern'leri öğrenin.";
      } else if (moduleData.title.includes("Bitirme") && lessonNum === 1) {
        title = "Ders 1: Proje Planlama ve Mimari";
        description = "Kapsamlı bir React projesi için planlama ve mimari tasarım yapmayı öğrenin.";
      }

      return {
        title,
        description,
      };
    });

    const relatedTopics = lessonsData.map((lesson, lessonIndex) => {
      const lessonNumber = String(lessonIndex + 1).padStart(2, "0");
      const lessonId = `lesson-${moduleNumber}-${lessonNumber}`;
      return {
        label: lesson.title,
        href: `/education/lessons/react/${moduleId}/${lessonId}`,
        description: lesson.description,
      };
    });

    const durationMinutes = lessonsData.length * 3.5; // 3.5 minutes per lesson (average)
    totalDuration += durationMinutes;

    modules.push({
      id: moduleId,
      title: moduleData.title,
      summary: moduleData.summary,
      durationMinutes,
      objectives: moduleData.objectives,
      relatedTopics,
    });
  }

  const courseContent: CourseContent = {
    overview: {
      description:
        "React ile modern, interaktif ve yüksek performanslı kullanıcı arayüzleri geliştirmek için kapsamlı bir öğrenme yolu. Temel React kavramlarından ileri seviye state management ve performance optimizasyonuna kadar her şeyi kapsar.",
      estimatedDurationMinutes: totalDuration,
    },
    learningObjectives: [
      "React'in temel kavramlarını ve component yapısını anlamak",
      "JSX syntax'ını ve React'in declarative yaklaşımını kavramak",
      "Props, state ve event handling mekanizmalarını uygulamak",
      "React Hooks'ları etkin bir şekilde kullanmak",
      "Routing ve navigation yapılarını implement etmek",
      "Context API ve global state yönetimini uygulamak",
      "Performance optimizasyonu tekniklerini öğrenmek",
      "Testing stratejileri ve best practices'i benimsemek",
      "Modern styling yaklaşımlarını uygulamak",
      "State management kütüphanelerini (Redux, Zustand) kullanmak",
      "Next.js ile server-side rendering yapmayı öğrenmek",
    ],
    prerequisites: [
      "Temel HTML, CSS ve JavaScript bilgisi",
      "ES6+ JavaScript özelliklerine aşinalık (arrow functions, destructuring, modules)",
      "DOM manipülasyonu hakkında temel bilgi",
      "Node.js ve npm/yarn kullanımı",
    ],
    modules,
  };

  console.log(
    `[CREATE_COURSE] Course creation completed. Total modules: ${modules.length}, Total lessons: ${modules.reduce(
      (sum, m) => sum + m.relatedTopics.length,
      0
    )}`
  );

  return courseContent;
}

