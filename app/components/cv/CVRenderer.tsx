import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import ColorfulTemplate from './templates/ColorfulTemplate';
import TechTemplate from './templates/TechTemplate';

interface CVData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    website: string;
    profilePhoto?: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    current: boolean;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: string[];
  languages: Array<{
    name: string;
    level: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    url?: string;
    startDate: string;
    endDate: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }>;
  references: Array<{
    name: string;
    position: string;
    company: string;
    email: string;
    phone: string;
  }>;
  hobbies: string[];
}

interface CVRendererProps {
  data: CVData;
  templateId: string;
  className?: string;
  id?: string; // For PDF generation targeting
}

export default function CVRenderer({ data, templateId, className = '', id }: CVRendererProps) {
  // Normalize template ID to handle different formats
  const normalizedTemplateId = templateId.toLowerCase();
  
  // Select template based on templateId
  const renderTemplate = () => {
    if (normalizedTemplateId.includes('modern') || normalizedTemplateId === 'template_1') {
      return <ModernTemplate data={data} />;
    } else if (normalizedTemplateId.includes('classic') || normalizedTemplateId === 'template_2') {
      return <ClassicTemplate data={data} />;
    } else if (normalizedTemplateId.includes('creative') || normalizedTemplateId === 'template_3') {
      return <CreativeTemplate data={data} />;
    } else if (normalizedTemplateId.includes('professional') || normalizedTemplateId === 'template_4') {
      return <ProfessionalTemplate data={data} />;
    } else if (normalizedTemplateId.includes('minimal')) {
      return <MinimalTemplate data={data} />;
    } else if (normalizedTemplateId.includes('executive')) {
      return <ExecutiveTemplate data={data} />;
    } else if (normalizedTemplateId.includes('colorful')) {
      return <ColorfulTemplate data={data} />;
    } else if (normalizedTemplateId.includes('tech')) {
      return <TechTemplate data={data} />;
    }
    // Default to Modern template
    return <ModernTemplate data={data} />;
  };

  return (
    <div
      id={id}
      className={className}
      style={{
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        overflow: 'hidden',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        hyphens: 'auto',
        maxWidth: '100%',
      }}
    >
      {renderTemplate()}
    </div>
  );
}

