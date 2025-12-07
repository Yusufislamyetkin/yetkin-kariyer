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

interface StartupTemplateProps {
  data: CVData;
}

export default function StartupTemplate({ data }: StartupTemplateProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 text-gray-900 break-words overflow-hidden" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="max-w-5xl mx-auto flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            {data.personalInfo.profilePhoto && (
              <img
                src={data.personalInfo.profilePhoto}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-lg"
              />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{data.personalInfo.name || "Ad Soyad"}</h1>
              <div className="flex flex-wrap gap-2 text-purple-100 text-xs">
                {data.personalInfo.email && <span>✉ {data.personalInfo.email}</span>}
                {data.personalInfo.phone && <span>📱 {data.personalInfo.phone}</span>}
                {data.personalInfo.address && <span>📍 {data.personalInfo.address}</span>}
                {data.personalInfo.linkedin && <span>💼 {data.personalInfo.linkedin}</span>}
                {data.personalInfo.website && <span>🌐 {data.personalInfo.website}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Summary */}
          {data.summary && (
            <section className="mb-2 bg-white p-3 rounded-lg shadow-sm border-l-4 border-purple-600 flex-shrink-0">
              <h2 className="text-lg font-bold text-purple-600 mb-1">Özet</h2>
              <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-sm">
                {data.summary}
              </p>
            </section>
          )}

          <div className="grid md:grid-cols-2 gap-4 flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            {/* Main Content */}
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '100%' }}>
              {/* Experience */}
              {data.experience.length > 0 && (
                <section className="bg-white p-3 rounded-lg shadow-sm">
                  <h2 className="text-lg font-bold text-purple-600 mb-2 flex items-center gap-1">
                    <span className="w-0.5 h-4 bg-purple-600"></span>
                    İş Deneyimi
                  </h2>
                  <div className="space-y-1.5">
                    {data.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-purple-300 pl-2">
                        <h3 className="text-base font-semibold text-gray-900">{exp.position || "Pozisyon"}</h3>
                        <p className="text-purple-600 font-medium text-sm">{exp.company || "Şirket"}</p>
                        <p className="text-xs text-gray-600 mb-1">
                          {exp.startDate && `${exp.startDate} - `}
                          {exp.current ? "Devam ediyor" : exp.endDate || ""}
                        </p>
                        {exp.description && (
                          <p className="text-gray-700 mt-1 leading-tight break-words whitespace-pre-line text-xs line-clamp-2">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {data.projects.length > 0 && (
                <section className="bg-white p-3 rounded-lg shadow-sm">
                  <h2 className="text-lg font-bold text-purple-600 mb-2 flex items-center gap-1">
                    <span className="w-0.5 h-4 bg-purple-600"></span>
                    Projeler
                  </h2>
                  <div className="space-y-1.5">
                    {data.projects.map((project, index) => (
                      <div key={index} className="border-l-2 border-purple-300 pl-2">
                        <h3 className="text-base font-semibold text-gray-900">{project.name || "Proje Adı"}</h3>
                        {project.technologies && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.technologies.split(',').map((tech, i) => (
                              <span key={i} className="px-1 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        {project.description && (
                          <p className="text-gray-700 mt-1 leading-tight break-words whitespace-pre-line text-xs line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '100%' }}>
              {/* Skills */}
              {data.skills.length > 0 && (
                <section className="bg-white p-3 rounded-lg shadow-sm">
                  <h2 className="text-lg font-bold text-purple-600 mb-1">Beceriler</h2>
                  <div className="flex flex-wrap gap-1">
                    {data.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-0.5 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {data.education.length > 0 && (
                <section className="bg-white p-3 rounded-lg shadow-sm">
                  <h2 className="text-lg font-bold text-purple-600 mb-1">Eğitim</h2>
                  <div className="space-y-1">
                    {data.education.map((edu, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-gray-900 text-xs">{edu.degree || "Derece"}</h3>
                        <p className="text-purple-600 text-xs">{edu.school || "Okul"}</p>
                        <p className="text-gray-600 text-xs mt-0.5">
                          {edu.startDate && `${edu.startDate} - `}
                          {edu.endDate || ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Achievements */}
              {data.achievements.length > 0 && (
                <section className="bg-white p-3 rounded-lg shadow-sm mb-2">
                  <h2 className="text-lg font-bold text-purple-600 mb-1">Başarılar</h2>
                  <div className="space-y-1">
                    {data.achievements.map((achievement, index) => (
                      <div key={index} className="border-l-2 border-purple-300 pl-2">
                        <h3 className="font-semibold text-gray-900 text-xs">{achievement.title || "Başlık"}</h3>
                        {achievement.description && (
                          <p className="text-gray-700 mt-0.5 break-words whitespace-pre-line text-xs line-clamp-1">
                            {achievement.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {data.certifications.length > 0 && (
                <section className="bg-white p-3 rounded-lg shadow-sm mb-2">
                  <h2 className="text-lg font-bold text-purple-600 mb-1">Sertifikalar</h2>
                  <div className="space-y-1">
                    {data.certifications.map((cert, index) => (
                      <div key={index} className="border-l-2 border-purple-300 pl-2">
                        <h3 className="font-semibold text-gray-900 text-xs">{cert.name || "Sertifika"}</h3>
                        <p className="text-purple-600 text-xs">{cert.issuer || "Kurum"}</p>
                        {cert.date && <p className="text-gray-600 text-xs mt-0.5">{cert.date}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Languages */}
              {data.languages.length > 0 && (
                <section className="bg-white p-3 rounded-lg shadow-sm mb-2">
                  <h2 className="text-lg font-bold text-purple-600 mb-1">Diller</h2>
                  <div className="space-y-1">
                    {data.languages.map((lang, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-900 font-medium text-xs">{lang.name || "Dil"}</span>
                        <span className="text-purple-600 text-xs">{lang.level || "Seviye"}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Hobbies */}
              {data.hobbies.length > 0 && (
                <section className="bg-white p-3 rounded-lg shadow-sm mb-2">
                  <h2 className="text-lg font-bold text-purple-600 mb-1">Hobiler</h2>
                  <div className="flex flex-wrap gap-1">
                    {data.hobbies.map((hobby, index) => (
                      <span key={index} className="px-2 py-0.5 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-xs font-medium">
                        {hobby}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* References */}
              {data.references.length > 0 && (
                <section className="bg-white p-3 rounded-lg shadow-sm">
                  <h2 className="text-lg font-bold text-purple-600 mb-1">Referanslar</h2>
                  <div className="space-y-1">
                    {data.references.map((ref, index) => (
                      <div key={index} className="border-l-2 border-purple-300 pl-2">
                        <p className="font-semibold text-gray-900 text-xs">{ref.name || "İsim"}</p>
                        <p className="text-purple-600 text-xs">{ref.position || "Pozisyon"}, {ref.company || "Şirket"}</p>
                        <p className="text-gray-600 text-xs mt-0.5">{ref.email || ""} | {ref.phone || ""}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

