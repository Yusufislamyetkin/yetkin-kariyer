// CV Validation Constants and Helper Functions

// Character and word limits
export const CV_LIMITS = {
  summary: {
    maxWords: 200,
    maxChars: 1200,
  },
  experience: {
    maxEntries: 5,
    descriptionMaxWords: 150,
    descriptionMaxChars: 900,
  },
  projects: {
    maxEntries: 5,
    descriptionMaxWords: 100,
    descriptionMaxChars: 600,
  },
  achievements: {
    maxEntries: 6,
    descriptionMaxWords: 50,
    descriptionMaxChars: 300,
  },
  education: {
    maxEntries: 4,
  },
  certifications: {
    maxEntries: 6,
  },
} as const;

// Count words in a string
export function countWords(text: string): number {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Count characters in a string
export function countChars(text: string): number {
  if (!text || typeof text !== 'string') return 0;
  return text.length;
}

// Check if text exceeds word limit
export function exceedsWordLimit(text: string, maxWords: number): boolean {
  return countWords(text) > maxWords;
}

// Check if text exceeds character limit
export function exceedsCharLimit(text: string, maxChars: number): boolean {
  return countChars(text) > maxChars;
}

// Get validation status for a text field
export type ValidationStatus = 'valid' | 'warning' | 'error';

export function getValidationStatus(
  text: string,
  maxWords: number,
  maxChars: number,
  warningThreshold: number = 0.9
): ValidationStatus {
  const wordCount = countWords(text);
  const charCount = countChars(text);
  
  if (wordCount > maxWords || charCount > maxChars) {
    return 'error';
  }
  
  const wordRatio = wordCount / maxWords;
  const charRatio = charCount / maxChars;
  
  if (wordRatio >= warningThreshold || charRatio >= warningThreshold) {
    return 'warning';
  }
  
  return 'valid';
}

// Get validation message
export function getValidationMessage(
  text: string,
  maxWords: number,
  maxChars: number,
  fieldName: string = 'Bu alan'
): string {
  const wordCount = countWords(text);
  const charCount = countChars(text);
  
  if (wordCount > maxWords) {
    return `${fieldName} maksimum ${maxWords} kelime olabilir. (${wordCount}/${maxWords})`;
  }
  
  if (charCount > maxChars) {
    return `${fieldName} maksimum ${maxChars} karakter olabilir. (${charCount}/${maxChars})`;
  }
  
  const wordRatio = wordCount / maxWords;
  const charRatio = charCount / maxChars;
  
  if (wordRatio >= 0.9 || charRatio >= 0.9) {
    return `Limit yaklaşıyor: ${wordCount}/${maxWords} kelime, ${charCount}/${maxChars} karakter`;
  }
  
  return '';
}

// Validate experience array
export function validateExperienceCount(count: number): boolean {
  return count <= CV_LIMITS.experience.maxEntries;
}

// Validate projects array
export function validateProjectsCount(count: number): boolean {
  return count <= CV_LIMITS.projects.maxEntries;
}

// Validate education array
export function validateEducationCount(count: number): boolean {
  return count <= CV_LIMITS.education.maxEntries;
}

// Validate achievements array
export function validateAchievementsCount(count: number): boolean {
  return count <= CV_LIMITS.achievements.maxEntries;
}

// Validate certifications array
export function validateCertificationsCount(count: number): boolean {
  return count <= CV_LIMITS.certifications.maxEntries;
}

