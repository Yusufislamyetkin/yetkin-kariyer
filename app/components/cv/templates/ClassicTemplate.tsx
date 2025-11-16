/* eslint-disable @next/next/no-img-element */
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

interface ClassicTemplateProps {
  data: CVData;
}

export default function ClassicTemplate({ data }: ClassicTemplateProps) {
  return (
    <div className="bg-white text-gray-900 break-words" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="max-w-4xl mx-auto p-10">
        {/* Header */}
        <header className="text-center border-b-4 border-navy-900 pb-6 mb-8">
          <h1 className="text-5xl font-bold text-navy-900 mb-4" style={{ color: '#1e3a8a' }}>
            {data.personalInfo.name || "Ad Soyad"}
          </h1>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
            {data.personalInfo.address && <span>• {data.personalInfo.address}</span>}
            {data.personalInfo.linkedin && <span>• {data.personalInfo.linkedin}</span>}
            {data.personalInfo.website && <span>• {data.personalInfo.website}</span>}
          </div>
          {data.personalInfo.profilePhoto && (
            <div className="mt-4">
              <img
                src={data.personalInfo.profilePhoto}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mx-auto border-4"
                style={{ borderColor: '#1e3a8a' }}
              />
            </div>
          )}
        </header>

        {/* Summary */}
        {data.summary && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '8px' }}>
              Profesyonel Özet
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify break-words whitespace-pre-line">
              {data.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '8px' }}>
              İş Deneyimi
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="pl-4 border-l-4" style={{ borderColor: '#1e3a8a' }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{exp.position || "Pozisyon"}</h3>
                      <p className="text-lg font-medium" style={{ color: '#1e3a8a' }}>{exp.company || "Şirket"}</p>
                    </div>
                    <p className="text-sm text-gray-600 whitespace-nowrap">
                      {exp.startDate && `${exp.startDate} - `}
                      {exp.current ? "Devam ediyor" : exp.endDate || ""}
                    </p>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 mt-2 leading-relaxed text-justify break-words whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '8px' }}>
              Eğitim
            </h2>
            <div className="space-y-6">
              {data.education.map((edu, index) => (
                <div key={index} className="pl-4 border-l-4" style={{ borderColor: '#1e3a8a' }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{edu.degree || "Derece"}</h3>
                      <p className="text-lg font-medium" style={{ color: '#1e3a8a' }}>{edu.school || "Okul"}</p>
                      {edu.field && <p className="text-gray-600">{edu.field}</p>}
                    </div>
                    <p className="text-sm text-gray-600 whitespace-nowrap">
                      {edu.startDate && `${edu.startDate} - `}
                      {edu.endDate || ""}
                    </p>
                  </div>
                  {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '8px' }}>
              Beceriler
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 border-2 rounded"
                  style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '8px' }}>
              Diller
            </h2>
            <div className="space-y-2">
              {data.languages.map((lang, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">{lang.name || "Dil"}</span>
                  <span className="text-gray-600">{lang.level || "Seviye"}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '8px' }}>
              Sertifikalar
            </h2>
            <div className="space-y-4">
              {data.certifications.map((cert, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900">{cert.name || "Sertifika"}</h3>
                  <p className="text-gray-600">{cert.issuer || "Kurum"}</p>
                  {cert.date && <p className="text-sm text-gray-500">{cert.date}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '8px' }}>
              Projeler
            </h2>
            <div className="space-y-4">
              {data.projects.map((project, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900">{project.name || "Proje Adı"}</h3>
                  {project.technologies && <p className="text-sm text-gray-600 mb-1">{project.technologies}</p>}
                  {project.description && (
                    <p className="text-gray-700 text-justify break-words whitespace-pre-line">
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {data.achievements.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '8px' }}>
              Başarılar
            </h2>
            <div className="space-y-3">
              {data.achievements.map((achievement, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900">{achievement.title || "Başlık"}</h3>
                  {achievement.description && (
                    <p className="text-gray-700 text-sm break-words whitespace-pre-line">
                      {achievement.description}
                    </p>
                  )}
                  {achievement.date && <p className="text-gray-600 text-xs">{achievement.date}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* References */}
        {data.references.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '8px' }}>
              Referanslar
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {data.references.map((ref, index) => (
                <div key={index}>
                  <p className="font-semibold text-gray-900">{ref.name || "İsim"}</p>
                  <p className="text-sm text-gray-600">{ref.position || "Pozisyon"}</p>
                  <p className="text-sm text-gray-600">{ref.company || "Şirket"}</p>
                  <p className="text-xs text-gray-500">{ref.email || ""}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hobbies */}
        {data.hobbies.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '8px' }}>
              Hobiler
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.hobbies.map((hobby, index) => (
                <span key={index} className="text-gray-700">
                  {hobby}{index < data.hobbies.length - 1 ? ',' : ''}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

