type TemplateResponse = {
  id: string;
  name: string;
  preview: string | null;
  structure: Record<string, unknown>;
};

const BASE_STRUCTURE = {
  sections: [
    "personalInfo",
    "summary",
    "experience",
    "education",
    "skills",
    "languages",
    "projects",
    "achievements",
    "certifications",
    "references",
    "hobbies",
  ],
};

export const DEFAULT_TEMPLATES: TemplateResponse[] = [
  {
    id: "modern",
    name: "Modern CV",
    preview: null,
    structure: {
      ...BASE_STRUCTURE,
      theme: "modern",
      layout: "two-column",
    },
  },
  {
    id: "classic",
    name: "Klasik CV",
    preview: null,
    structure: {
      ...BASE_STRUCTURE,
      theme: "classic",
      layout: "single-column",
    },
  },
  {
    id: "creative",
    name: "Yaratıcı CV",
    preview: null,
    structure: {
      ...BASE_STRUCTURE,
      theme: "creative",
      layout: "highlighted-header",
    },
  },
  {
    id: "professional",
    name: "Profesyonel CV",
    preview: null,
    structure: {
      ...BASE_STRUCTURE,
      theme: "professional",
      layout: "balanced",
    },
  },
  {
    id: "minimal",
    name: "Minimal CV",
    preview: null,
    structure: {
      ...BASE_STRUCTURE,
      theme: "minimal",
      layout: "single-column",
    },
  },
  {
    id: "executive",
    name: "Yönetici CV",
    preview: null,
    structure: {
      ...BASE_STRUCTURE,
      theme: "executive",
      layout: "two-column",
    },
  },
  {
    id: "colorful",
    name: "Renkli CV",
    preview: null,
    structure: {
      ...BASE_STRUCTURE,
      theme: "colorful",
      layout: "two-column",
    },
  },
  {
    id: "tech",
    name: "Teknoloji CV",
    preview: null,
    structure: {
      ...BASE_STRUCTURE,
      theme: "tech",
      layout: "two-column",
    },
  },
];


