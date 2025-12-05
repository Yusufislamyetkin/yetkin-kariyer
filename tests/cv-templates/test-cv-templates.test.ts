/**
 * CV Template Tests
 * Tests all CV templates to ensure they display all required fields
 */

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "fs";
import { join } from "path";

// Required fields that should be rendered in all templates
const REQUIRED_FIELDS = [
  { name: 'certifications', patterns: ['data.certifications', 'certifications.length', 'certifications.map'] },
  { name: 'languages', patterns: ['data.languages', 'languages.length', 'languages.map'] },
  { name: 'projects', patterns: ['data.projects', 'projects.length', 'projects.map'] },
  { name: 'achievements', patterns: ['data.achievements', 'achievements.length', 'achievements.map'] },
  { name: 'references', patterns: ['data.references', 'references.length', 'references.map'] },
  { name: 'hobbies', patterns: ['data.hobbies', 'hobbies.length', 'hobbies.map'] },
];

// All template files
const TEMPLATE_FILES = [
  'AcademicTemplate.tsx',
  'ArtisticTemplate.tsx',
  'ATSFocusedTemplate.tsx',
  'BilingualTemplate.tsx',
  'BoldTemplate.tsx',
  'ClassicTemplate.tsx',
  'ColorfulTemplate.tsx',
  'CompactTemplate.tsx',
  'ConsultantTemplate.tsx',
  'CorporateTemplate.tsx',
  'CreativeTemplate.tsx',
  'DesignerTemplate.tsx',
  'DetailedTemplate.tsx',
  'DeveloperTemplate.tsx',
  'DevOpsTemplate.tsx',
  'EducationTemplate.tsx',
  'ElegantTemplate.tsx',
  'EngineeringTemplate.tsx',
  'EntrepreneurTemplate.tsx',
  'ExecutivePremiumTemplate.tsx',
  'ExecutiveTemplate.tsx',
  'FinanceTemplate.tsx',
  'HybridTemplate.tsx',
  'InnovativeTemplate.tsx',
  'InternationalTemplate.tsx',
  'LegalTemplate.tsx',
  'MarketingTemplate.tsx',
  'MedicalTemplate.tsx',
  'MinimalTemplate.tsx',
  'ModernTemplate.tsx',
  'PortfolioTemplate.tsx',
  'ProfessionalTemplate.tsx',
  'ResearchTemplate.tsx',
  'SalesTemplate.tsx',
  'StartupTemplate.tsx',
  'StudentTemplate.tsx',
  'TechTemplate.tsx',
  'TimelineTemplate.tsx',
];

describe("CV Template Tests", () => {
  const templatesDir = join(process.cwd(), 'app', 'components', 'cv', 'templates');
  
  describe("Template Field Coverage", () => {
    TEMPLATE_FILES.forEach((templateFile) => {
      it(`should render all required fields in ${templateFile}`, () => {
        const templatePath = join(templatesDir, templateFile);
        let templateContent: string;
        
        try {
          templateContent = readFileSync(templatePath, 'utf-8');
        } catch (error) {
          assert.fail(`Template file not found: ${templateFile}`);
          return;
        }

        const missingFields: string[] = [];
        
        // Check each required field
        REQUIRED_FIELDS.forEach((field) => {
          const hasField = field.patterns.some(pattern => 
            templateContent.includes(pattern)
          );
          
          if (!hasField) {
            missingFields.push(field.name);
          }
        });

        if (missingFields.length > 0) {
          assert.fail(
            `Template ${templateFile} is missing the following fields: ${missingFields.join(', ')}`
          );
        }
      });
    });
  });

  describe("Template Count Verification", () => {
    it("should have all expected templates", () => {
      const actualCount = TEMPLATE_FILES.length;
      const expectedCount = 38; // Total number of templates
      
      assert.strictEqual(
        actualCount,
        expectedCount,
        `Expected ${expectedCount} templates, but found ${actualCount}`
      );
    });
  });

  describe("Required Fields Verification", () => {
    it("should check all required fields are defined", () => {
      const requiredFieldNames = REQUIRED_FIELDS.map(f => f.name);
      const expectedFields = [
        'certifications',
        'languages',
        'projects',
        'achievements',
        'references',
        'hobbies'
      ];
      
      assert.deepStrictEqual(
        requiredFieldNames.sort(),
        expectedFields.sort(),
        'Required fields list should match expected fields'
      );
    });
  });

  describe("Individual Template Field Checks", () => {
    // Test specific templates that were previously missing fields
    const previouslyProblematicTemplates = [
      { file: 'PortfolioTemplate.tsx', fields: ['certifications', 'languages', 'achievements', 'references', 'hobbies'] },
      { file: 'StudentTemplate.tsx', fields: ['certifications', 'languages', 'references'] },
      { file: 'ConsultantTemplate.tsx', fields: ['languages', 'projects', 'achievements', 'references', 'hobbies'] },
      { file: 'HybridTemplate.tsx', fields: ['certifications', 'languages', 'references', 'hobbies'] },
      { file: 'EntrepreneurTemplate.tsx', fields: ['certifications', 'languages', 'references', 'hobbies'] },
      { file: 'ResearchTemplate.tsx', fields: ['languages', 'projects', 'achievements', 'references', 'hobbies'] },
      { file: 'InternationalTemplate.tsx', fields: ['projects', 'achievements', 'certifications', 'references', 'hobbies'] },
    ];

    previouslyProblematicTemplates.forEach(({ file, fields }) => {
      it(`should have fixed fields in ${file}`, () => {
        const templatePath = join(templatesDir, file);
        let templateContent: string;
        
        try {
          templateContent = readFileSync(templatePath, 'utf-8');
        } catch (error) {
          assert.fail(`Template file not found: ${file}`);
          return;
        }

        const missingFields: string[] = [];
        
        fields.forEach((fieldName) => {
          const field = REQUIRED_FIELDS.find(f => f.name === fieldName);
          if (!field) {
            missingFields.push(fieldName);
            return;
          }
          
          const hasField = field.patterns.some(pattern => 
            templateContent.includes(pattern)
          );
          
          if (!hasField) {
            missingFields.push(fieldName);
          }
        });

        if (missingFields.length > 0) {
          assert.fail(
            `Template ${file} is still missing the following fields: ${missingFields.join(', ')}`
          );
        }
      });
    });
  });
});

