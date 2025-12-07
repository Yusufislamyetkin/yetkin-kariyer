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
    <div 
      className="bg-white text-gray-900 break-words overflow-hidden" 
      style={{ 
        fontFamily: 'Georgia, serif',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className="max-w-4xl mx-auto p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header className="text-center border-b-4 border-navy-900 pb-3 mb-3 flex-shrink-0" style={{ borderColor: '#1e3a8a' }}>
          <h1 className="text-2xl font-bold text-navy-900 mb-2" style={{ color: '#1e3a8a' }}>
            {data.personalInfo.name || "Ad Soyad"}
          </h1>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-700">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
            {data.personalInfo.address && <span>• {data.personalInfo.address}</span>}
            {data.personalInfo.linkedin && <span>• {data.personalInfo.linkedin}</span>}
            {data.personalInfo.website && <span>• {data.personalInfo.website}</span>}
          </div>
          {data.personalInfo.profilePhoto && (
            <div className="mt-2">
              <img
                src={data.personalInfo.profilePhoto}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover mx-auto border-2"
                style={{ borderColor: '#1e3a8a' }}
              />
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>

          {/* Summary */}
          {data.summary && (
            <section className="mb-2">
              <h2 className="text-lg font-bold mb-1" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '4px' }}>
                Profesyonel Özet
              </h2>
              <p className="text-gray-700 text-sm leading-tight text-justify break-words whitespace-pre-line">
                {data.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold mb-2" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '4px' }}>
                İş Deneyimi
              </h2>
              <div className="space-y-1.5">
                {data.experience.map((exp, index) => (
                  <div key={index} className="pl-2 border-l-4" style={{ borderColor: '#1e3a8a' }}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{exp.position || "Pozisyon"}</h3>
                        <p className="text-sm font-medium" style={{ color: '#1e3a8a' }}>{exp.company || "Şirket"}</p>
                      </div>
                      <p className="text-xs text-gray-600 whitespace-nowrap">
                        {exp.startDate && `${exp.startDate} - `}
                        {exp.current ? "Devam ediyor" : exp.endDate || ""}
                      </p>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 text-xs mt-1 leading-tight text-justify break-words whitespace-pre-line line-clamp-2">
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
            <section className="mb-2">
              <h2 className="text-lg font-bold mb-2" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '4px' }}>
                Eğitim
              </h2>
              <div className="space-y-1.5">
                {data.education.map((edu, index) => (
                  <div key={index} className="pl-2 border-l-4" style={{ borderColor: '#1e3a8a' }}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{edu.degree || "Derece"}</h3>
                        <p className="text-sm font-medium" style={{ color: '#1e3a8a' }}>{edu.school || "Okul"}</p>
                        {edu.field && <p className="text-gray-600 text-xs">{edu.field}</p>}
                      </div>
                      <p className="text-xs text-gray-600 whitespace-nowrap">
                        {edu.startDate && `${edu.startDate} - `}
                        {edu.endDate || ""}
                      </p>
                    </div>
                    {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold mb-1" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '4px' }}>
                Beceriler
              </h2>
              <div className="flex flex-wrap gap-1">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 border-2 rounded text-xs"
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
            <section className="mb-2">
              <h2 className="text-lg font-bold mb-1" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '4px' }}>
                Diller
              </h2>
              <div className="space-y-1">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 text-xs">{lang.name || "Dil"}</span>
                    <span className="text-gray-600 text-xs">{lang.level || "Seviye"}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold mb-1" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '4px' }}>
                Sertifikalar
              </h2>
              <div className="space-y-1">
                {data.certifications.map((cert, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900 text-xs">{cert.name || "Sertifika"}</h3>
                    <p className="text-gray-600 text-xs">{cert.issuer || "Kurum"}</p>
                    {cert.date && <p className="text-xs text-gray-500">{cert.date}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold mb-1" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '4px' }}>
                Projeler
              </h2>
              <div className="space-y-1.5">
                {data.projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900 text-xs">{project.name || "Proje Adı"}</h3>
                    {project.technologies && <p className="text-xs text-gray-600 mb-0.5">{project.technologies}</p>}
                    {project.description && (
                      <p className="text-gray-700 text-xs text-justify break-words whitespace-pre-line line-clamp-2">
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
            <section className="mb-2">
              <h2 className="text-lg font-bold mb-1" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '4px' }}>
                Başarılar
              </h2>
              <div className="space-y-1">
                {data.achievements.map((achievement, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900 text-xs">{achievement.title || "Başlık"}</h3>
                    {achievement.description && (
                      <p className="text-gray-700 text-xs break-words whitespace-pre-line line-clamp-1">
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
            <section className="mb-2">
              <h2 className="text-lg font-bold mb-1" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '4px' }}>
                Referanslar
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {data.references.map((ref, index) => (
                  <div key={index}>
                    <p className="font-semibold text-gray-900 text-xs">{ref.name || "İsim"}</p>
                    <p className="text-xs text-gray-600">{ref.position || "Pozisyon"}</p>
                    <p className="text-xs text-gray-600">{ref.company || "Şirket"}</p>
                    <p className="text-xs text-gray-500">{ref.email || ""}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hobbies */}
          {data.hobbies.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-1" style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '4px' }}>
                Hobiler
              </h2>
              <div className="flex flex-wrap gap-1">
                {data.hobbies.map((hobby, index) => (
                  <span key={index} className="text-gray-700 text-xs">
                    {hobby}{index < data.hobbies.length - 1 ? ',' : ''}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

