"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CVRenderer from "@/app/components/cv/CVRenderer";
import { checkSubscriptionBeforeAction } from "@/lib/utils/subscription-check";

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
  summary: "5+ yıllık deneyime sahip, yazılım geliştirme ve proje yönetimi konularında uzmanlaşmış bir yazılım mühendisi. Modern web teknolojileri ve bulut çözümleri konusunda derin bilgi sahibi. Ekip çalışması ve liderlik deneyimi ile başarılı projeler yürütmüştür. Full-stack geliştirme konusunda geniş bir deneyime sahip olup, React, Node.js, Python ve AWS gibi teknolojilerde uzmanlaşmıştır. Mikroservis mimarileri tasarlama, ölçeklenebilir sistemler geliştirme ve DevOps uygulamaları konularında pratik deneyime sahiptir. Agile metodolojiler ile çalışma deneyimi bulunmakta ve sürekli öğrenme ve gelişim konusunda tutkulu bir yaklaşım sergilemektedir. Müşteri odaklı çözümler üretme, teknik problemleri analiz etme ve etkili çözümler geliştirme konularında güçlü yeteneklere sahiptir. Kod kalitesi, test yazma ve dokümantasyon konularına önem vermekte, ekip içi işbirliği ve mentorluk faaliyetlerinde aktif rol almaktadır. Performans optimizasyonu, güvenlik best practice'leri ve modern yazılım geliştirme araçları konularında sürekli güncel kalmaktadır. Proje yönetimi, zaman yönetimi ve iletişim becerileri ile karmaşık projeleri başarıyla tamamlamıştır. Teknik liderlik, kod review süreçleri ve ekip içi bilgi paylaşımı konularında deneyimlidir.",
  experience: [
    {
      company: "Tech Solutions A.Ş.",
      position: "Senior Software Engineer",
      startDate: "2021",
      endDate: "Devam ediyor",
      description: "Full-stack web uygulamaları geliştirme, mikroservis mimarisi tasarımı, ekip liderliği ve kod inceleme süreçlerini yönetme. React, Node.js ve AWS teknolojileri kullanarak ölçeklenebilir çözümler geliştirme. CI/CD pipeline'ları kurma ve DevOps uygulamaları geliştirme.",
      current: true,
    },
    {
      company: "Digital Innovations Ltd.",
      position: "Software Developer",
      startDate: "2019",
      endDate: "2021",
      description: "RESTful API geliştirme, veritabanı tasarımı ve optimizasyonu. Agile metodolojiler ile çalışma deneyimi. Müşteri gereksinimlerini analiz edip teknik çözümler üretme. Test-driven development yaklaşımı ile kaliteli kod yazma.",
      current: false,
    },
    {
      company: "StartupTech Co.",
      position: "Junior Software Developer",
      startDate: "2018",
      endDate: "2019",
      description: "Frontend ve backend geliştirme görevleri. React ve Express.js kullanarak web uygulamaları geliştirme. Veritabanı yönetimi ve API entegrasyonları. Kod review süreçlerine katılım ve ekip içi teknik dokümantasyon hazırlama.",
      current: false,
    },
    {
      company: "CodeAcademy Bootcamp",
      position: "Yazılım Geliştirme Stajyeri",
      startDate: "2017",
      endDate: "2018",
      description: "Web geliştirme bootcamp programına katılım. HTML, CSS, JavaScript ve Python öğrenimi. Proje bazlı öğrenme ile pratik deneyim kazanma. Ekip projelerinde aktif rol alma ve version control sistemleri kullanma.",
      current: false,
    },
  ],
  education: [
    {
      school: "İstanbul Teknik Üniversitesi",
      degree: "Yüksek Lisans",
      field: "Bilgisayar Bilimleri",
      startDate: "2019",
      endDate: "2021",
      gpa: "3.9/4.0",
    },
    {
      school: "İstanbul Teknik Üniversitesi",
      degree: "Lisans",
      field: "Bilgisayar Mühendisliği",
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
    "Kubernetes",
    "Redis",
    "GraphQL",
    "Next.js",
    "Express.js",
    "Jest",
    "CI/CD",
    "Microservices",
    "RESTful API",
    "Agile",
  ],
  languages: [
    { name: "Türkçe", level: "Anadil" },
    { name: "İngilizce", level: "İleri" },
    { name: "Almanca", level: "Orta" },
  ],
  projects: [
    {
      name: "E-Ticaret Platformu",
      description: "Ölçeklenebilir e-ticaret platformu geliştirme. Mikroservis mimarisi, ödeme entegrasyonu ve admin paneli. Yüksek trafikli ortamda performans optimizasyonu ve güvenlik önlemleri.",
      technologies: "React, Node.js, PostgreSQL, Redis, Docker",
      startDate: "2022",
      endDate: "2023",
    },
    {
      name: "Mobil Uygulama",
      description: "Cross-platform mobil uygulama geliştirme. Kullanıcı arayüzü tasarımı ve backend entegrasyonu. Real-time bildirimler ve offline çalışma özellikleri.",
      technologies: "React Native, Firebase, REST API",
      startDate: "2021",
      endDate: "2022",
    },
    {
      name: "API Gateway Sistemi",
      description: "Merkezi API gateway sistemi tasarımı ve geliştirme. Rate limiting, authentication ve load balancing özellikleri. Microservices mimarisi ile entegrasyon.",
      technologies: "Node.js, Express, Redis, Kubernetes",
      startDate: "2023",
      endDate: "2024",
    },
    {
      name: "Dashboard Analytics Platformu",
      description: "Gerçek zamanlı veri analizi ve görselleştirme platformu. Büyük veri setlerini işleme ve interaktif dashboard'lar oluşturma. WebSocket ile canlı veri akışı.",
      technologies: "React, Python, PostgreSQL, WebSocket, D3.js",
      startDate: "2022",
      endDate: "2023",
    },
  ],
  achievements: [
    {
      title: "En İyi Proje Ödülü",
      description: "Şirket içi hackathon yarışmasında birinci oldu. E-ticaret platformu projesi ile ödül kazandı.",
      date: "2022",
    },
    {
      title: "Yılın Geliştiricisi",
      description: "Mükemmel performans ve ekip çalışması nedeniyle ödül aldı. Proje teslim sürelerini %30 iyileştirdi.",
      date: "2023",
    },
    {
      title: "Teknik Liderlik Sertifikası",
      description: "Ekip liderliği ve teknik mentorluk programını başarıyla tamamladı. 5 junior geliştiriciye mentorluk yaptı.",
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
    {
      name: "Docker Certified Associate",
      issuer: "Docker Inc.",
      date: "2023",
    },
    {
      name: "Kubernetes Administrator",
      issuer: "Cloud Native Computing Foundation",
      date: "2023",
    },
  ],
  references: [
    {
      name: "Ahmet Yılmaz",
      position: "Teknik Direktör",
      company: "Tech Solutions A.Ş.",
      email: "ahmet.yilmaz@techsolutions.com",
      phone: "+90 555 111 2233",
    },
    {
      name: "Ayşe Demir",
      position: "Yazılım Mimarı",
      company: "Digital Innovations Ltd.",
      email: "ayse.demir@digitalinnovations.com",
      phone: "+90 555 222 3344",
    },
  ],
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
    const hasSubscription = await checkSubscriptionBeforeAction();
    if (hasSubscription) {
      router.push(`/cv/create?template=${templateId}`);
    }
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

