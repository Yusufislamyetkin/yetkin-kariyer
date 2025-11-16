export type CourseContent = {
  overview: CourseOverview;
  learningObjectives: string[];
  prerequisites: string[];
  modules: CourseModule[];
  resources: CourseResource[];
  capstone?: CourseCapstone;
};

export type CourseOverview = {
  description: string;
  targetAudience: string[];
  skills: string[];
  estimatedDurationMinutes: number;
  outcomes: string[];
};

export type ModulePrimaryLink = {
  label: string;
  href: string;
  description?: string;
};

export type ModuleRelatedTopic = {
  label: string;
  href: string;
  description?: string;
};

export type CourseModule = {
  id: string;
  title: string;
  summary: string;
  durationMinutes: number;
  objectives: string[];
  activities: ModuleActivity[];
  checkpoints?: ModuleCheckpoint[];
  learnLink?: ModulePrimaryLink;
  relatedTopics?: ModuleRelatedTopic[];
};

export type ModuleActivity =
  | ConceptActivity
  | GuidedExerciseActivity
  | CodeChallengeActivity
  | DiscussionActivity
  | ReflectionActivity
  | KnowledgeCheckActivity;

export type ModuleActivityType =
  | "concept"
  | "guided-exercise"
  | "code-challenge"
  | "discussion"
  | "reflection"
  | "knowledge-check";

export type ActivityBase = {
  id: string;
  type: ModuleActivityType;
  title: string;
  estimatedMinutes?: number;
  prompt?: string;
};

export type ConceptActivity = ActivityBase & {
  type: "concept";
  content: string;
  highlights?: string[];
  codeSamples?: CodeSample[];
  checklist?: ActivityChecklistItem[];
};

export type GuidedExerciseActivity = ActivityBase & {
  type: "guided-exercise";
  description: string;
  steps: ActivityStep[];
  starterCode?: CodeSample;
  hints?: string[];
  validation?: ActivityValidation;
};

export type CodeChallengeActivity = ActivityBase & {
  type: "code-challenge";
  description: string;
  acceptanceCriteria: string[];
  starterCode?: CodeSample;
  testCases?: CodeChallengeTestCase[];
  evaluationTips?: string[];
};

export type DiscussionActivity = ActivityBase & {
  type: "discussion";
  topics: string[];
  preparation?: string[];
  expectedOutcomes?: string[];
};

export type ReflectionActivity = ActivityBase & {
  type: "reflection";
  prompts: string[];
  expectedTakeaways?: string[];
};

export type KnowledgeCheckActivity = ActivityBase & {
  type: "knowledge-check";
  questions: ActivityQuestion[];
  followUpResources?: CourseResource[];
};

export type ActivityStep = {
  title: string;
  detail: string;
  hint?: string;
  reference?: string;
};

export type ActivityChecklistItem = {
  id: string;
  label: string;
  explanation?: string;
};

export type ActivityValidation = {
  type: "self" | "pair" | "mentor";
  criteria: string[];
  rubric?: ActivityRubricCriterion[];
};

export type ActivityRubricCriterion = {
  id: string;
  dimension: string;
  levels: {
    label: string;
    description: string;
  }[];
};

export type CodeSample = {
  language: "csharp" | "bash" | "json" | "yaml" | "powershell" | "html" | "dockerfile" | "docker";
  filename?: string;
  code: string;
  explanation?: string;
};

export type CodeChallengeTestCase = {
  id: string;
  description: string;
  input: string;
  expectedOutput: string;
};

export type ActivityQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
};

export type ModuleCheckpoint = {
  id: string;
  title: string;
  description: string;
  tasks: ModuleCheckpointTask[];
  successCriteria: string[];
  estimatedMinutes?: number;
};

export type ModuleCheckpointTask = {
  id: string;
  description: string;
  resources?: CourseResource[];
  coachTips?: string[];
};

export type CourseResource = {
  id: string;
  title: string;
  url?: string;
  type: "documentation" | "video" | "repository" | "article" | "package" | "tool";
  description?: string;
  estimatedMinutes?: number;
};

export type CourseCapstone = {
  title: string;
  description: string;
  problemStatement: string;
  deliverables: string[];
  evaluationCriteria: ActivityRubricCriterion[];
  recommendedDurationMinutes: number;
};


