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
      className="bg-white text-gray-900 break-words"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* Gradient Header */}
      <div 
        className="text-white p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
        }}
      >
        <div className="relative z-10 flex items-center gap-6">
          {data.personalInfo.profilePhoto && (
            <div className="relative">
              <img
                src={data.personalInfo.profilePhoto}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full border-4 border-white"></div>
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-3 drop-shadow-lg">{data.personalInfo.name || "Ad Soyad"}</h1>
            <div className="flex flex-wrap gap-4 text-sm bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
              {data.personalInfo.address && <span>• {data.personalInfo.address}</span>}
              {data.personalInfo.linkedin && <span>• {data.personalInfo.linkedin}</span>}
              {data.personalInfo.website && <span>• {data.personalInfo.website}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {data.summary && (
          <section className="mb-8 p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <h2 className="text-3xl font-bold mb-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Profesyonel Özet
            </h2>
            <p className="text-gray-800 leading-relaxed text-lg break-words whitespace-pre-line">
              {data.summary}
            </p>
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Experience */}
            {data.experience.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-6 pb-3 relative inline-block" style={{ color: '#667eea' }}>
                  İş Deneyimi
                  <span className="absolute bottom-0 left-0 w-full h-1 rounded-full" style={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}></span>
                </h2>
                <div className="space-y-6">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="relative pl-6">
                      <div className="absolute left-0 top-2 w-4 h-4 rounded-full" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{exp.position || "Pozisyon"}</h3>
                        <p className="text-lg font-semibold mb-2" style={{ color: '#764ba2' }}>{exp.company || "Şirket"}</p>
                        <p className="text-sm text-gray-600 mb-3">
                          {exp.startDate && `${exp.startDate} - `}
                          {exp.current ? "Devam ediyor" : exp.endDate || ""}
                        </p>
                        {exp.description && (
                          <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">
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
                <h2 className="text-3xl font-bold mb-6 pb-3 relative inline-block" style={{ color: '#667eea' }}>
                  Eğitim
                  <span className="absolute bottom-0 left-0 w-full h-1 rounded-full" style={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}></span>
                </h2>
                <div className="space-y-6">
                  {data.education.map((edu, index) => (
                    <div key={index} className="relative pl-6">
                      <div className="absolute left-0 top-2 w-4 h-4 rounded-full" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{edu.degree || "Derece"}</h3>
                        <p className="text-lg font-semibold mb-2" style={{ color: '#764ba2' }}>{edu.school || "Okul"}</p>
                        {edu.field && <p className="text-gray-600 mb-1">{edu.field}</p>}
                        <p className="text-sm text-gray-600">
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
                <h2 className="text-3xl font-bold mb-6 pb-3 relative inline-block" style={{ color: '#667eea' }}>
                  Projeler
                  <span className="absolute bottom-0 left-0 w-full h-1 rounded-full" style={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}></span>
                </h2>
                <div className="space-y-6">
                  {data.projects.map((project, index) => (
                    <div key={index} className="p-4 rounded-xl border-2" style={{ borderColor: '#667eea' }}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name || "Proje Adı"}</h3>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.technologies.split(',').map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-full text-sm font-medium text-white"
                              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.description && (
                        <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">
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
          <div className="space-y-8">
            {/* Skills */}
            {data.skills.length > 0 && (
              <section className="p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#667eea' }}>
                  Beceriler
                </h2>
                <div className="flex flex-wrap gap-3">
                  {data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg"
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
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#667eea' }}>
                  Diller
                </h2>
                <div className="space-y-3">
                  {data.languages.map((lang, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                      <span className="font-bold text-gray-900">{lang.name || "Dil"}</span>
                      <span className="text-sm font-semibold px-3 py-1 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
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
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#667eea' }}>
                  Sertifikalar
                </h2>
                <div className="space-y-4">
                  {data.certifications.map((cert, index) => (
                    <div key={index} className="p-4 rounded-xl border-2" style={{ borderColor: '#667eea' }}>
                      <h3 className="font-bold text-gray-900 mb-1">{cert.name || "Sertifika"}</h3>
                      <p className="text-sm font-semibold mb-1" style={{ color: '#764ba2' }}>{cert.issuer || "Kurum"}</p>
                      {cert.date && <p className="text-xs text-gray-600">{cert.date}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Achievements */}
            {data.achievements.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#667eea' }}>
                  Başarılar
                </h2>
                <div className="space-y-4">
                  {data.achievements.map((achievement, index) => (
                    <div key={index} className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                      <h3 className="font-bold text-gray-900 mb-1">{achievement.title || "Başlık"}</h3>
                      {achievement.description && (
                        <p className="text-sm text-gray-700 mt-1 break-words whitespace-pre-line">
                          {achievement.description}
                        </p>
                      )}
                      {achievement.date && (
                        <p className="text-xs text-gray-600 mt-2">{achievement.date}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Hobbies */}
            {data.hobbies.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#667eea' }}>
                  Hobiler
                </h2>
                <div className="flex flex-wrap gap-3">
                  {data.hobbies.map((hobby, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full text-sm font-medium"
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
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#667eea' }}>
                  Referanslar
                </h2>
                <div className="space-y-3">
                  {data.references.map((ref, index) => (
                    <div key={index} className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                      <p className="font-bold text-gray-900">{ref.name || "İsim"}</p>
                      <p className="text-sm text-gray-600">{ref.position || "Pozisyon"}</p>
                      <p className="text-sm text-gray-600">{ref.company || "Şirket"}</p>
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

