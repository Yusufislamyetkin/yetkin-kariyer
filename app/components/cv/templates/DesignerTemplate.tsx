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

interface DesignerTemplateProps {
  data: CVData;
}

export default function DesignerTemplate({ data }: DesignerTemplateProps) {
  return (
    <div className="bg-white text-gray-900 break-words overflow-hidden" style={{ fontFamily: 'Helvetica, Arial, sans-serif', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="max-w-6xl mx-auto flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Creative Header */}
        <div className="bg-black text-white p-4 relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500 rounded-full opacity-20 -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 rounded-full opacity-20 -ml-12 -mb-12"></div>
          <div className="relative flex items-center gap-4">
            {data.personalInfo.profilePhoto && (
              <img
                src={data.personalInfo.profilePhoto}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-pink-500 shadow-lg"
              />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1" style={{ letterSpacing: '1px' }}>
                {data.personalInfo.name || "Ad Soyad"}
              </h1>
              <div className="flex flex-wrap gap-2 text-gray-300 text-xs">
                {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
                {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Summary */}
          {data.summary && (
            <section className="mb-2 flex-shrink-0">
              <div className="h-0.5 w-12 bg-pink-500 mb-1"></div>
              <h2 className="text-lg font-bold mb-1 text-gray-900">Özet</h2>
              <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-sm line-clamp-3">
                {data.summary}
              </p>
            </section>
          )}

          <div className="grid md:grid-cols-2 gap-4 flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            {/* Main Content */}
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '100%' }}>
              {/* Experience */}
              {data.experience.length > 0 && (
                <section>
                  <div className="h-0.5 w-12 bg-pink-500 mb-1"></div>
                  <h2 className="text-lg font-bold mb-2 text-gray-900">İş Deneyimi</h2>
                  <div className="space-y-1.5">
                    {data.experience.map((exp, index) => (
                      <div key={index} className="relative pl-3 border-l-4 border-pink-500">
                        <h3 className="text-base font-bold text-gray-900 mb-0.5">{exp.position || "Pozisyon"}</h3>
                        <p className="text-pink-600 font-semibold text-sm mb-1">{exp.company || "Şirket"}</p>
                        <p className="text-xs text-gray-600 mb-1">
                          {exp.startDate && `${exp.startDate} - `}
                          {exp.current ? "Devam ediyor" : exp.endDate || ""}
                        </p>
                        {exp.description && (
                          <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-xs line-clamp-2">
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
                <section>
                  <div className="h-0.5 w-12 bg-pink-500 mb-1"></div>
                  <h2 className="text-lg font-bold mb-2 text-gray-900">Projeler</h2>
                  <div className="space-y-1.5">
                    {data.projects.map((project, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded-lg">
                        <h3 className="text-base font-bold text-gray-900 mb-1">{project.name || "Proje Adı"}</h3>
                        {project.technologies && (
                          <div className="flex flex-wrap gap-1 mb-1">
                            {project.technologies.split(',').map((tech, i) => (
                              <span key={i} className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        {project.description && (
                          <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-xs line-clamp-2">
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
                <section>
                  <div className="h-0.5 w-12 bg-pink-500 mb-1"></div>
                  <h2 className="text-lg font-bold mb-2 text-gray-900">Beceriler</h2>
                  <div className="flex flex-wrap gap-1">
                    {data.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-black text-white rounded text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {data.education.length > 0 && (
                <section>
                  <div className="h-0.5 w-12 bg-pink-500 mb-1"></div>
                  <h2 className="text-lg font-bold mb-2 text-gray-900">Eğitim</h2>
                  <div className="space-y-1">
                    {data.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-pink-500 pl-2">
                        <h3 className="font-bold text-gray-900 text-xs">{edu.degree || "Derece"}</h3>
                        <p className="text-pink-600 font-medium text-xs">{edu.school || "Okul"}</p>
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
                <section>
                  <div className="h-0.5 w-12 bg-pink-500 mb-1"></div>
                  <h2 className="text-lg font-bold mb-2 text-gray-900">Başarılar</h2>
                  <div className="space-y-1">
                    {data.achievements.map((achievement, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded-lg">
                        <h3 className="font-bold text-gray-900 text-xs mb-0.5">{achievement.title || "Başlık"}</h3>
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
              {data.certifications.length > 0 && (
                <section>
                  <div className="h-0.5 w-12 bg-pink-500 mb-1"></div>
                  <h2 className="text-lg font-bold mb-2 text-gray-900">Sertifikalar</h2>
                  <div className="space-y-1">
                    {data.certifications.map((cert, index) => (
                      <div key={index} className="border-l-4 border-pink-500 pl-2">
                        <h3 className="font-bold text-gray-900 text-xs">{cert.name}</h3>
                        <p className="text-pink-600 font-medium text-xs">{cert.issuer}</p>
                        {cert.date && <p className="text-gray-600 text-xs mt-0.5">{cert.date}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.languages.length > 0 && (
                <section>
                  <div className="h-0.5 w-12 bg-pink-500 mb-1"></div>
                  <h2 className="text-lg font-bold mb-2 text-gray-900">Diller</h2>
                  <div className="space-y-1">
                    {data.languages.map((lang, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-900 font-medium text-xs">{lang.name}</span>
                        <span className="text-pink-600 text-xs">{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.hobbies.length > 0 && (
                <section>
                  <div className="h-0.5 w-12 bg-pink-500 mb-1"></div>
                  <h2 className="text-lg font-bold mb-2 text-gray-900">Hobiler</h2>
                  <div className="flex flex-wrap gap-1">
                    {data.hobbies.map((hobby, index) => (
                      <span key={index} className="px-2 py-0.5 bg-black text-white rounded text-xs font-semibold">{hobby}</span>
                    ))}
                  </div>
                </section>
              )}
              {data.references.length > 0 && (
                <section>
                  <div className="h-0.5 w-12 bg-pink-500 mb-1"></div>
                  <h2 className="text-lg font-bold mb-2 text-gray-900">Referanslar</h2>
                  <div className="space-y-1">
                    {data.references.map((ref, index) => (
                      <div key={index} className="border-l-4 border-pink-500 pl-2">
                        <p className="font-bold text-gray-900 text-xs">{ref.name}</p>
                        <p className="text-pink-600 font-medium text-xs">{ref.position}, {ref.company}</p>
                        <p className="text-gray-600 text-xs mt-0.5">{ref.email} | {ref.phone}</p>
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

