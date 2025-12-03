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

interface CreativeTemplateProps {
  data: CVData;
}

export default function CreativeTemplate({ data }: CreativeTemplateProps) {
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
      {/* Gradient Header */}
      <div 
        className="text-white p-4 relative overflow-hidden flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
        }}
      >
        <div className="relative z-10 flex items-center gap-3">
          {data.personalInfo.profilePhoto && (
            <div className="relative">
              <img
                src={data.personalInfo.profilePhoto}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"></div>
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1 drop-shadow-lg">{data.personalInfo.name || "Ad Soyad"}</h1>
            <div className="flex flex-wrap gap-2 text-xs bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
              {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
              {data.personalInfo.address && <span>• {data.personalInfo.address}</span>}
              {data.personalInfo.linkedin && <span>• {data.personalInfo.linkedin}</span>}
              {data.personalInfo.website && <span>• {data.personalInfo.website}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Summary */}
        {data.summary && (
          <section className="mb-2 p-3 rounded-xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <h2 className="text-lg font-bold mb-1" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Profesyonel Özet
            </h2>
            <p className="text-gray-800 text-sm leading-tight break-words whitespace-pre-line line-clamp-3">
              {data.summary}
            </p>
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-4 flex-1 overflow-hidden" style={{ minHeight: 0 }}>
          {/* Left Column */}
          <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '100%' }}>
            {/* Experience */}
            {data.experience.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-2 pb-1 relative inline-block" style={{ color: '#667eea' }}>
                  İş Deneyimi
                  <span className="absolute bottom-0 left-0 w-full h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}></span>
                </h2>
                <div className="space-y-1.5">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="relative pl-3">
                      <div className="absolute left-0 top-1 w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
                      <div className="ml-3">
                        <h3 className="text-base font-bold text-gray-900 mb-0.5">{exp.position || "Pozisyon"}</h3>
                        <p className="text-sm font-semibold mb-1" style={{ color: '#764ba2' }}>{exp.company || "Şirket"}</p>
                        <p className="text-xs text-gray-600 mb-1">
                          {exp.startDate && `${exp.startDate} - `}
                          {exp.current ? "Devam ediyor" : exp.endDate || ""}
                        </p>
                        {exp.description && (
                          <p className="text-gray-700 text-xs leading-tight break-words whitespace-pre-line line-clamp-2">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-2 pb-1 relative inline-block" style={{ color: '#667eea' }}>
                  Eğitim
                  <span className="absolute bottom-0 left-0 w-full h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}></span>
                </h2>
                <div className="space-y-1.5">
                  {data.education.map((edu, index) => (
                    <div key={index} className="relative pl-3">
                      <div className="absolute left-0 top-1 w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
                      <div className="ml-3">
                        <h3 className="text-base font-bold text-gray-900 mb-0.5">{edu.degree || "Derece"}</h3>
                        <p className="text-sm font-semibold mb-1" style={{ color: '#764ba2' }}>{edu.school || "Okul"}</p>
                        {edu.field && <p className="text-gray-600 text-xs mb-0.5">{edu.field}</p>}
                        <p className="text-xs text-gray-600">
                          {edu.startDate && `${edu.startDate} - `}
                          {edu.endDate || ""}
                          {edu.gpa && ` • GPA: ${edu.gpa}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-2 pb-1 relative inline-block" style={{ color: '#667eea' }}>
                  Projeler
                  <span className="absolute bottom-0 left-0 w-full h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}></span>
                </h2>
                <div className="space-y-1.5">
                  {data.projects.map((project, index) => (
                    <div key={index} className="p-2 rounded-lg border-2" style={{ borderColor: '#667eea' }}>
                      <h3 className="text-base font-bold text-gray-900 mb-1">{project.name || "Proje Adı"}</h3>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1 mb-1">
                          {project.technologies.split(',').map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.description && (
                        <p className="text-gray-700 text-xs leading-tight break-words whitespace-pre-line line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '100%' }}>
            {/* Skills */}
            {data.skills.length > 0 && (
              <section className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                <h2 className="text-base font-bold mb-1" style={{ color: '#667eea' }}>
                  Beceriler
                </h2>
                <div className="flex flex-wrap gap-1">
                  {data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 rounded-full text-xs font-semibold text-white shadow"
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {data.languages.length > 0 && (
              <section>
                <h2 className="text-base font-bold mb-1" style={{ color: '#667eea' }}>
                  Diller
                </h2>
                <div className="space-y-1">
                  {data.languages.map((lang, index) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                      <span className="font-bold text-gray-900 text-xs">{lang.name || "Dil"}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        {lang.level || "Seviye"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {data.certifications.length > 0 && (
              <section>
                <h2 className="text-base font-bold mb-1" style={{ color: '#667eea' }}>
                  Sertifikalar
                </h2>
                <div className="space-y-1">
                  {data.certifications.map((cert, index) => (
                    <div key={index} className="p-2 rounded-lg border-2" style={{ borderColor: '#667eea' }}>
                      <h3 className="font-bold text-gray-900 text-xs mb-0.5">{cert.name || "Sertifika"}</h3>
                      <p className="text-xs font-semibold mb-0.5" style={{ color: '#764ba2' }}>{cert.issuer || "Kurum"}</p>
                      {cert.date && <p className="text-xs text-gray-600">{cert.date}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Achievements */}
            {data.achievements.length > 0 && (
              <section>
                <h2 className="text-base font-bold mb-1" style={{ color: '#667eea' }}>
                  Başarılar
                </h2>
                <div className="space-y-1">
                  {data.achievements.map((achievement, index) => (
                    <div key={index} className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                      <h3 className="font-bold text-gray-900 text-xs mb-0.5">{achievement.title || "Başlık"}</h3>
                      {achievement.description && (
                        <p className="text-xs text-gray-700 mt-0.5 break-words whitespace-pre-line line-clamp-1">
                          {achievement.description}
                        </p>
                      )}
                      {achievement.date && (
                        <p className="text-xs text-gray-600 mt-1">{achievement.date}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Hobbies */}
            {data.hobbies.length > 0 && (
              <section>
                <h2 className="text-base font-bold mb-1" style={{ color: '#667eea' }}>
                  Hobiler
                </h2>
                <div className="flex flex-wrap gap-1">
                  {data.hobbies.map((hobby, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ 
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white'
                      }}
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
                <h2 className="text-base font-bold mb-1" style={{ color: '#667eea' }}>
                  Referanslar
                </h2>
                <div className="space-y-1">
                  {data.references.map((ref, index) => (
                    <div key={index} className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                      <p className="font-bold text-gray-900 text-xs">{ref.name || "İsim"}</p>
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

