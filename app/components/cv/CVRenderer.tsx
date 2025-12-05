import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import ColorfulTemplate from './templates/ColorfulTemplate';
import TechTemplate from './templates/TechTemplate';
import AcademicTemplate from './templates/AcademicTemplate';
import StartupTemplate from './templates/StartupTemplate';
import DesignerTemplate from './templates/DesignerTemplate';
import FinanceTemplate from './templates/FinanceTemplate';
import MedicalTemplate from './templates/MedicalTemplate';
import LegalTemplate from './templates/LegalTemplate';
import MarketingTemplate from './templates/MarketingTemplate';
import EngineeringTemplate from './templates/EngineeringTemplate';
import SalesTemplate from './templates/SalesTemplate';
import EducationTemplate from './templates/EducationTemplate';
import ArtisticTemplate from './templates/ArtisticTemplate';
import BoldTemplate from './templates/BoldTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import CorporateTemplate from './templates/CorporateTemplate';
import InnovativeTemplate from './templates/InnovativeTemplate';
import TimelineTemplate from './templates/TimelineTemplate';
import PortfolioTemplate from './templates/PortfolioTemplate';
import ATSFocusedTemplate from './templates/ATSFocusedTemplate';
import InternationalTemplate from './templates/InternationalTemplate';
import BilingualTemplate from './templates/BilingualTemplate';
import CompactTemplate from './templates/CompactTemplate';
import DetailedTemplate from './templates/DetailedTemplate';
import DeveloperTemplate from './templates/DeveloperTemplate';
import DevOpsTemplate from './templates/DevOpsTemplate';
import ResearchTemplate from './templates/ResearchTemplate';
import ConsultantTemplate from './templates/ConsultantTemplate';
import EntrepreneurTemplate from './templates/EntrepreneurTemplate';
import StudentTemplate from './templates/StudentTemplate';
import ExecutivePremiumTemplate from './templates/ExecutivePremiumTemplate';
import HybridTemplate from './templates/HybridTemplate';

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

const createEmptyCvData = (): CVData => ({
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    website: "",
    profilePhoto: undefined,
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  achievements: [],
  certifications: [],
  references: [],
  hobbies: [],
});

const normalizeCvData = (data: any): CVData => {
  const base = createEmptyCvData();
  if (!data || typeof data !== "object") {
    return base;
  }

  return {
    personalInfo: {
      ...base.personalInfo,
      ...(data.personalInfo ?? {}),
    },
    summary: typeof data.summary === "string" ? data.summary : "",
    experience: Array.isArray(data.experience) ? data.experience : [],
    education: Array.isArray(data.education) ? data.education : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    languages: Array.isArray(data.languages) ? data.languages : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    achievements: Array.isArray(data.achievements) ? data.achievements : [],
    certifications: Array.isArray(data.certifications) ? data.certifications : [],
    references: Array.isArray(data.references) ? data.references : [],
    hobbies: Array.isArray(data.hobbies) ? data.hobbies : [],
  };
};

export default function CVRenderer({ data, templateId, className = '', id }: CVRendererProps) {
  // Normalize CV data to ensure all fields are present and valid
  const normalizedData = normalizeCvData(data);
  
  // Normalize template ID to handle different formats
  const normalizedTemplateId = templateId.toLowerCase();
  
  // Select template based on templateId
  const renderTemplate = () => {
    if (normalizedTemplateId.includes('modern') || normalizedTemplateId === 'template_1') {
      return <ModernTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('classic') || normalizedTemplateId === 'template_2') {
      return <ClassicTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('creative') || normalizedTemplateId === 'template_3') {
      return <CreativeTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('professional') || normalizedTemplateId === 'template_4') {
      return <ProfessionalTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('minimal')) {
      return <MinimalTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('executive-premium')) {
      return <ExecutivePremiumTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('executive')) {
      return <ExecutiveTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('colorful')) {
      return <ColorfulTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('tech')) {
      return <TechTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('academic')) {
      return <AcademicTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('startup')) {
      return <StartupTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('designer')) {
      return <DesignerTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('finance')) {
      return <FinanceTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('medical')) {
      return <MedicalTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('legal')) {
      return <LegalTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('marketing')) {
      return <MarketingTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('engineering')) {
      return <EngineeringTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('sales')) {
      return <SalesTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('education')) {
      return <EducationTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('artistic')) {
      return <ArtisticTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('bold')) {
      return <BoldTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('elegant')) {
      return <ElegantTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('corporate')) {
      return <CorporateTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('innovative')) {
      return <InnovativeTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('timeline')) {
      return <TimelineTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('portfolio')) {
      return <PortfolioTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('ats-focused') || normalizedTemplateId.includes('atsfocused')) {
      return <ATSFocusedTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('international')) {
      return <InternationalTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('bilingual')) {
      return <BilingualTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('compact')) {
      return <CompactTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('detailed')) {
      return <DetailedTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('developer')) {
      return <DeveloperTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('devops')) {
      return <DevOpsTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('research')) {
      return <ResearchTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('consultant')) {
      return <ConsultantTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('entrepreneur')) {
      return <EntrepreneurTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('student')) {
      return <StudentTemplate data={normalizedData} />;
    } else if (normalizedTemplateId.includes('hybrid')) {
      return <HybridTemplate data={normalizedData} />;
    }
    // Default to Modern template
    return <ModernTemplate data={normalizedData} />;
  };

  return (
    <div
      id={id}
      className={className}
      style={{
        width: '210mm',
        height: '297mm',
        maxHeight: '297mm',
        margin: '0 auto',
        overflow: 'hidden',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        hyphens: 'auto',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {renderTemplate()}
    </div>
  );
}

