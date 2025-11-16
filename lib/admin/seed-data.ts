import * as fs from 'fs';
import * as path from 'path';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export interface SeedData {
  module: any;
  quizzes: Quiz[];
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  topic: string | null;
  type: string;
  level: string | null;
  questions: any;
  passingScore: number;
  lessonSlug: string | null;
}

export interface ModuleInfo {
  id: string;
  title: string;
  file: string;
}

/**
 * Get list of available seed data modules
 */
export async function getAvailableModules(): Promise<ModuleInfo[]> {
  const seedDataDir = path.join(process.cwd(), 'data', 'seed-data');
  
  if (!fs.existsSync(seedDataDir)) {
    return [];
  }

  const files = fs.readdirSync(seedDataDir)
    .filter(file => file.startsWith('module-') && file.endsWith('.json'))
    .sort();

  const modules: ModuleInfo[] = [];

  for (const file of files) {
    try {
      const filePath = path.join(seedDataDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const data: SeedData = JSON.parse(content);
      
      if (data.module) {
        modules.push({
          id: data.module.id || file.replace('.json', ''),
          title: data.module.title || data.module.id || file.replace('.json', ''),
          file,
        });
      }
    } catch (error) {
      console.error(`Error reading module file ${file}:`, error);
    }
  }

  return modules;
}

/**
 * Load seed data from a module file
 */
export async function loadModuleSeedData(moduleFile: string): Promise<SeedData | null> {
  const seedDataDir = path.join(process.cwd(), 'data', 'seed-data');
  const filePath = path.join(seedDataDir, moduleFile);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data: SeedData = JSON.parse(content);
    return data;
  } catch (error) {
    console.error(`Error loading seed data from ${moduleFile}:`, error);
    return null;
  }
}

/**
 * Insert or update a course module
 */
