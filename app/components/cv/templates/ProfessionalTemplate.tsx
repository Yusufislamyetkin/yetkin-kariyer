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

interface ProfessionalTemplateProps {
  data: CVData;
}

export default function ProfessionalTemplate({ data }: ProfessionalTemplateProps) {
  return (
    <div
      className="bg-white text-gray-900 break-words overflow-hidden"
      style={{ 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className="max-w-5xl mx-auto flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Header with Sidebar */}
        <div className="flex border-b-4 flex-shrink-0" style={{ borderColor: '#1e40af' }}>
          {/* Main Header */}
          <div className="flex-1 p-4">
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#1e40af' }}>
              {data.personalInfo.name || "Ad Soyad"}
            </h1>
            <div className="space-y-0.5 text-xs text-gray-700">
              {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
              {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
              {data.personalInfo.address && <p>{data.personalInfo.address}</p>}
              {data.personalInfo.linkedin && <p>{data.personalInfo.linkedin}</p>}
              {data.personalInfo.website && <p>{data.personalInfo.website}</p>}
            </div>
          </div>
          {/* Photo Sidebar */}
          {data.personalInfo.profilePhoto && (
            <div className="w-32 p-2 bg-gray-50 flex items-center justify-center border-l-4" style={{ borderColor: '#1e40af' }}>
              <img
                src={data.personalInfo.profilePhoto}
                alt="Profile"
                className="w-20 h-20 rounded object-cover border-2"
                style={{ borderColor: '#1e40af' }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
          {/* Main Content */}
          <div className="flex-1 p-4 space-y-2 overflow-y-auto" style={{ maxHeight: '100%' }}>
            {/* Summary */}
            {data.summary && (
              <section className="border-l-4 pl-2" style={{ borderColor: '#1e40af' }}>
                <h2 className="text-lg font-bold mb-1" style={{ color: '#1e40af' }}>
                  Profesyonel Özet
                </h2>
                <p className="text-gray-700 text-sm leading-tight break-words whitespace-pre-line line-clamp-3">
                  {data.summary}
                </p>
              </section>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-2 pb-1 border-b-2" style={{ color: '#1e40af', borderColor: '#1e40af' }}>
                  İş Deneyimi
                </h2>
                <div className="space-y-1.5">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="border-b border-gray-200 pb-2 last:border-b-0">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">{exp.position || "Pozisyon"}</h3>
                          <p className="text-sm font-medium text-gray-700">{exp.company || "Şirket"}</p>
                        </div>
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded whitespace-nowrap">
                          {exp.startDate && `${exp.startDate} - `}
                          {exp.current ? "Devam ediyor" : exp.endDate || ""}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 text-xs mt-1 leading-tight pl-2 border-l-2 border-gray-300 break-words whitespace-pre-line line-clamp-2">
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
              <section>
                <h2 className="text-lg font-bold mb-2 pb-1 border-b-2" style={{ color: '#1e40af', borderColor: '#1e40af' }}>
                  Eğitim
                </h2>
                <div className="space-y-1.5">
                  {data.education.map((edu, index) => (
                    <div key={index} className="border-b border-gray-200 pb-2 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">{edu.degree || "Derece"}</h3>
                          <p className="text-sm font-medium text-gray-700">{edu.school || "Okul"}</p>
                          {edu.field && <p className="text-gray-600 text-xs">{edu.field}</p>}
                          {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
                        </div>
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {edu.startDate && `${edu.startDate} - `}
                          {edu.endDate || ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-2 pb-1 border-b-2" style={{ color: '#1e40af', borderColor: '#1e40af' }}>
                  Projeler
                </h2>
                <div className="space-y-1.5">
                  {data.projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-2">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{project.name || "Proje Adı"}</h3>
                      {project.technologies && (
                        <p className="text-xs text-gray-600 mb-1">
                          <span className="font-semibold">Teknolojiler:</span> {project.technologies}
                        </p>
                      )}
                      {project.description && (
                        <p className="text-gray-700 text-xs leading-tight break-words whitespace-pre-line line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      {project.url && (
                        <a href={project.url} className="text-xs" style={{ color: '#1e40af' }}>
                          {project.url}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Achievements */}
            {data.achievements.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-2 pb-1 border-b-2" style={{ color: '#1e40af', borderColor: '#1e40af' }}>
                  Başarılar
                </h2>
                <div className="space-y-1">
                  {data.achievements.map((achievement, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: '#1e40af' }}></div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-xs">{achievement.title || "Başlık"}</h3>
                        {achievement.description && (
                          <p className="text-gray-700 text-xs mt-0.5 break-words whitespace-pre-line line-clamp-1">
                            {achievement.description}
                          </p>
                        )}
                        {achievement.date && (
                          <p className="text-gray-600 text-xs mt-0.5">{achievement.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-48 bg-gray-50 p-3 space-y-2 border-l-2 border-gray-200 overflow-y-auto" style={{ maxHeight: '100%' }}>
            {/* Skills */}
            {data.skills.length > 0 && (
              <section>
                <h2 className="text-base font-bold mb-1 pb-1 border-b-2" style={{ color: '#1e40af', borderColor: '#1e40af' }}>
                  Beceriler
                </h2>
                <div className="space-y-1">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="bg-white border border-gray-300 rounded px-2 py-1 text-xs text-center">
                      {skill}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {data.languages.length > 0 && (
              <section>
                <h2 className="text-base font-bold mb-1 pb-1 border-b-2" style={{ color: '#1e40af', borderColor: '#1e40af' }}>
                  Diller
                </h2>
                <div className="space-y-1.5">
                  {data.languages.map((lang, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-semibold text-xs text-gray-900">{lang.name || "Dil"}</span>
                        <span className="text-xs text-gray-600">{lang.level || "Seviye"}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: lang.level === 'Anadil' ? '100%' : lang.level === 'İleri' ? '80%' : lang.level === 'Orta' ? '60%' : '40%',
                            backgroundColor: '#1e40af'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {data.certifications.length > 0 && (
              <section>
                <h2 className="text-base font-bold mb-1 pb-1 border-b-2" style={{ color: '#1e40af', borderColor: '#1e40af' }}>
                  Sertifikalar
                </h2>
                <div className="space-y-1">
                  {data.certifications.map((cert, index) => (
                    <div key={index} className="bg-white border border-gray-300 rounded p-2">
                      <p className="font-semibold text-xs text-gray-900 mb-0.5">{cert.name || "Sertifika"}</p>
                      <p className="text-xs text-gray-600">{cert.issuer || "Kurum"}</p>
                      {cert.date && <p className="text-xs text-gray-500 mt-0.5">{cert.date}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Hobbies */}
            {data.hobbies.length > 0 && (
              <section>
                <h2 className="text-base font-bold mb-1 pb-1 border-b-2" style={{ color: '#1e40af', borderColor: '#1e40af' }}>
                  Hobiler
                </h2>
                <div className="flex flex-wrap gap-1">
                  {data.hobbies.map((hobby, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-white border border-gray-300 rounded text-xs text-gray-700"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* References */}
            {data.references.length > 0 && (
              <section>
                <h2 className="text-base font-bold mb-1 pb-1 border-b-2" style={{ color: '#1e40af', borderColor: '#1e40af' }}>
                  Referanslar
                </h2>
                <div className="space-y-1">
                  {data.references.map((ref, index) => (
                    <div key={index} className="bg-white border border-gray-300 rounded p-2">
                      <p className="font-semibold text-xs text-gray-900">{ref.name || "İsim"}</p>
                      <p className="text-xs text-gray-600">{ref.position || "Pozisyon"}</p>
                      <p className="text-xs text-gray-600">{ref.company || "Şirket"}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

