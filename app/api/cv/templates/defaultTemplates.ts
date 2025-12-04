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
    name: "ATS Uyumlu CV Kod: 01",
    preview: null,
    structure: {
      ...BASE_STRUCTURE,
      theme: "modern",
      layout: "two-column",
    },
  },
  {
    id: "classic",
    name: "ATS Uyumlu CV Kod: 02",
    preview: null,
    structure: {
      ...BASE_STRUCTURE,
      theme: "classic",
      layout: "single-column",
    },
  },
  {
    id: "creative",
    name: "ATS Uyumlu CV Kod: 03",
    preview: null,
    structure: {
      ...BASE_STRUCTURE,
      theme: "creative",
      layout: "highlighted-header",
    },
  },
  {
    id: "professional",
    name: "ATS Uyumlu CV Kod: 04",
    preview: null,
    structure: {
      ...BASE_STRUCTURE,
      theme: "professional",
      layout: "balanced",
    },
  },
  {
    id: "minimal",
    name: "ATS Uyumlu CV Kod: 05",
    preview: null,
    structure: {
      ...BASE_STRUCTURE,
      theme: "minimal",
      layout: "single-column",
    },
  },
  {
    id: "executive",
    name: "ATS Uyumlu CV Kod: 06",
    preview: null,
    structure: {
      ...BASE_STRUCTURE,
      theme: "executive",
      layout: "two-column",
    },
  },
  {
    id: "colorful",
    name: "ATS Uyumlu CV Kod: 07",
    preview: null,
    structure: {
      ...BASE_STRUCTURE,
      theme: "colorful",
      layout: "two-column",
    },
  },
  {
    id: "tech",
    name: "ATS Uyumlu CV Kod: 08",
    preview: null,
    structure: {
      ...BASE_STRUCTURE,
      theme: "tech",
      layout: "two-column",
    },
  },
];