export async function upsertCourseModule(
  courseId: string,
  module: any,
  tx?: any
): Promise<{ success: boolean; error?: string }> {
  const dbClient = tx || db;
  
  try {
    // Check if course exists
    let course = await dbClient.course.findUnique({
      where: { id: courseId },
    });

    // If course doesn't exist, create it
    if (!course) {
      course = await dbClient.course.create({
        data: {
          id: courseId,
          title: '.NET Core Roadmap',
          description: '.NET Core eğitim içeriği',
          difficulty: 'intermediate',
          content: {
            modules: [],
          } as Prisma.InputJsonValue,
        },
      });
    }

    // Get current content
    const currentContent = (course.content as any) || {};
    const currentModules = currentContent.modules || [];

    // Check if module already exists
    const moduleIndex = currentModules.findIndex((m: any) => m.id === module.id);

    if (moduleIndex >= 0) {
      // Update existing module
      currentModules[moduleIndex] = module;
    } else {
      // Add new module
      currentModules.push(module);
    }

    // Update course
    await dbClient.course.update({
      where: { id: courseId },
      data: {
        content: {
          ...currentContent,
          modules: currentModules,
        } as Prisma.InputJsonValue,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error upserting course module:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

/**
 * Insert or update a quiz
 */
export async function upsertQuiz(quiz: Quiz, tx?: any): Promise<{ success: boolean; error?: string }> {
  const dbClient = tx || db;
  
  try {
    await dbClient.quiz.upsert({
      where: { id: quiz.id },
      create: {
        id: quiz.id,
        courseId: quiz.courseId,
        title: quiz.title,
        description: quiz.description,
        topic: quiz.topic,
        type: quiz.type as any,
        level: quiz.level,
        questions: quiz.questions as Prisma.InputJsonValue,
        passingScore: quiz.passingScore,
        lessonSlug: quiz.lessonSlug,
      },
      update: {
        title: quiz.title,
        description: quiz.description,
        topic: quiz.topic,
        type: quiz.type as any,
        level: quiz.level,
        questions: quiz.questions as Prisma.InputJsonValue,
        passingScore: quiz.passingScore,
        lessonSlug: quiz.lessonSlug,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error upserting quiz:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

/**
 * Load and insert all seed data
 */
export async function loadAllSeedData(): Promise<{
  success: boolean;
  results: Array<{
    moduleId: string;
    success: boolean;
    error?: string;
    quizzesProcessed?: number;
  }>;
}> {
  const modules = await getAvailableModules();
  const results: Array<{
    moduleId: string;
    success: boolean;
    error?: string;
    quizzesProcessed?: number;
  }> = [];

  for (const moduleInfo of modules) {
    try {
      const seedData = await loadModuleSeedData(moduleInfo.file);
      if (!seedData) {
        results.push({
          moduleId: moduleInfo.id,
          success: false,
          error: 'Could not load seed data file',
        });
        continue;
      }

      // Use transaction for atomicity
      await db.$transaction(async (tx) => {
        // Upsert course module
        const moduleResult = await upsertCourseModule('course-dotnet-roadmap', seedData.module, tx);
        if (!moduleResult.success) {
          throw new Error(moduleResult.error || 'Failed to upsert module');
        }

        // Upsert quizzes
        let quizzesProcessed = 0;
        for (const quiz of seedData.quizzes) {
          // Ensure courseId is set
          if (!quiz.courseId) {
            quiz.courseId = 'course-dotnet-roadmap';
          }

          const quizResult = await upsertQuiz(quiz, tx);
          if (quizResult.success) {
            quizzesProcessed++;
          } else {
            console.warn(`Failed to upsert quiz ${quiz.id}: ${quizResult.error}`);
          }
        }

        results.push({
          moduleId: moduleInfo.id,
          success: true,
          quizzesProcessed,
        });
      });
    } catch (error: any) {
      console.error(`Error processing module ${moduleInfo.id}:`, error);
      results.push({
        moduleId: moduleInfo.id,
        success: false,
        error: error.message || 'Unknown error',
      });
    }
  }

  const allSuccess = results.every((r) => r.success);
  return {
    success: allSuccess,
    results,
  };
}

/**
 * Import lesson contents from JSON file
 */
export async function importLessonContents(): Promise<{
  success: boolean;
  lessonsProcessed: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let lessonsProcessed = 0;

  try {
    const lessonsFilePath = path.join(process.cwd(), 'data', 'lesson-contents', 'dotnet-core-lessons.json');
    const module5FilePath = path.join(process.cwd(), 'data', 'lesson-contents', 'module-05-console-detailed.json');
    const module7AuthFilePath = path.join(process.cwd(), 'data', 'lesson-contents', 'module-07-content.json');
    const module7MvcFilePath = path.join(process.cwd(), 'data', 'lesson-contents', 'module-07-mvc-content.json');
    const module8FilePath = path.join(process.cwd(), 'data', 'lesson-contents', 'module-08-content.json');
    
    if (!fs.existsSync(lessonsFilePath)) {
      return {
        success: false,
        lessonsProcessed: 0,
        errors: ['Lesson contents JSON file not found'],
      };
    }

    const content = fs.readFileSync(lessonsFilePath, 'utf-8');
    let data: any;
    
    try {
      data = JSON.parse(content);
    } catch (parseError) {
      // If main JSON has syntax errors, try to load modules separately
      console.warn('Main JSON file has syntax errors, attempting to load modules separately');
      data = { modules: [] };
    }

    // Helper function to load module from separate file
    const loadModuleFromFile = (filePath: string, moduleId: string) => {
      if (fs.existsSync(filePath)) {
        try {
          const moduleContent = fs.readFileSync(filePath, 'utf-8');
          const moduleData = JSON.parse(moduleContent);
          if (moduleData.moduleId && moduleData.lessons) {
            if (!data.modules) {
              data.modules = [];
            }
            const existingIndex = data.modules.findIndex((m: any) => m.moduleId === moduleId);
            if (existingIndex >= 0) {
              data.modules[existingIndex] = moduleData;
            } else {
              data.modules.push(moduleData);
            }
            console.log(`Module ${moduleId} loaded successfully from separate file`);
            return true;
          }
        } catch (error) {
          console.error(`Error loading module ${moduleId}:`, error);
          errors.push(`Error loading module ${moduleId}: ${error}`);
          return false;
        }
      }
      return false;
    };

    // Load module 5 (Console Applications) separately if it exists
    loadModuleFromFile(module5FilePath, 'module-05');
    
    // Load module 7 (Authentication) separately if it exists
    loadModuleFromFile(module7AuthFilePath, 'module-07-auth');
    
    // Load module 7 (MVC) separately if it exists
    loadModuleFromFile(module7MvcFilePath, 'module-07-mvc');
    
    // Load module 8 separately if it exists
    loadModuleFromFile(module8FilePath, 'module-08-api');

    if (!data.modules || !Array.isArray(data.modules)) {
      return {
        success: false,
        lessonsProcessed: 0,
        errors: ['Invalid JSON structure: modules array not found'],
      };
    }

    // Process each module
    for (const moduleData of data.modules) {
      if (!moduleData.moduleId || !moduleData.lessons || !Array.isArray(moduleData.lessons)) {
        console.warn(`Skipping invalid module: ${moduleData.moduleId || 'unknown'}`);
        continue;
      }

      try {
        await db.$transaction(async (tx) => {
          // Process each lesson in the module
          for (const lesson of moduleData.lessons) {
            try {
              // Create lesson ID from href
              const lessonId = `lesson-${lesson.href.replace(/^\/education\/lessons\//, '').replace(/\//g, '-')}`;
              
              // Extract lesson content title from label
              const lessonContent = lesson.label;

              // Determine difficulty
              const difficulty = lesson.level === 'Başlangıç' ? 'beginner' : lesson.level === 'İleri' ? 'advanced' : 'intermediate';

              // Create course entry for this lesson
              await tx.course.upsert({
                where: { id: lessonId },
                create: {
                  id: lessonId,
                  title: lesson.label,
                  description: lesson.description || null,
                  category: '.NET Core',
                  field: 'Backend',
                  topic: '.NET Core',
                  topicContent: lessonContent,
                  difficulty: difficulty,
                  content: {
                    label: lesson.label,
                    href: lesson.href,
                    description: lesson.description,
                    estimatedDurationMinutes: lesson.estimatedDurationMinutes,
                    level: lesson.level,
                    keyTakeaways: lesson.keyTakeaways || [],
                    sections: lesson.sections || [],
                    checkpoints: lesson.checkpoints || [],
                    resources: lesson.resources || [],
                    practice: lesson.practice || [],
                  } as Prisma.InputJsonValue,
                  estimatedDuration: lesson.estimatedDurationMinutes || null,
                },
                update: {
                  title: lesson.label,
                  description: lesson.description || null,
                  topicContent: lessonContent,
                  difficulty: difficulty,
                  content: {
                    label: lesson.label,
                    href: lesson.href,
                    description: lesson.description,
                    estimatedDurationMinutes: lesson.estimatedDurationMinutes,
                    level: lesson.level,
                    keyTakeaways: lesson.keyTakeaways || [],
                    sections: lesson.sections || [],
                    checkpoints: lesson.checkpoints || [],
                    resources: lesson.resources || [],
                    practice: lesson.practice || [],
                  } as Prisma.InputJsonValue,
                  estimatedDuration: lesson.estimatedDurationMinutes || null,
                },
              });

              // Update module's relatedTopics array
              const courseId = 'course-dotnet-roadmap';
              const course = await tx.course.findUnique({
                where: { id: courseId },
              });

              if (course) {
                const currentContent = (course.content as any) || {};
                const currentModules = currentContent.modules || [];
                
                // Find the module - try exact match first
                let moduleIndex = currentModules.findIndex((m: any) => m.id === moduleData.moduleId);
                
                // If not found, try to find by prefix mapping (e.g., module-05-web-api -> module-05 or module-08)
                if (moduleIndex < 0) {
                  // Create a mapping function for module IDs
                  // Maps JSON module IDs to database module IDs
                  const moduleIdMapping: Record<string, string[]> = {
                    'module-01': ['module-01'], // .NET Core ve Yazılım Temellerine Giriş
                    'module-05': ['module-05'], // Console Applications maps to module-05
                    'module-05-web-api': ['module-08'], // Web API maps to module-08 (API Geliştirme)
                    'module-06-middleware': ['module-06'],
                    'module-07-auth': ['module-07'], // Authentication & Authorization
                    'module-07-mvc': ['module-07'], // MVC ve Razor Pages
                    'module-08-api': ['module-08'], // API Development maps to module-08
                    'module-08-logging': ['module-09'], // Logging maps to module-09
                    'module-09-configuration': ['module-09'],
                    'module-01-csharp': ['module-02'], // C# maps to module-02
                    'module-02-architecture': ['module-04'], // Architecture maps to module-04
                    'module-03-project-structure': ['module-04'], // Project structure maps to module-04
                    'module-04-aspnet-mvc': ['module-06'], // MVC maps to module-06
                  };
                  
                  const possibleIds = moduleIdMapping[moduleData.moduleId] || [];
                  for (const possibleId of possibleIds) {
                    moduleIndex = currentModules.findIndex((m: any) => m.id === possibleId);
                    if (moduleIndex >= 0) {
                      console.log(`Mapped module ID ${moduleData.moduleId} to ${possibleId}`);
                      break;
                    }
                  }
                  
                  // If still not found, try to find by matching prefix (e.g., module-05-web-api -> module-05)
                  if (moduleIndex < 0) {
                    const prefix = moduleData.moduleId.split('-').slice(0, 2).join('-'); // e.g., "module-05"
                    moduleIndex = currentModules.findIndex((m: any) => m.id === prefix);
                    if (moduleIndex >= 0) {
                      console.log(`Mapped module ID ${moduleData.moduleId} to ${prefix} by prefix`);
                    }
                  }
                }
                
                if (moduleIndex >= 0) {
                  const moduleItem = currentModules[moduleIndex];
                  const relatedTopics = moduleItem.relatedTopics || [];
                  
                  // Check if lesson already exists in relatedTopics
                  const lessonIndex = relatedTopics.findIndex((t: any) => t.href === lesson.href);
                  
                  if (lessonIndex >= 0) {
                    // Update existing lesson
                    relatedTopics[lessonIndex] = {
                      label: lesson.label,
                      href: lesson.href,
                      description: lesson.description,
                      estimatedDurationMinutes: lesson.estimatedDurationMinutes,
                      level: lesson.level,
                      keyTakeaways: lesson.keyTakeaways || [],
                      sections: lesson.sections || [],
                      checkpoints: lesson.checkpoints || [],
                      resources: lesson.resources || [],
                      practice: lesson.practice || [],
                    };
                  } else {
                    // Add new lesson
                    relatedTopics.push({
                      label: lesson.label,
                      href: lesson.href,
                      description: lesson.description,
                      estimatedDurationMinutes: lesson.estimatedDurationMinutes,
                      level: lesson.level,
                      keyTakeaways: lesson.keyTakeaways || [],
                      sections: lesson.sections || [],
                      checkpoints: lesson.checkpoints || [],
                      resources: lesson.resources || [],
                      practice: lesson.practice || [],
                    });
                  }
                  
                  // Update module
                  currentModules[moduleIndex] = {
                    ...moduleItem,
                    relatedTopics,
                  };
                  
                  // Update course
                  await tx.course.update({
                    where: { id: courseId },
                    data: {
                      content: {
                        ...currentContent,
                        modules: currentModules,
                      } as Prisma.InputJsonValue,
                    },
                  });
                } else {
                  console.warn(`Module ${moduleData.moduleId} not found in course modules. Lessons will still be created as individual courses.`);
                }
              }

              lessonsProcessed++;
            } catch (error: any) {
              const errorMsg = `Error processing lesson ${lesson.label}: ${error.message}`;
              console.error(errorMsg);
              errors.push(errorMsg);
            }
          }
        });
      } catch (error: any) {
        const errorMsg = `Error processing module ${moduleData.moduleId}: ${error.message}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    return {
      success: errors.length === 0,
      lessonsProcessed,
      errors,
    };
  } catch (error: any) {
    console.error('Error importing lesson contents:', error);
    return {
      success: false,
      lessonsProcessed,
      errors: [error.message || 'Unknown error'],
    };
  }
}

/**
 * Import topic lessons from JSON file
 */
export async function importTopicLessons(): Promise<{
  success: boolean;
  topicsProcessed: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let topicsProcessed = 0;

  try {
    const topicsFilePath = path.join(process.cwd(), 'data', 'topic-lessons', 'dotnet-core-topics.json');
    
    if (!fs.existsSync(topicsFilePath)) {
      return {
        success: false,
        topicsProcessed: 0,
        errors: ['Topic lessons JSON file not found'],
      };
    }

    const content = fs.readFileSync(topicsFilePath, 'utf-8');
    const data = JSON.parse(content);

    if (!data.modules || !Array.isArray(data.modules)) {
      return {
        success: false,
        topicsProcessed: 0,
        errors: ['Invalid JSON structure: modules array not found'],
      };
    }

    // Process each module
    for (const moduleData of data.modules) {
      if (!moduleData.moduleId || !moduleData.topics || !Array.isArray(moduleData.topics)) {
        console.warn(`Skipping invalid module: ${moduleData.moduleId || 'unknown'}`);
        continue;
      }

      try {
        await db.$transaction(async (tx) => {
          // Process each topic in the module
          for (const topic of moduleData.topics) {
            try {
              // Create topic ID from href
              const topicId = `topic-${topic.href.replace(/^\/education\/lessons\//, '').replace(/\//g, '-')}`;
              
              // Extract topic content title from label
              const topicContent = topic.label.replace(' Nedir?', '').replace(' Nasıl Kullanılır?', '');

              // Create course entry for this topic
              await tx.course.upsert({
                where: { id: topicId },
                create: {
                  id: topicId,
                  title: topic.label,
                  description: topic.description || null,
                  category: '.NET Core',
                  field: 'Backend',
                  topic: '.NET Core',
                  topicContent: topicContent,
                  difficulty: topic.level === 'Başlangıç' ? 'beginner' : topic.level === 'İleri' ? 'advanced' : 'intermediate',
                  content: {
                    label: topic.label,
                    href: topic.href,
                    description: topic.description,
                    estimatedDurationMinutes: topic.estimatedDurationMinutes,
                    level: topic.level,
                    keyTakeaways: topic.keyTakeaways || [],
                    sections: topic.sections || [],
                    checkpoints: topic.checkpoints || [],
                    resources: topic.resources || [],
                    practice: topic.practice || [],
                  } as Prisma.InputJsonValue,
                  estimatedDuration: topic.estimatedDurationMinutes || null,
                },
                update: {
                  title: topic.label,
                  description: topic.description || null,
                  topicContent: topicContent,
                  difficulty: topic.level === 'Başlangıç' ? 'beginner' : topic.level === 'İleri' ? 'advanced' : 'intermediate',
                  content: {
                    label: topic.label,
                    href: topic.href,
                    description: topic.description,
                    estimatedDurationMinutes: topic.estimatedDurationMinutes,
                    level: topic.level,
                    keyTakeaways: topic.keyTakeaways || [],
                    sections: topic.sections || [],
                    checkpoints: topic.checkpoints || [],
                    resources: topic.resources || [],
                    practice: topic.practice || [],
                  } as Prisma.InputJsonValue,
                  estimatedDuration: topic.estimatedDurationMinutes || null,
                },
              });

              // Update module's relatedTopics array
              const courseId = 'course-dotnet-roadmap';
              const course = await tx.course.findUnique({
                where: { id: courseId },
              });

              if (course) {
                const currentContent = (course.content as any) || {};
                const currentModules = currentContent.modules || [];
                
                // Find the module
                const moduleIndex = currentModules.findIndex((m: any) => m.id === moduleData.moduleId);
                
                if (moduleIndex >= 0) {
                  const moduleItem = currentModules[moduleIndex];
                  const relatedTopics = moduleItem.relatedTopics || [];
                  
                  // Check if topic already exists in relatedTopics
                  const topicIndex = relatedTopics.findIndex((t: any) => t.href === topic.href);
                  
                  if (topicIndex >= 0) {
                    // Update existing topic
                    relatedTopics[topicIndex] = {
                      label: topic.label,
                      href: topic.href,
                      description: topic.description,
                      estimatedDurationMinutes: topic.estimatedDurationMinutes,
                      level: topic.level,
                      keyTakeaways: topic.keyTakeaways || [],
                      sections: topic.sections || [],
                      checkpoints: topic.checkpoints || [],
                      resources: topic.resources || [],
                      practice: topic.practice || [],
                    };
                  } else {
                    // Add new topic
                    relatedTopics.push({
                      label: topic.label,
                      href: topic.href,
                      description: topic.description,
                      estimatedDurationMinutes: topic.estimatedDurationMinutes,
                      level: topic.level,
                      keyTakeaways: topic.keyTakeaways || [],
                      sections: topic.sections || [],
                      checkpoints: topic.checkpoints || [],
                      resources: topic.resources || [],
                      practice: topic.practice || [],
                    });
                  }
                  
                  // Update module
                  currentModules[moduleIndex] = {
                    ...moduleItem,
                    relatedTopics,
                  };
                  
                  // Update course
                  await tx.course.update({
                    where: { id: courseId },
                    data: {
                      content: {
                        ...currentContent,
                        modules: currentModules,
                      } as Prisma.InputJsonValue,
                    },
                  });
                }
              }

              topicsProcessed++;
            } catch (error: any) {
              const errorMsg = `Error processing topic ${topic.label}: ${error.message}`;
              console.error(errorMsg);
              errors.push(errorMsg);
            }
          }
        });
      } catch (error: any) {
        const errorMsg = `Error processing module ${moduleData.moduleId}: ${error.message}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    return {
      success: errors.length === 0,
      topicsProcessed,
      errors,
    };
  } catch (error: any) {
    console.error('Error importing topic lessons:', error);
    return {
      success: false,
      topicsProcessed,
      errors: [error.message || 'Unknown error'],
    };
  }
}

/**
 * Fill empty lesson contents and limit to 10 lessons per module
 */
export async function fillEmptyLessonContents(): Promise<{
  success: boolean;
  lessonsFilled: number;
  lessonsLimited: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let lessonsFilled = 0;
  let lessonsLimited = 0;

  try {
    // Load lesson contents from JSON
    const lessonsFilePath = path.join(process.cwd(), 'data', 'lesson-contents', 'dotnet-core-lessons.json');
    
    if (!fs.existsSync(lessonsFilePath)) {
      return {
        success: false,
        lessonsFilled: 0,
        lessonsLimited: 0,
        errors: ['Lesson contents JSON file not found'],
      };
    }

    const content = fs.readFileSync(lessonsFilePath, 'utf-8');
    const lessonsData = JSON.parse(content);

    if (!lessonsData.modules || !Array.isArray(lessonsData.modules)) {
      return {
        success: false,
        lessonsFilled: 0,
        lessonsLimited: 0,
        errors: ['Invalid JSON structure: modules array not found'],
      };
    }

    // Create a map of lessons by href for quick lookup
    const lessonsMap = new Map<string, any>();
    for (const moduleData of lessonsData.modules) {
      if (moduleData.lessons && Array.isArray(moduleData.lessons)) {
        for (const lesson of moduleData.lessons) {
          if (lesson.href) {
            lessonsMap.set(lesson.href, lesson);
          }
        }
      }
    }

    // Get the course-dotnet-roadmap
    const course = await db.course.findUnique({
      where: { id: 'course-dotnet-roadmap' },
    });

    if (!course || !course.content) {
      return {
        success: false,
        lessonsFilled: 0,
        lessonsLimited: 0,
        errors: ['course-dotnet-roadmap not found'],
      };
    }

    const currentContent = (course.content as any) || {};
    const currentModules = currentContent.modules || [];

    await db.$transaction(async (tx) => {
      // Process each module
      for (let moduleIndex = 0; moduleIndex < currentModules.length; moduleIndex++) {
        const moduleItem = currentModules[moduleIndex];
        if (!moduleItem || typeof moduleItem !== "object") {
          continue;
        }

        let relatedTopics = Array.isArray(moduleItem.relatedTopics) ? moduleItem.relatedTopics : [];
        const originalCount = relatedTopics.length;

        // Limit to 10 lessons if more than 10
        if (relatedTopics.length > 10) {
          relatedTopics = relatedTopics.slice(0, 10);
          if (originalCount > 10) {
            lessonsLimited++;
          }
        }

        // Process each lesson in the module
        for (let topicIndex = 0; topicIndex < relatedTopics.length; topicIndex++) {
          const topic = relatedTopics[topicIndex];
          if (!topic || typeof topic !== "object" || !topic.href) {
            continue;
          }

          try {
            // Check if lesson content is empty
            const hasSections = Array.isArray(topic.sections) && topic.sections.length > 0;
            const hasCheckpoints = Array.isArray(topic.checkpoints) && topic.checkpoints.length > 0;
            const hasResources = Array.isArray(topic.resources) && topic.resources.length > 0;
            const hasPractice = Array.isArray(topic.practice) && topic.practice.length > 0;
            const hasKeyTakeaways = Array.isArray(topic.keyTakeaways) && topic.keyTakeaways.length > 0;

            const isEmpty = !hasSections && !hasCheckpoints && !hasResources && !hasPractice;

            if (isEmpty) {
              // Try to find matching lesson in JSON
              const matchingLesson = lessonsMap.get(topic.href);

              if (matchingLesson) {
                // Update topic with content from JSON
                relatedTopics[topicIndex] = {
                  ...topic,
                  sections: matchingLesson.sections || topic.sections || [],
                  checkpoints: matchingLesson.checkpoints || topic.checkpoints || [],
                  resources: matchingLesson.resources || topic.resources || [],
                  practice: matchingLesson.practice || topic.practice || [],
                  keyTakeaways: matchingLesson.keyTakeaways || topic.keyTakeaways || [],
                };

                // Update individual course record if it exists
                const lessonId = `lesson-${topic.href.replace(/^\/education\/lessons\//, '').replace(/\//g, '-')}`;
                const topicId = `topic-${topic.href.replace(/^\/education\/lessons\//, '').replace(/\//g, '-')}`;

                await tx.course.updateMany({
                  where: {
                    OR: [
                      { id: lessonId },
                      { id: topicId },
                    ],
                  },
                  data: {
                    content: {
                      label: matchingLesson.label || topic.label,
                      href: topic.href,
                      description: matchingLesson.description || topic.description,
                      estimatedDurationMinutes: matchingLesson.estimatedDurationMinutes || topic.estimatedDurationMinutes,
                      level: matchingLesson.level || topic.level,
                      keyTakeaways: matchingLesson.keyTakeaways || [],
                      sections: matchingLesson.sections || [],
                      checkpoints: matchingLesson.checkpoints || [],
                      resources: matchingLesson.resources || [],
                      practice: matchingLesson.practice || [],
                    } as Prisma.InputJsonValue,
                  },
                });

                lessonsFilled++;
              }
            }
          } catch (error: any) {
            const errorMsg = `Error processing lesson ${topic.label || topic.href}: ${error.message}`;
            console.error(errorMsg);
            errors.push(errorMsg);
          }
        }

        // Update module with limited and filled relatedTopics
        currentModules[moduleIndex] = {
          ...moduleItem,
          relatedTopics,
        };
      }

      // Update course
      await tx.course.update({
        where: { id: 'course-dotnet-roadmap' },
        data: {
          content: {
            ...currentContent,
            modules: currentModules,
          } as Prisma.InputJsonValue,
        },
      });
    });

    return {
      success: errors.length === 0,
      lessonsFilled,
      lessonsLimited,
      errors,
    };
  } catch (error: any) {
    console.error('Error filling lesson contents:', error);
    return {
      success: false,
      lessonsFilled,
      lessonsLimited,
      errors: [error.message || 'Unknown error'],
    };
  }
}

/**
 * Create Net Core Roadmap structure with 15 modules and their lesson lists
 */
export async function createNetCoreRoadmapStructure(): Promise<{
  success: boolean;
  modulesCreated: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let modulesCreated = 0;

  try {
    // Define all 15 modules with their lessons
    const modules = [
      {
        id: 'module-01',
        title: '.NET Core ve Yazılım Temellerine Giriş',
        summary: '.NET Core ekosistemine giriş yaparak yazılım geliştirme temellerini öğrenin. SDK kurulumundan ilk uygulamanıza kadar tüm adımları kapsayan kapsamlı bir başlangıç modülü.',
        lessons: [
          { label: 'Yazılım Nedir ve Neden Önemlidir?', href: '/education/lessons/net-core-basics/software-introduction' },
          { label: 'Uygulama Türleri (Web, Mobil, Masaüstü, API)', href: '/education/lessons/net-core-basics/application-types' },
          { label: '.NET Ekosistemine Genel Bakış', href: '/education/lessons/net-core-basics/dotnet-ecosystem' },
          { label: '.NET Framework, .NET Core ve .NET (Unified) Farkları', href: '/education/lessons/net-core-basics/dotnet-versions' },
          { label: 'CLR, BCL, CLI Kavramları', href: '/education/lessons/net-core-basics/clr-bcl-cli' },
          { label: 'SDK ve Runtime Kavramları', href: '/education/lessons/net-core-basics/sdk-runtime' },
          { label: 'Cross-Platform Geliştirme Mantığı', href: '/education/lessons/net-core-basics/cross-platform' },
          { label: '.NET Core\'un Mimari Yapısı', href: '/education/lessons/net-core-basics/architecture' },
          { label: 'Visual Studio ve VS Code Tanıtımı', href: '/education/lessons/net-core-basics/ide-introduction' },
          { label: 'dotnet CLI (Komut Satırı Aracı) Kullanımı', href: '/education/lessons/net-core-basics/dotnet-cli' },
          { label: 'İlk Uygulama: "Hello World"', href: '/education/lessons/net-core-basics/hello-world' },
          { label: 'Proje Klasör Yapısının İncelenmesi', href: '/education/lessons/net-core-basics/project-structure' },
          { label: 'Derleme ve Çalıştırma Süreci', href: '/education/lessons/net-core-basics/build-run' },
          { label: 'NuGet Paket Sistemi Nedir?', href: '/education/lessons/net-core-basics/nuget-intro' },
          { label: 'Paket Ekleme, Güncelleme, Kaldırma İşlemleri', href: '/education/lessons/net-core-basics/nuget-operations' },
          { label: 'Debugging ve Run-Time Kavramı', href: '/education/lessons/net-core-basics/debugging' },
          { label: '.NET CLI ile Versiyon Yönetimi', href: '/education/lessons/net-core-basics/version-management' },
          { label: 'Kodlama Standartlarına Giriş', href: '/education/lessons/net-core-basics/coding-standards' },
          { label: 'Kod Düzeni ve Naming Convention\'lar', href: '/education/lessons/net-core-basics/naming-conventions' },
          { label: 'Geliştirici Ortamı Kurulumu (SDK, IDE, Git)', href: '/education/lessons/net-core-basics/environment-setup' },
        ],
      },
      {
        id: 'module-02',
        title: 'C# Programlama Diline Giriş ve Temeller',
        summary: 'C# programlama dilinin temel yapılarını, sözdizimini ve temel programlama kavramlarını öğrenin. Değişkenlerden döngülere, exception handling\'den koleksiyonlara kadar geniş bir yelpazede C# temellerini kavrayın.',
        lessons: [
          { label: 'C# Tarihçesi ve .NET ile İlişkisi', href: '/education/lessons/csharp-basics/csharp-history' },
          { label: 'C# Söz Dizimi (Syntax) Temelleri', href: '/education/lessons/csharp-basics/syntax' },
          { label: 'Değişkenler ve Veri Tipleri', href: '/education/lessons/csharp-basics/variables-types' },
          { label: 'Sabitler ve Tür Dönüşümleri', href: '/education/lessons/csharp-basics/constants-conversions' },
          { label: 'Operatörler (Aritmetik, Mantıksal, Karşılaştırma)', href: '/education/lessons/csharp-basics/operators' },
          { label: 'Koşul Yapıları (if, else, switch)', href: '/education/lessons/csharp-basics/conditionals' },
          { label: 'Döngüler (for, while, foreach, do-while)', href: '/education/lessons/csharp-basics/loops' },
          { label: 'Diziler ve Koleksiyonlar', href: '/education/lessons/csharp-basics/arrays-collections' },
          { label: 'Metotlar ve Parametreler', href: '/education/lessons/csharp-basics/methods' },
          { label: 'Değer ve Referans Tipleri', href: '/education/lessons/csharp-basics/value-reference-types' },
          { label: 'Scope Kavramı', href: '/education/lessons/csharp-basics/scope' },
          { label: 'String İşlemleri ve Manipülasyonlar', href: '/education/lessons/csharp-basics/strings' },
          { label: 'Random, Math, DateTime Sınıfları', href: '/education/lessons/csharp-basics/utility-classes' },
          { label: 'Exception Handling Temelleri', href: '/education/lessons/csharp-basics/exceptions' },
          { label: 'Try, Catch, Finally Kullanımı', href: '/education/lessons/csharp-basics/try-catch' },
          { label: 'Namespaces ve Assembly Kavramı', href: '/education/lessons/csharp-basics/namespaces' },
          { label: 'Console Girdi/Çıktı Yönetimi', href: '/education/lessons/csharp-basics/console-io' },
          { label: 'Comment, Region ve Kod Düzeni', href: '/education/lessons/csharp-basics/code-organization' },
          { label: 'Kodun Derlenme Aşamaları', href: '/education/lessons/csharp-basics/compilation' },
          { label: 'Basit Mini Proje: Konsol Hesap Makinesi', href: '/education/lessons/csharp-basics/calculator-project' },
        ],
      },
      {
        id: 'module-03',
        title: 'Nesne Yönelimli Programlama (OOP) ve C# İleri Konular',
        summary: 'Nesne yönelimli programlama prensiplerini derinlemesine öğrenin. Class, inheritance, polymorphism, interface gibi OOP kavramlarının yanı sıra LINQ, generics, delegates ve async/await gibi ileri seviye C# özelliklerini keşfedin.',
        lessons: [
          { label: 'Class ve Object Kavramları', href: '/education/lessons/oop/class-object' },
          { label: 'Field, Property ve Method Tanımlama', href: '/education/lessons/oop/members' },
          { label: 'Constructor ve Destructor Kullanımı', href: '/education/lessons/oop/constructors' },
          { label: 'Encapsulation (Kapsülleme)', href: '/education/lessons/oop/encapsulation' },
          { label: 'Inheritance (Kalıtım)', href: '/education/lessons/oop/inheritance' },
          { label: 'Polymorphism (Çok Biçimlilik)', href: '/education/lessons/oop/polymorphism' },
          { label: 'Abstraction (Soyutlama)', href: '/education/lessons/oop/abstraction' },
          { label: 'Interface Kavramı ve Kullanımı', href: '/education/lessons/oop/interfaces' },
          { label: 'Abstract Class vs Interface Farkları', href: '/education/lessons/oop/abstract-vs-interface' },
          { label: 'Static Class ve Member\'lar', href: '/education/lessons/oop/static' },
          { label: 'Partial Class ve Record Türleri', href: '/education/lessons/oop/partial-record' },
          { label: 'Generic Tipler ve Koleksiyonlar', href: '/education/lessons/oop/generics' },
          { label: 'Delegate ve Event Yapısı', href: '/education/lessons/oop/delegates-events' },
          { label: 'Lambda Expressions', href: '/education/lessons/oop/lambda' },
          { label: 'LINQ Temelleri', href: '/education/lessons/oop/linq' },
          { label: 'Expression vs Statement Syntax', href: '/education/lessons/oop/linq-syntax' },
          { label: 'Extension Methods', href: '/education/lessons/oop/extension-methods' },
          { label: 'Enum, Struct, Tuple Kullanımı', href: '/education/lessons/oop/enum-struct-tuple' },
          { label: 'Reflection Kavramına Giriş', href: '/education/lessons/oop/reflection' },
          { label: 'Async/Await ile Asenkron Programlama', href: '/education/lessons/oop/async-await' },
        ],
      },
      {
        id: 'module-04',
        title: '.NET Core Yapısı ve Proje Mimarisi Temelleri',
        summary: '.NET Core uygulamalarının mimari yapısını ve best practice\'leri öğrenin. Dependency Injection, middleware, configuration yönetimi ve katmanlı mimari gibi profesyonel geliştirme tekniklerini uygulayın.',
        lessons: [
          { label: 'Katmanlı Mimari Nedir?', href: '/education/lessons/architecture/layered-architecture' },
          { label: 'Solution ve Project Organizasyonu', href: '/education/lessons/architecture/solution-structure' },
          { label: 'Clean Architecture Temelleri', href: '/education/lessons/architecture/clean-architecture' },
          { label: 'Dependency Injection (DI) Prensipleri', href: '/education/lessons/architecture/dependency-injection' },
          { label: 'Service ve Repository Pattern', href: '/education/lessons/architecture/patterns' },
          { label: 'Configuration Yönetimi (appsettings.json)', href: '/education/lessons/architecture/configuration' },
          { label: 'Logging Mekanizmasına Giriş', href: '/education/lessons/architecture/logging' },
          { label: 'Startup.cs / Program.cs Yapısı', href: '/education/lessons/architecture/startup' },
          { label: 'IHost ve IWebHost Kavramı', href: '/education/lessons/architecture/host' },
          { label: 'Environment Bazlı Yapılandırma', href: '/education/lessons/architecture/environments' },
          { label: 'Middleware Nedir, Ne İşe Yarar?', href: '/education/lessons/architecture/middleware-intro' },
          { label: 'Pipeline (Request/Response) Yapısı', href: '/education/lessons/architecture/pipeline' },
          { label: 'Dependency Lifetimes (Transient, Scoped, Singleton)', href: '/education/lessons/architecture/lifetimes' },
          { label: 'Interface\'lerle Bağımlılık Yönetimi', href: '/education/lessons/architecture/interface-dependency' },
          { label: 'Exception Middleware Geliştirme', href: '/education/lessons/architecture/exception-middleware' },
          { label: 'Service Collection ve Configuration Bindings', href: '/education/lessons/architecture/service-collection' },
          { label: 'Options Pattern Kullanımı', href: '/education/lessons/architecture/options-pattern' },
          { label: 'Best Practice: Katmanlı Uygulama Kurulumu', href: '/education/lessons/architecture/best-practices' },
          { label: 'SOLID Prensiplerine Giriş', href: '/education/lessons/architecture/solid' },
          { label: 'Demo: Basit Katmanlı Mimari Örneği', href: '/education/lessons/architecture/demo' },
        ],
      },
      {
        id: 'module-05',
        title: 'Konsol Uygulamaları ile Uygulamalı .NET Core',
        summary: 'Konsol uygulamaları geliştirerek .NET Core\'u pratikte uygulayın. Dosya işlemleri, JSON/XML işleme, logging, dependency injection ve unit testing gibi gerçek dünya senaryolarını öğrenin.',
        lessons: [
          { label: 'Console Project Yapısı', href: '/education/lessons/console-apps/project-structure' },
          { label: 'Girdi / Çıktı Yönetimi', href: '/education/lessons/console-apps/input-output' },
          { label: 'Menü Bazlı Uygulama Geliştirme', href: '/education/lessons/console-apps/menu-based' },
          { label: 'Dosya Okuma (StreamReader)', href: '/education/lessons/console-apps/file-reading' },
          { label: 'Dosya Yazma (StreamWriter)', href: '/education/lessons/console-apps/file-writing' },
          { label: 'JSON Dosya İşlemleri', href: '/education/lessons/console-apps/json-files' },
          { label: 'XML Dosya İşlemleri', href: '/education/lessons/console-apps/xml-files' },
          { label: 'Exception Handling Pratikleri', href: '/education/lessons/console-apps/exception-handling' },
          { label: 'Interface ve Class Uygulamaları', href: '/education/lessons/console-apps/interfaces-classes' },
          { label: 'Logging Uygulaması', href: '/education/lessons/console-apps/logging' },
          { label: 'Dependency Injection Kullanımı', href: '/education/lessons/console-apps/dependency-injection' },
          { label: 'Data Validation Mekanizması', href: '/education/lessons/console-apps/data-validation' },
          { label: 'Enum ve Struct Kullanım Senaryoları', href: '/education/lessons/console-apps/enum-struct' },
          { label: 'Basit CRUD İşlemleri', href: '/education/lessons/console-apps/crud-operations' },
          { label: 'SeriLog ile Loglama', href: '/education/lessons/console-apps/serilog' },
          { label: 'Unit Test ile Fonksiyon Testi', href: '/education/lessons/console-apps/unit-testing' },
          { label: 'CLI Argümanları ile Dinamik Çalışma', href: '/education/lessons/console-apps/cli-arguments' },
          { label: 'Timer ve Thread Kullanımı', href: '/education/lessons/console-apps/timer-thread' },
          { label: 'JSON Serialize / Deserialize İşlemleri', href: '/education/lessons/console-apps/json-serialize' },
          { label: 'Mini Proje: Kütüphane Yönetim Sistemi', href: '/education/lessons/console-apps/library-management' },
        ],
      },
      {
        id: 'module-06',
        title: 'ASP.NET Core ile Web Geliştirmeye Giriş',
        lessons: [
          { label: 'HTTP Protokolü ve Web Mantığı', href: '/education/lessons/aspnet-core/http-protocol' },
          { label: 'ASP.NET Core Web Projesi Kurulumu', href: '/education/lessons/aspnet-core/project-setup' },
          { label: 'Middleware Kavramı', href: '/education/lessons/aspnet-core/middleware' },
          { label: 'Routing ve Endpoint Yönetimi', href: '/education/lessons/aspnet-core/routing' },
          { label: 'Controller ve Action Yapısı', href: '/education/lessons/aspnet-core/controllers' },
          { label: 'Request & Response Yaşam Döngüsü', href: '/education/lessons/aspnet-core/request-response' },
          { label: 'Dependency Injection Kullanımı', href: '/education/lessons/aspnet-core/dependency-injection' },
          { label: 'Model Binding Temelleri', href: '/education/lessons/aspnet-core/model-binding' },
          { label: 'View Yapısı ve Razor Syntax', href: '/education/lessons/aspnet-core/views-razor' },
          { label: 'Layout, Partial View, Section Kavramları', href: '/education/lessons/aspnet-core/layout-partial' },
          { label: 'Static Files ve Content Servisi', href: '/education/lessons/aspnet-core/static-files' },
          { label: 'ViewData, ViewBag, TempData Kullanımı', href: '/education/lessons/aspnet-core/viewdata-viewbag' },
          { label: 'Validation (DataAnnotations)', href: '/education/lessons/aspnet-core/validation' },
          { label: 'Form İşlemleri (GET/POST)', href: '/education/lessons/aspnet-core/forms' },
          { label: 'TagHelper Kullanımı', href: '/education/lessons/aspnet-core/tag-helpers' },
          { label: 'Session ve Cookie Yönetimi', href: '/education/lessons/aspnet-core/session-cookie' },
          { label: 'Custom Middleware Geliştirme', href: '/education/lessons/aspnet-core/custom-middleware' },
          { label: 'Hata Sayfaları ve Error Handling', href: '/education/lessons/aspnet-core/error-handling' },
          { label: 'Logging ve Exception Middleware', href: '/education/lessons/aspnet-core/logging-exception' },
          { label: 'Mini MVC Uygulaması', href: '/education/lessons/aspnet-core/mini-mvc-app' },
        ],
      },
      {
        id: 'module-07',
        title: 'MVC ve Razor Pages Yapısı',
        summary: 'MVC tasarım desenini ve Razor Pages yapısını öğrenin. Model binding, view components, validation ve form işlemleri gibi web geliştirmenin kritik konularını uygulayın.',
        lessons: [
          { label: 'MVC Tasarım Deseninin Mantığı', href: '/education/lessons/mvc-razor/mvc-pattern' },
          { label: 'Controller, Model ve View İlişkisi', href: '/education/lessons/mvc-razor/controller-model-view' },
          { label: 'Model Binding ve Validation', href: '/education/lessons/mvc-razor/model-binding' },
          { label: 'ViewModel ve DTO Kullanımı', href: '/education/lessons/mvc-razor/viewmodel-dto' },
          { label: 'Form İşlemleri (GET/POST)', href: '/education/lessons/mvc-razor/forms' },
          { label: 'Partial View, Layout, Section Kullanımı', href: '/education/lessons/mvc-razor/partial-layout' },
          { label: 'Razor Syntax Derinlemesine', href: '/education/lessons/mvc-razor/razor-syntax' },
          { label: 'TagHelper Özelleştirmeleri', href: '/education/lessons/mvc-razor/tag-helpers' },
          { label: 'ViewComponent Kavramı', href: '/education/lessons/mvc-razor/view-components' },
          { label: 'ActionResult Türleri (Json, File, Redirect, View)', href: '/education/lessons/mvc-razor/action-results' },
          { label: 'TempData, ViewData ve ViewBag Farkları', href: '/education/lessons/mvc-razor/tempdata-viewdata' },
          { label: 'Custom Validation Attributes', href: '/education/lessons/mvc-razor/custom-validation' },
          { label: 'Data Annotation Kullanımı', href: '/education/lessons/mvc-razor/data-annotations' },
          { label: 'ModelState ve Error Handling', href: '/education/lessons/mvc-razor/modelstate' },
          { label: 'File Upload / Download İşlemleri', href: '/education/lessons/mvc-razor/file-operations' },
          { label: 'Session, Cookie ve State Yönetimi', href: '/education/lessons/mvc-razor/session-cookie' },
          { label: 'Route Attributes ile Custom Routing', href: '/education/lessons/mvc-razor/route-attributes' },
          { label: 'HTML Helpers Kullanımı', href: '/education/lessons/mvc-razor/html-helpers' },
          { label: 'Localization (Çoklu Dil Desteği)', href: '/education/lessons/mvc-razor/localization' },
          { label: 'MVC Üzerinde CRUD Uygulaması', href: '/education/lessons/mvc-razor/crud-app' },
        ],
      },
      {
        id: 'module-08',
        title: 'API Geliştirme (RESTful API – Minimal API / Controller Based)',
        summary: 'RESTful API geliştirme tekniklerini öğrenin. Controller-based ve Minimal API yaklaşımlarını kullanarak modern web servisleri oluşturun. Swagger, versioning ve authentication gibi profesyonel API geliştirme pratiklerini uygulayın.',
        lessons: [
          { label: 'API Kavramına Giriş', href: '/education/lessons/api-development/api-intro' },
          { label: 'RESTful Servislerin Temel İlkeleri', href: '/education/lessons/api-development/restful-principles' },
          { label: 'Web API Projesi Oluşturma', href: '/education/lessons/api-development/project-setup' },
          { label: 'Controller Based API Yapısı', href: '/education/lessons/api-development/controller-based' },
          { label: 'Minimal API Yapısına Giriş', href: '/education/lessons/api-development/minimal-api' },
          { label: 'Routing, Attributes ve Action Tanımlama', href: '/education/lessons/api-development/routing-attributes' },
          { label: 'HTTP Metotları (GET, POST, PUT, DELETE)', href: '/education/lessons/api-development/http-methods' },
          { label: 'Model Validation ve Error Handling', href: '/education/lessons/api-development/validation-error' },
          { label: 'Request-Response Formatları (JSON, XML)', href: '/education/lessons/api-development/formats' },
          { label: 'Swagger ve OpenAPI Dokümantasyonu', href: '/education/lessons/api-development/swagger' },
          { label: 'Versioning Uygulamaları', href: '/education/lessons/api-development/versioning' },
          { label: 'DTO ve Mapping (AutoMapper Kullanımı)', href: '/education/lessons/api-development/dto-mapping' },
          { label: 'Response Wrapper ve Global Response Model', href: '/education/lessons/api-development/response-wrapper' },
          { label: 'Exception Middleware ile API Hata Yönetimi', href: '/education/lessons/api-development/exception-middleware' },
          { label: 'Rate Limiting ve CORS Yapılandırması', href: '/education/lessons/api-development/rate-limiting-cors' },
          { label: 'Authentication & Authorization Uygulamaları', href: '/education/lessons/api-development/auth-authorization' },
          { label: 'JWT Token Oluşturma ve Kullanımı', href: '/education/lessons/api-development/jwt-tokens' },
          { label: 'API Testi (Postman / Swagger / Integration Test)', href: '/education/lessons/api-development/api-testing' },
          { label: 'API Performans ve Caching Stratejileri', href: '/education/lessons/api-development/api-performance' },
          { label: 'Mini RESTful API Projesi', href: '/education/lessons/api-development/mini-api-project' },
        ],
      },
      {
        id: 'module-09',
        title: 'Veri Erişimi ve Kütüphaneler (EF Core, Identity, SignalR vb.)',
        summary: 'Entity Framework Core ile veri erişim katmanı geliştirmeyi öğrenin. ASP.NET Core Identity, SignalR ve diğer önemli kütüphaneleri kullanarak güçlü uygulamalar oluşturun.',
        lessons: [
          { label: 'Veri Erişim Katmanına Giriş', href: '/education/lessons/data-access/intro' },
          { label: 'Entity Framework Core Nedir?', href: '/education/lessons/data-access/ef-core-intro' },
          { label: 'DbContext ve DbSet Yapısı', href: '/education/lessons/data-access/dbcontext-dbset' },
          { label: 'Migration Oluşturma ve Yönetimi', href: '/education/lessons/data-access/migrations' },
          { label: 'Code-First Yaklaşımı', href: '/education/lessons/data-access/code-first' },
          { label: 'Database-First Yaklaşımı', href: '/education/lessons/data-access/database-first' },
          { label: 'LINQ Sorgulama Teknikleri', href: '/education/lessons/data-access/linq-queries' },
          { label: 'Eager, Lazy ve Explicit Loading', href: '/education/lessons/data-access/loading-strategies' },
          { label: 'Repository Pattern Uygulaması', href: '/education/lessons/data-access/repository-pattern' },
          { label: 'Unit of Work Deseni', href: '/education/lessons/data-access/unit-of-work' },
          { label: 'ASP.NET Core Identity Temelleri', href: '/education/lessons/data-access/identity-basics' },
          { label: 'Kullanıcı Kaydı, Login ve Logout İşlemleri', href: '/education/lessons/data-access/user-management' },
          { label: 'Role-Based Authorization', href: '/education/lessons/data-access/role-authorization' },
          { label: 'JWT Authentication ile Güvenli API', href: '/education/lessons/data-access/jwt-auth' },
          { label: 'SignalR ile Gerçek Zamanlı Haberleşme', href: '/education/lessons/data-access/signalr' },
          { label: 'Cache Yönetimi (MemoryCache / DistributedCache)', href: '/education/lessons/data-access/cache-management' },
          { label: 'Redis Entegrasyonu', href: '/education/lessons/data-access/redis' },
          { label: 'Üçüncü Parti Kütüphanelerle Çalışmak (Dapper, FluentValidation vb.)', href: '/education/lessons/data-access/third-party-libs' },
          { label: 'EF Core Performans İyileştirmeleri', href: '/education/lessons/data-access/ef-performance' },
          { label: 'Veri Katmanlı Demo Proje', href: '/education/lessons/data-access/demo-project' },
        ],
      },
      {
        id: 'module-10',
        title: 'Performans, Optimizasyon ve Logging',
        summary: 'Uygulama performansını ölçmeyi, optimize etmeyi ve profesyonel logging tekniklerini öğrenin. Benchmarking, caching stratejileri, memory yönetimi ve diagnostic tools kullanımını uygulayın.',
        lessons: [
          { label: 'Performans Ölçüm Kavramı', href: '/education/lessons/performance/perf-measurement' },
          { label: 'Benchmarking Teknikleri', href: '/education/lessons/performance/benchmarking' },
          { label: 'Asenkron Programlama (Async / Await)', href: '/education/lessons/performance/async-await' },
          { label: 'Threading ve Paralel Çalışma', href: '/education/lessons/performance/threading-parallel' },
          { label: 'Memory Yönetimi', href: '/education/lessons/performance/memory-management' },
          { label: 'Garbage Collector ve Optimizasyon', href: '/education/lessons/performance/gc-optimization' },
          { label: 'Caching Stratejileri', href: '/education/lessons/performance/caching-strategies' },
          { label: 'OutputCache, ResponseCache Kullanımı', href: '/education/lessons/performance/output-cache' },
          { label: 'Loglama Framework\'leri (Serilog, NLog, ILogger)', href: '/education/lessons/performance/logging-frameworks' },
          { label: 'Exception Yönetimi ve İzleme', href: '/education/lessons/performance/exception-tracking' },
          { label: 'Diagnostic Tools Kullanımı', href: '/education/lessons/performance/diagnostic-tools' },
          { label: 'Performance Counter Kavramı', href: '/education/lessons/performance/performance-counters' },
          { label: 'API Performans Testleri', href: '/education/lessons/performance/api-tests' },
          { label: 'DB Performans İyileştirmeleri', href: '/education/lessons/performance/db-optimization' },
          { label: 'Query Optimization', href: '/education/lessons/performance/query-optimization' },
          { label: 'Health Check Entegrasyonu', href: '/education/lessons/performance/health-checks' },
          { label: 'Application Insights / Telemetry', href: '/education/lessons/performance/application-insights' },
          { label: 'Lazy Loading ve Task Optimizasyonu', href: '/education/lessons/performance/lazy-loading' },
          { label: 'Load / Stress Testleri (JMeter / k6)', href: '/education/lessons/performance/load-tests' },
          { label: 'Uygulama İzleme ve Raporlama', href: '/education/lessons/performance/monitoring-reporting' },
        ],
      },
      {
        id: 'module-11',
        title: 'Test, Debugging ve CI/CD Entegrasyonları',
        summary: 'Test odaklı geliştirme (TDD), unit ve integration testleri, debugging teknikleri ve CI/CD pipeline\'larını öğrenin. GitHub Actions ve Azure DevOps ile otomatik build, test ve deploy süreçlerini kurun.',
        lessons: [
          { label: 'Test Türleri (Unit, Integration, System, UI)', href: '/education/lessons/testing/test-types' },
          { label: 'Test Odaklı Geliştirme (TDD)', href: '/education/lessons/testing/tdd' },
          { label: 'xUnit, NUnit ve MSTest Karşılaştırması', href: '/education/lessons/testing/test-frameworks' },
          { label: 'Unit Test Projesi Kurulumu', href: '/education/lessons/testing/unit-test-setup' },
          { label: 'Mocking Frameworkleri (Moq, NSubstitute)', href: '/education/lessons/testing/mocking' },
          { label: 'Dependency Injection ile Test Edilebilirlik', href: '/education/lessons/testing/di-testing' },
          { label: 'Integration Test Senaryoları', href: '/education/lessons/testing/integration-tests' },
          { label: 'Test Data Hazırlama (InMemory DB)', href: '/education/lessons/testing/test-data' },
          { label: 'Test Coverage Ölçümü', href: '/education/lessons/testing/test-coverage' },
          { label: 'Kod Kalitesi Analizi (SonarQube, Coverlet)', href: '/education/lessons/testing/code-quality' },
          { label: 'Debugging Teknikleri', href: '/education/lessons/testing/debugging' },
          { label: 'Breakpoint ve Watch Kullanımı', href: '/education/lessons/testing/breakpoints' },
          { label: 'Exception İzleme ve StackTrace', href: '/education/lessons/testing/exception-tracking' },
          { label: 'Git Versiyon Kontrol Temelleri', href: '/education/lessons/testing/git-basics' },
          { label: 'Branching Stratejileri', href: '/education/lessons/testing/branching' },
          { label: 'CI/CD Kavramına Giriş', href: '/education/lessons/testing/cicd-intro' },
          { label: 'GitHub Actions Pipeline Kurulumu', href: '/education/lessons/testing/github-actions' },
          { label: 'Azure DevOps Pipeline Örneği', href: '/education/lessons/testing/azure-devops' },
          { label: 'Build, Test ve Deploy Otomasyonu', href: '/education/lessons/testing/automation' },
          { label: 'Test Raporlama ve Log Analizi', href: '/education/lessons/testing/reporting' },
        ],
      },
      {
        id: 'module-12',
        title: 'Dağıtık Sistemler ve Microservice Mimarisi',
        summary: 'Microservice mimarisini ve dağıtık sistem tasarımını öğrenin. Docker, API Gateway, message broker, service discovery ve circuit breaker pattern gibi modern mimari desenleri uygulayın.',
        lessons: [
          { label: 'Monolith vs Microservice Kavramı', href: '/education/lessons/microservices/monolith-vs-microservice' },
          { label: 'Microservice Avantajları ve Zorlukları', href: '/education/lessons/microservices/advantages-challenges' },
          { label: 'Domain-Driven Design (DDD) Temelleri', href: '/education/lessons/microservices/ddd' },
          { label: 'Service Discovery (Consul, Eureka)', href: '/education/lessons/microservices/service-discovery' },
          { label: 'API Gateway (Ocelot) Kullanımı', href: '/education/lessons/microservices/api-gateway' },
          { label: 'Event-Driven Architecture', href: '/education/lessons/microservices/event-driven' },
          { label: 'Message Broker (RabbitMQ, Kafka)', href: '/education/lessons/microservices/message-broker' },
          { label: 'gRPC ile Servisler Arası İletişim', href: '/education/lessons/microservices/grpc' },
          { label: 'Saga Pattern ve Transaction Yönetimi', href: '/education/lessons/microservices/saga-pattern' },
          { label: 'Configuration Management', href: '/education/lessons/microservices/configuration' },
          { label: 'Docker ile Containerization', href: '/education/lessons/microservices/docker' },
          { label: 'Docker Compose Kullanımı', href: '/education/lessons/microservices/docker-compose' },
          { label: 'Distributed Cache Yönetimi', href: '/education/lessons/microservices/distributed-cache' },
          { label: 'Circuit Breaker Pattern (Polly)', href: '/education/lessons/microservices/circuit-breaker' },
          { label: 'Observability: Logging, Metrics, Tracing', href: '/education/lessons/microservices/observability' },
          { label: 'Health Checks ve Self-Healing Sistemler', href: '/education/lessons/microservices/health-checks' },
          { label: 'Scaling Stratejileri', href: '/education/lessons/microservices/scaling' },
          { label: 'Monitoring (Prometheus, Grafana)', href: '/education/lessons/microservices/monitoring' },
          { label: 'Microservice Güvenliği', href: '/education/lessons/microservices/security' },
          { label: 'Örnek Microservice Mimari Proje', href: '/education/lessons/microservices/example-project' },
        ],
      },
      {
        id: 'module-13',
        title: 'Güvenlik, Versiyonlama ve Sürdürülebilir Kodlama',
        summary: 'Uygulama güvenliği, authentication/authorization, OAuth2, JWT token yönetimi ve güvenli kodlama standartlarını öğrenin. SQL injection, XSS, CSRF gibi güvenlik açıklarını önleme tekniklerini uygulayın.',
        lessons: [
          { label: 'Güvenlik Katmanları ve Riskler', href: '/education/lessons/security/security-layers' },
          { label: 'Kimlik Doğrulama (Authentication)', href: '/education/lessons/security/authentication' },
          { label: 'Yetkilendirme (Authorization)', href: '/education/lessons/security/authorization' },
          { label: 'Claims ve Roles Kavramı', href: '/education/lessons/security/claims-roles' },
          { label: 'API Key Yönetimi', href: '/education/lessons/security/api-keys' },
          { label: 'OAuth2 ve OpenID Connect', href: '/education/lessons/security/oauth2' },
          { label: 'JWT Token Yönetimi', href: '/education/lessons/security/jwt-management' },
          { label: 'SQL Injection Önleme', href: '/education/lessons/security/sql-injection' },
          { label: 'XSS, CSRF ve Clickjacking Koruması', href: '/education/lessons/security/xss-csrf' },
          { label: 'HTTPS ve SSL Zorunluluğu', href: '/education/lessons/security/https-ssl' },
          { label: 'Güvenli Şifreleme (Hashing, Salt)', href: '/education/lessons/security/encryption' },
          { label: 'Veri Gizliliği (GDPR)', href: '/education/lessons/security/gdpr' },
          { label: 'Uygulama Versiyonlama Stratejileri', href: '/education/lessons/security/versioning' },
          { label: 'Dependency Güncellemeleri', href: '/education/lessons/security/dependency-updates' },
          { label: 'Kod Kalitesi Ölçümü (Static Code Analysis)', href: '/education/lessons/security/code-quality' },
          { label: 'Secure Coding Standartları', href: '/education/lessons/security/secure-coding' },
          { label: 'Linter / Analyzer Araçları', href: '/education/lessons/security/linter-analyzer' },
          { label: 'Audit Trail ve Loglama', href: '/education/lessons/security/audit-trail' },
          { label: 'Güvenlik Testi ve Penetrasyon Analizi', href: '/education/lessons/security/penetration-testing' },
          { label: 'Sürdürülebilir Kodlama Prensipleri', href: '/education/lessons/security/sustainable-coding' },
        ],
      },
      {
        id: 'module-14',
        title: 'Yapay Zeka ve ML.NET Entegrasyonuna Giriş',
        summary: 'ML.NET ile makine öğrenmesi uygulamaları geliştirmeyi öğrenin. Model eğitimi, veri preprocessing, classification, regression ve model deployment tekniklerini uygulayın.',
        lessons: [
          { label: 'ML.NET Nedir?', href: '/education/lessons/ml-net/ml-net-intro' },
          { label: 'Makine Öğrenmesi Temelleri', href: '/education/lessons/ml-net/ml-basics' },
          { label: 'Supervised / Unsupervised Learning Kavramları', href: '/education/lessons/ml-net/learning-types' },
          { label: 'Model Eğitimi (Training)', href: '/education/lessons/ml-net/model-training' },
          { label: 'Veri Seti Hazırlama', href: '/education/lessons/ml-net/dataset-preparation' },
          { label: 'Data Preprocessing (Temizlik, Normalizasyon)', href: '/education/lessons/ml-net/data-preprocessing' },
          { label: 'Model Test Etme (Evaluation)', href: '/education/lessons/ml-net/model-evaluation' },
          { label: 'Model Performans Ölçütleri (Accuracy, Precision)', href: '/education/lessons/ml-net/performance-metrics' },
          { label: 'Prediction Engine Kullanımı', href: '/education/lessons/ml-net/prediction-engine' },
          { label: 'ML.NET Pipeline Yapısı', href: '/education/lessons/ml-net/pipeline' },
          { label: 'Model Kaydetme ve Yükleme', href: '/education/lessons/ml-net/model-save-load' },
          { label: 'Text Classification Uygulaması', href: '/education/lessons/ml-net/text-classification' },
          { label: 'Regression Örneği (Fiyat Tahmini)', href: '/education/lessons/ml-net/regression' },
          { label: 'Binary Classification Örneği', href: '/education/lessons/ml-net/binary-classification' },
          { label: 'ML.NET CLI Kullanımı', href: '/education/lessons/ml-net/ml-net-cli' },
          { label: 'ML Context ve IDataView Kavramı', href: '/education/lessons/ml-net/ml-context' },
          { label: 'Modelin API Üzerinden Kullanımı', href: '/education/lessons/ml-net/api-integration' },
          { label: 'ML.NET ile Basit Tavsiye Sistemi', href: '/education/lessons/ml-net/recommendation-system' },
          { label: 'Model Güncelleme ve Sürüm Yönetimi', href: '/education/lessons/ml-net/model-updates' },
          { label: 'ML.NET Gerçek Proje Örneği', href: '/education/lessons/ml-net/real-project' },
        ],
      },
      {
        id: 'module-15',
        title: 'Gerçek Dünya Projeleri ve En İyi Uygulama Pratikleri',
        summary: 'Kurumsal seviyede bir .NET Core projesi geliştirerek tüm öğrendiklerinizi uygulayın. Katmanlı mimari, authentication, logging, testing, CI/CD ve Docker deployment gibi best practice\'leri içeren kapsamlı bir final projesi.',
        lessons: [
          { label: 'Proje Planlama ve Gereksinim Analizi', href: '/education/lessons/best-practices/project-planning' },
          { label: 'Katmanlı Mimari Kurulumu', href: '/education/lessons/best-practices/layered-architecture' },
          { label: 'Entity ve DTO Tasarımı', href: '/education/lessons/best-practices/entity-dto' },
          { label: 'Repository & Service Katmanları', href: '/education/lessons/best-practices/repository-service' },
          { label: 'API Katmanı Geliştirme', href: '/education/lessons/best-practices/api-layer' },
          { label: 'Web Arayüzü ile API Entegrasyonu', href: '/education/lessons/best-practices/web-api-integration' },
          { label: 'Authentication & Authorization Uygulaması', href: '/education/lessons/best-practices/auth-app' },
          { label: 'Logging ve Exception Yönetimi', href: '/education/lessons/best-practices/logging-exception' },
          { label: 'Validation ve Error Response Standardizasyonu', href: '/education/lessons/best-practices/validation-error' },
          { label: 'Unit ve Integration Testleri', href: '/education/lessons/best-practices/tests' },
          { label: 'Caching ve Performans Ayarlamaları', href: '/education/lessons/best-practices/caching-performance' },
          { label: 'CI/CD Pipeline Entegrasyonu', href: '/education/lessons/best-practices/cicd-pipeline' },
          { label: 'Dockerize Edilmiş Uygulama Dağıtımı', href: '/education/lessons/best-practices/docker-deployment' },
          { label: 'Configuration Management', href: '/education/lessons/best-practices/configuration' },
          { label: 'GitFlow ile Versiyon Yönetimi', href: '/education/lessons/best-practices/gitflow' },
          { label: 'Kod İnceleme (Code Review) Süreçleri', href: '/education/lessons/best-practices/code-review' },
          { label: 'Geliştirici Rehberi ve Dokümantasyon', href: '/education/lessons/best-practices/documentation' },
          { label: 'Ortak Servis ve Helper Yapıları', href: '/education/lessons/best-practices/shared-services' },
          { label: 'Final Proje: Kurumsal API + Web Uygulaması', href: '/education/lessons/best-practices/final-project' },
          { label: 'Yayınlama, Bakım ve Geliştirme Süreci', href: '/education/lessons/best-practices/maintenance' },
        ],
      },
    ];

    await db.$transaction(async (tx) => {
      // Create or update course-dotnet-roadmap
      const courseContent = {
        overview: {
          description: 'Kapsamlı .NET Core öğrenme yolculuğu - Temel kavramlardan ileri seviye uygulamalara kadar',
          estimatedDurationMinutes: null,
        },
        modules: modules.map((module) => ({
          id: module.id,
          title: module.title,
          summary: module.summary || null,
          relatedTopics: module.lessons.map((lesson) => ({
            label: lesson.label,
            href: lesson.href,
          })),
        })),
      };

      await tx.course.upsert({
        where: { id: 'course-dotnet-roadmap' },
        create: {
          id: 'course-dotnet-roadmap',
          title: 'Net Core Roadmap',
          description: 'Kapsamlı .NET Core öğrenme yolculuğu',
          category: '.NET Core',
          field: 'Backend',
          topic: '.NET Core',
          difficulty: 'intermediate',
          estimatedDuration: null,
          content: courseContent as Prisma.InputJsonValue,
        },
        update: {
          title: 'Net Core Roadmap',
          description: 'Kapsamlı .NET Core öğrenme yolculuğu',
          content: courseContent as Prisma.InputJsonValue,
        },
      });

      modulesCreated = modules.length;
    });

    return {
      success: true,
      modulesCreated,
      errors,
    };
  } catch (error: any) {
    console.error('Error creating Net Core Roadmap structure:', error);
    return {
      success: false,
      modulesCreated,
      errors: [error.message || 'Unknown error'],
    };
  }
}

