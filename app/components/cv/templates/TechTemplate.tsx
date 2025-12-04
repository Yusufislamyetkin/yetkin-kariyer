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

interface TechTemplateProps {
  data: CVData;
}

export default function TechTemplate({ data }: TechTemplateProps) {
  return (
    <div
      className="bg-gray-900 text-green-400 break-words overflow-hidden"
      style={{ fontFamily: 'monospace, "Courier New", Courier', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <div className="max-w-5xl mx-auto flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Terminal-style Header */}
        <div className="bg-black text-green-400 p-4 border-b-4 border-green-500 flex-shrink-0">
          <div className="flex items-center gap-3">
            {data.personalInfo.profilePhoto && (
              <div className="relative">
                <img
                  src={data.personalInfo.profilePhoto}
                  alt="Profile"
                  className="w-20 h-20 rounded object-cover border-2 border-green-500"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
            <div className="flex-1">
              <div className="mb-1">
                <span className="text-green-500 text-xs">$</span> <span className="text-gray-300 text-xs">cat profile.txt</span>
              </div>
              <h1 className="text-2xl font-bold mb-1 text-green-400 font-mono">
                {'> '}{data.personalInfo.name || "Ad Soyad"}
              </h1>
              <div className="space-y-0.5 text-xs font-mono">
                {data.personalInfo.email && (
                  <div><span className="text-gray-500">email:</span> <span className="text-green-300">{data.personalInfo.email}</span></div>
                )}
                {data.personalInfo.phone && (
                  <div><span className="text-gray-500">phone:</span> <span className="text-green-300">{data.personalInfo.phone}</span></div>
                )}
                {data.personalInfo.linkedin && (
                  <div><span className="text-gray-500">linkedin:</span> <span className="text-green-300">{data.personalInfo.linkedin}</span></div>
                )}
                {data.personalInfo.website && (
                  <div><span className="text-gray-500">website:</span> <span className="text-green-300">{data.personalInfo.website}</span></div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 p-4 text-gray-300 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Summary */}
          {data.summary && (
            <section className="mb-2 border-l-4 border-green-500 pl-2 flex-shrink-0">
              <div className="mb-1">
                <span className="text-green-500 font-mono text-xs">$</span> <span className="text-gray-400 font-mono text-xs">cat summary.txt</span>
              </div>
              <div className="text-green-400 mb-1 font-mono text-xs">{'// Profesyonel Özet'}</div>
              <p className="text-gray-300 leading-tight break-words whitespace-pre-line font-mono text-xs line-clamp-3">
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
                  <div className="mb-1">
                    <span className="text-green-500 font-mono text-xs">$</span> <span className="text-gray-400 font-mono text-xs">ls experience/</span>
                  </div>
                  <div className="text-green-400 mb-2 font-mono text-base">{'// İş Deneyimi'}</div>
                  <div className="space-y-1.5">
                    {data.experience.map((exp, index) => (
                      <div key={index} className="bg-black border border-green-500 p-2 rounded">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="text-green-400 font-bold mb-0.5 font-mono text-sm">{exp.position || "Pozisyon"}</h3>
                            <p className="text-green-300 font-mono text-xs">{exp.company || "Şirket"}</p>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded border border-green-500 font-mono">
                            {exp.startDate && `${exp.startDate} - `}
                            {exp.current ? "Devam ediyor" : exp.endDate || ""}
                          </span>
                        </div>
                        {exp.description && (
                          <div className="mt-1">
                            <span className="text-gray-500 font-mono text-xs">{'// Açıklama'}</span>
                            <p className="text-gray-300 leading-tight break-words whitespace-pre-line font-mono text-xs mt-1 line-clamp-2">
                              {exp.description}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {data.education.length > 0 && (
                <section>
                  <div className="mb-1">
                    <span className="text-green-500 font-mono text-xs">$</span> <span className="text-gray-400 font-mono text-xs">cat education.json</span>
                  </div>
                  <div className="text-green-400 mb-2 font-mono text-base">{'// Eğitim'}</div>
                  <div className="space-y-1.5">
                    {data.education.map((edu, index) => (
                      <div key={index} className="bg-black border border-green-500 p-2 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-green-400 font-bold mb-0.5 font-mono text-xs">{edu.degree || "Derece"}</h3>
                            <p className="text-green-300 font-mono text-xs">{edu.school || "Okul"}</p>
                            {edu.field && <p className="text-gray-400 font-mono text-xs mt-0.5">{edu.field}</p>}
                            {edu.gpa && <p className="text-gray-500 font-mono text-xs mt-0.5">GPA: {edu.gpa}</p>}
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded border border-green-500 font-mono">
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
                  <div className="mb-1">
                    <span className="text-green-500 font-mono text-xs">$</span> <span className="text-gray-400 font-mono text-xs">git log --oneline projects/</span>
                  </div>
                  <div className="text-green-400 mb-2 font-mono text-base">{'// Projeler'}</div>
                  <div className="space-y-1.5">
                    {data.projects.map((project, index) => (
                      <div key={index} className="bg-black border border-green-500 p-2 rounded">
                        <h3 className="text-green-400 font-bold mb-1 font-mono text-sm">{project.name || "Proje Adı"}</h3>
                        {project.technologies && (
                          <div className="mb-1">
                            <span className="text-gray-500 font-mono text-xs">{'// Stack:'}</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {project.technologies.split(',').map((tech, i) => (
                                <span
                                  key={i}
                                  className="px-1 py-0.5 bg-green-900 text-green-300 rounded text-xs font-mono border border-green-500"
                                >
                                  {tech.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {project.description && (
                          <div className="mt-1">
                            <span className="text-gray-500 font-mono text-xs">{'// Description'}</span>
                            <p className="text-gray-300 leading-tight break-words whitespace-pre-line font-mono text-xs mt-1 line-clamp-2">
                              {project.description}
                            </p>
                          </div>
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
                <section className="bg-black border border-green-500 p-3 rounded">
                  <div className="mb-1">
                    <span className="text-green-500 font-mono text-xs">$</span> <span className="text-gray-400 font-mono text-xs">npm list --skills</span>
                  </div>
                  <div className="text-green-400 mb-2 font-mono text-xs">{'// Beceriler'}</div>
                  <div className="flex flex-wrap gap-1">
                    {data.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-green-900 text-green-300 rounded text-xs font-mono border border-green-500"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Languages */}
              {data.languages.length > 0 && (
                <section className="bg-black border border-green-500 p-3 rounded">
                  <div className="mb-1">
                    <span className="text-green-500 font-mono text-xs">$</span> <span className="text-gray-400 font-mono text-xs">locale</span>
                  </div>
                  <div className="text-green-400 mb-2 font-mono text-xs">{'// Diller'}</div>
                  <div className="space-y-1.5">
                    {data.languages.map((lang, index) => (
                      <div key={index} className="border border-green-500 p-2 rounded">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-green-300 font-mono font-bold text-xs">{lang.name || "Dil"}</span>
                          <span className="text-xs text-green-400 bg-gray-900 px-1 py-0.5 rounded border border-green-500 font-mono">
                            {lang.level || "Seviye"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5 border border-green-500">
                          <div
                            className="h-1.5 rounded-full bg-green-500"
                            style={{
                              width: lang.level === 'Anadil' ? '100%' : lang.level === 'İleri' ? '80%' : lang.level === 'Orta' ? '60%' : '40%'
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
                <section className="bg-black border border-green-500 p-3 rounded">
                  <div className="mb-1">
                    <span className="text-green-500 font-mono text-xs">$</span> <span className="text-gray-400 font-mono text-xs">ls certificates/</span>
                  </div>
                  <div className="text-green-400 mb-2 font-mono text-xs">{'// Sertifikalar'}</div>
                  <div className="space-y-1">
                    {data.certifications.map((cert, index) => (
                      <div key={index} className="border border-green-500 p-2 rounded">
                        <p className="text-green-300 font-bold font-mono text-xs mb-0.5">{cert.name || "Sertifika"}</p>
                        <p className="text-gray-400 font-mono text-xs">{cert.issuer || "Kurum"}</p>
                        {cert.date && <p className="text-gray-500 font-mono text-xs mt-0.5">{cert.date}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Achievements */}
              {data.achievements.length > 0 && (
                <section className="bg-black border border-green-500 p-3 rounded">
                  <div className="mb-1">
                    <span className="text-green-500 font-mono text-xs">$</span> <span className="text-gray-400 font-mono text-xs">cat achievements.md</span>
                  </div>
                  <div className="text-green-400 mb-2 font-mono text-xs">{'// Başarılar'}</div>
                  <div className="space-y-1">
                    {data.achievements.map((achievement, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-2">
                        <h3 className="text-green-300 font-bold font-mono text-xs mb-0.5">{achievement.title || "Başlık"}</h3>
                        {achievement.description && (
                          <p className="text-gray-400 font-mono text-xs mt-0.5 break-words whitespace-pre-line line-clamp-1">
                            {achievement.description}
                          </p>
                        )}
                        {achievement.date && (
                          <p className="text-gray-500 font-mono text-xs mt-0.5">{achievement.date}</p>
                        )}
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

