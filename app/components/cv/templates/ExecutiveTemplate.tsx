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

interface ExecutiveTemplateProps {
  data: CVData;
}

export default function ExecutiveTemplate({ data }: ExecutiveTemplateProps) {
  return (
    <div
      className="bg-white text-gray-900 break-words"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Executive Header */}
        <div className="bg-gray-900 text-white p-10">
          <div className="flex items-center gap-8">
            {data.personalInfo.profilePhoto && (
              <img
                src={data.personalInfo.profilePhoto}
                alt="Profile"
                className="w-36 h-36 rounded object-cover border-4 border-white shadow-xl"
              />
            )}
            <div className="flex-1">
              <h1 className="text-5xl font-bold mb-4 tracking-tight">
                {data.personalInfo.name || "Ad Soyad"}
              </h1>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-300">
                {data.personalInfo.email && <p>✉ {data.personalInfo.email}</p>}
                {data.personalInfo.phone && <p>📞 {data.personalInfo.phone}</p>}
                {data.personalInfo.address && <p>📍 {data.personalInfo.address}</p>}
                {data.personalInfo.linkedin && <p>💼 {data.personalInfo.linkedin}</p>}
                {data.personalInfo.website && <p>🌐 {data.personalInfo.website}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="p-10">
          {/* Summary */}
          {data.summary && (
            <section className="mb-10 pb-8 border-b-2 border-gray-800">
              <h2 className="text-3xl font-bold mb-5 text-gray-900 uppercase tracking-wide">
                Profesyonel Özet
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg break-words whitespace-pre-line">
                {data.summary}
              </p>
            </section>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Experience */}
              {data.experience.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 uppercase tracking-wide border-b-4 border-gray-900 pb-2">
                    İş Deneyimi
                  </h2>
                  <div className="space-y-6">
                    {data.experience.map((exp, index) => (
                      <div key={index} className="pl-6 border-l-4 border-gray-900">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{exp.position || "Pozisyon"}</h3>
                            <p className="text-lg font-semibold text-gray-700">{exp.company || "Şirket"}</p>
                          </div>
                          <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-1 rounded">
                            {exp.startDate && `${exp.startDate} - `}
                            {exp.current ? "Devam ediyor" : exp.endDate || ""}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">
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
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 uppercase tracking-wide border-b-4 border-gray-900 pb-2">
                    Eğitim
                  </h2>
                  <div className="space-y-5">
                    {data.education.map((edu, index) => (
                      <div key={index} className="pl-6 border-l-4 border-gray-900">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{edu.degree || "Derece"}</h3>
                            <p className="text-lg font-semibold text-gray-700">{edu.school || "Okul"}</p>
                            {edu.field && <p className="text-gray-600">{edu.field}</p>}
                            {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
                          </div>
                          <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-1 rounded">
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
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 uppercase tracking-wide border-b-4 border-gray-900 pb-2">
                    Önemli Projeler
                  </h2>
                  <div className="space-y-5">
                    {data.projects.map((project, index) => (
                      <div key={index} className="bg-gray-50 p-5 rounded border-l-4 border-gray-900">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name || "Proje Adı"}</h3>
                        {project.technologies && (
                          <p className="text-sm text-gray-600 mb-3 font-semibold">Teknolojiler: {project.technologies}</p>
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

              {/* Achievements */}
              {data.achievements.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 uppercase tracking-wide border-b-4 border-gray-900 pb-2">
                    Başarılar
                  </h2>
                  <div className="space-y-4">
                    {data.achievements.map((achievement, index) => (
                      <div key={index} className="pl-6 border-l-4 border-gray-900">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{achievement.title || "Başlık"}</h3>
                        {achievement.description && (
                          <p className="text-gray-700 break-words whitespace-pre-line">
                            {achievement.description}
                          </p>
                        )}
                        {achievement.date && (
                          <p className="text-sm text-gray-600 mt-2 font-semibold">{achievement.date}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1 space-y-8">
              {/* Skills */}
              {data.skills.length > 0 && (
                <section className="bg-gray-50 p-6 rounded">
                  <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-2">
                    Beceriler
                  </h2>
                  <div className="space-y-2">
                    {data.skills.map((skill, index) => (
                      <div key={index} className="bg-white border border-gray-300 rounded px-4 py-2 text-center font-semibold text-gray-900">
                        {skill}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Languages */}
              {data.languages.length > 0 && (
                <section className="bg-gray-50 p-6 rounded">
                  <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-2">
                    Diller
                  </h2>
                  <div className="space-y-3">
                    {data.languages.map((lang, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-gray-900">{lang.name || "Dil"}</span>
                          <span className="text-sm text-gray-600 font-semibold">{lang.level || "Seviye"}</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gray-900"
                            style={{
                              width: lang.level === 'Anadil' ? '100%' : lang.level === 'İleri' ? '85%' : lang.level === 'Orta' ? '65%' : '45%'
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
                <section className="bg-gray-50 p-6 rounded">
                  <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-2">
                    Sertifikalar
                  </h2>
                  <div className="space-y-4">
                    {data.certifications.map((cert, index) => (
                      <div key={index} className="bg-white border border-gray-300 rounded p-3">
                        <p className="font-bold text-gray-900 mb-1">{cert.name || "Sertifika"}</p>
                        <p className="text-sm text-gray-600">{cert.issuer || "Kurum"}</p>
                        {cert.date && <p className="text-xs text-gray-500 mt-1">{cert.date}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* References */}
              {data.references.length > 0 && (
                <section className="bg-gray-50 p-6 rounded">
                  <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-2">
                    Referanslar
                  </h2>
                  <div className="space-y-4">
                    {data.references.map((ref, index) => (
                      <div key={index} className="bg-white border border-gray-300 rounded p-3">
                        <p className="font-bold text-gray-900">{ref.name || "İsim"}</p>
                        <p className="text-sm text-gray-600">{ref.position || "Pozisyon"}</p>
                        <p className="text-sm text-gray-600">{ref.company || "Şirket"}</p>
                        <p className="text-xs text-gray-500 mt-1">{ref.email || ""}</p>
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

