"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CVRenderer from "@/app/components/cv/CVRenderer";

interface CVTemplate {
  id: string;
  name: string;
  preview: string | null;
  structure: any;
}

// Sample CV data for previews
const sampleCVData = {
  personalInfo: {
    name: "Yusuf İslam Yetkin",
    email: "yusuf.islam.yetkin@email.com",
    phone: "+90 555 123 4567",
    address: "İstanbul, Türkiye",
    linkedin: "linkedin.com/in/yusufislamyetkin",
    website: "yusufislamyetkin.dev",
  },
  summary: "5+ yıllık deneyime sahip, yazılım geliştirme ve proje yönetimi konularında uzmanlaşmış bir yazılım mühendisi. Modern web teknolojileri ve bulut çözümleri konusunda derin bilgi sahibi. Ekip çalışması ve liderlik deneyimi ile başarılı projeler yürütmüştür.",
  experience: [
    {
      company: "Tech Solutions A.Ş.",
      position: "Senior Software Engineer",
      startDate: "2021",
      endDate: "Devam ediyor",
      description: "Full-stack web uygulamaları geliştirme, mikroservis mimarisi tasarımı, ekip liderliği ve kod inceleme süreçlerini yönetme. React, Node.js ve AWS teknolojileri kullanarak ölçeklenebilir çözümler geliştirme.",
      current: true,
    },
    {
      company: "Digital Innovations Ltd.",
      position: "Software Developer",
      startDate: "2019",
      endDate: "2021",
      description: "RESTful API geliştirme, veritabanı tasarımı ve optimizasyonu. Agile metodolojiler ile çalışma deneyimi. Müşteri gereksinimlerini analiz edip teknik çözümler üretme.",
      current: false,
    },
  ],
  education: [
    {
      school: "İstanbul Teknik Üniversitesi",
      degree: "Bilgisayar Mühendisliği",
      field: "Yazılım Mühendisliği",
      startDate: "2015",
      endDate: "2019",
      gpa: "3.8/4.0",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "PostgreSQL",
    "MongoDB",
    "Git",
  ],
  languages: [
    { name: "Türkçe", level: "Anadil" },
    { name: "İngilizce", level: "İleri" },
    { name: "Almanca", level: "Orta" },
  ],
  projects: [
    {
      name: "E-Ticaret Platformu",
      description: "Ölçeklenebilir e-ticaret platformu geliştirme. Mikroservis mimarisi, ödeme entegrasyonu ve admin paneli.",
      technologies: "React, Node.js, PostgreSQL, Redis, Docker",
      startDate: "2022",
      endDate: "2023",
    },
    {
      name: "Mobil Uygulama",
      description: "Cross-platform mobil uygulama geliştirme. Kullanıcı arayüzü tasarımı ve backend entegrasyonu.",
      technologies: "React Native, Firebase, REST API",
      startDate: "2021",
      endDate: "2022",
    },
  ],
  achievements: [
    {
      title: "En İyi Proje Ödülü",
      description: "Şirket içi hackathon yarışmasında birinci oldu.",
      date: "2022",
    },
    {
      title: "Yılın Geliştiricisi",
      description: "Mükemmel performans ve ekip çalışması nedeniyle ödül aldı.",
      date: "2023",
    },
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2022",
    },
    {
      name: "React Advanced Patterns",
      issuer: "Udemy",
      date: "2021",
    },
  ],
  references: [],
  hobbies: ["Futbol", "Kitap Okuma", "Yazılım Geliştirme", "Seyahat"],
};

export default function CVTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/cv/templates");
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    router.push(`/cv/create?template=${templateId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">CV Şablonları</h1>
      <p className="text-gray-600 mb-8">
        Bir şablon seçerek CV&apos;nizi oluşturmaya başlayın. Tüm şablonlar ATS
        uyumludur.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden"
            onClick={() => handleSelectTemplate(template.id)}
          >
            {/* Preview Section - A4 Aspect Ratio (210mm / 297mm = 0.707) */}
            <div 
              className="bg-gray-50 border-b border-gray-200 relative overflow-hidden"
              style={{ 
                aspectRatio: '210 / 297',
                maxHeight: '400px',
                width: '100%',
                minHeight: '280px'
              }}
            >
              <div 
                className="absolute inset-0 overflow-auto"
                style={{ 
                  transform: 'scale(0.22)',
                  transformOrigin: 'top left',
                  width: '454%',
                  height: '454%'
                }}
              >
                <div style={{ pointerEvents: 'none' }}>
                  <CVRenderer 
                    data={sampleCVData} 
                    templateId={template.id}
                    className="!w-[210mm] !min-h-[297mm]"
                  />
                </div>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{template.name}</h2>
              <p className="text-sm text-gray-600 mb-4">
                ATS Uyumlu • Profesyonel
              </p>
              <button 
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectTemplate(template.id);
                }}
              >
                Bu Şablonu Seç
              </button>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Şablon bulunamadı</p>
        </div>
      )}
    </div>
  );
}

