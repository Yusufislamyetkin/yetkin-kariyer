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
        maxHeight: '297mm',
        overflow: 'hidden'
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header with Sidebar */}
        <div className="flex border-b-4" style={{ borderColor: '#1e40af' }}>
          {/* Main Header */}
          <div className="flex-1 p-8">
            <h1 className="text-4xl font-bold mb-3" style={{ color: '#1e40af' }}>
              {data.personalInfo.name || "Ad Soyad"}
            </h1>
            <div className="space-y-1 text-sm text-gray-700">
              {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
              {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
              {data.personalInfo.address && <p>{data.personalInfo.address}</p>}
              {data.personalInfo.linkedin && <p>{data.personalInfo.linkedin}</p>}
              {data.personalInfo.website && <p>{data.personalInfo.website}</p>}
            </div>
          </div>
          {/* Photo Sidebar */}
          {data.personalInfo.profilePhoto && (
            <div className="w-48 p-4 bg-gray-50 flex items-center justify-center border-l-4" style={{ borderColor: '#1e40af' }}>
              <img
                src={data.personalInfo.profilePhoto}
                alt="Profile"
                className="w-32 h-32 rounded object-cover border-4"
                style={{ borderColor: '#1e40af' }}
              />
            </div>
          )}
        </div>

        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 p-8 space-y-8">
            {/* Summary */}
            {data.summary && (
              <section className="border-l-4 pl-6" style={{ borderColor: '#1e40af' }}>
                <h2 className="text-2xl font-bold mb-3" style={{ color: '#1e40af' }}>
                  Profesyonel Özet
                </h2>
                <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">
                  {data.summary}
                </p>
              </section>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2" style={{ color: '#1e40af', borderColor: '#1e40af' }}>
                  İş Deneyimi
                </h2>
                <div className="space-y-6">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{exp.position || "Pozisyon"}</h3>
                          <p className="text-lg font-medium text-gray-700">{exp.company || "Şirket"}</p>
                        </div>
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded whitespace-nowrap">
                          {exp.startDate && `${exp.startDate} - `}
                          {exp.current ? "Devam ediyor" : exp.endDate || ""}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 mt-2 leading-relaxed pl-4 border-l-2 border-gray-300 break-words whitespace-pre-line">
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
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2" style={{ color: '#1e40af', borderColor: '#1e40af' }}>
                  Eğitim
                </h2>
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{edu.degree || "Derece"}</h3>
                          <p className="text-lg font-medium text-gray-700">{edu.school || "Okul"}</p>
                          {edu.field && <p className="text-gray-600">{edu.field}</p>}
                          {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                        </div>
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
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
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2" style={{ color: '#1e40af', borderColor: '#1e40af' }}>
                  Projeler
                </h2>
                <div className="space-y-4">
                  {data.projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name || "Proje Adı"}</h3>
                      {project.technologies && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold">Teknolojiler:</span> {project.technologies}
                        </p>
                      )}
                      {project.description && (
                        <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">
                          {project.description}
                        </p>
                      )}
                      {project.url && (
                        <a href={project.url} className="text-sm" style={{ color: '#1e40af' }}>
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
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2" style={{ color: '#1e40af', borderColor: '#1e40af' }}>
                  Başarılar
                </h2>
                <div className="space-y-3">
                  {data.achievements.map((achievement, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#1e40af' }}></div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{achievement.title || "Başlık"}</h3>
                        {achievement.description && (
                          <p className="text-gray-700 text-sm mt-1 break-words whitespace-pre-line">
                            {achievement.description}
                          </p>
                        )}
                        {achievement.date && (
                          <p className="text-gray-600 text-xs mt-1">{achievement.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-64 bg-gray-50 p-6 space-y-6 border-l-2 border-gray-200">
            {/* Skills */}
            {data.skills.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ color: '#1e40af', borderColor: '#1e40af' }}>
                  Beceriler
                </h2>
                <div className="space-y-2">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="bg-white border border-gray-300 rounded px-3 py-2 text-sm text-center">
                      {skill}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {data.languages.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ color: '#1e40af', borderColor: '#1e40af' }}>
                  Diller
                </h2>
                <div className="space-y-3">
                  {data.languages.map((lang, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm text-gray-900">{lang.name || "Dil"}</span>
                        <span className="text-xs text-gray-600">{lang.level || "Seviye"}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
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
                <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ color: '#1e40af', borderColor: '#1e40af' }}>
                  Sertifikalar
                </h2>
                <div className="space-y-3">
                  {data.certifications.map((cert, index) => (
                    <div key={index} className="bg-white border border-gray-300 rounded p-3">
                      <p className="font-semibold text-sm text-gray-900 mb-1">{cert.name || "Sertifika"}</p>
                      <p className="text-xs text-gray-600">{cert.issuer || "Kurum"}</p>
                      {cert.date && <p className="text-xs text-gray-500 mt-1">{cert.date}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Hobbies */}
            {data.hobbies.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ color: '#1e40af', borderColor: '#1e40af' }}>
                  Hobiler
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.hobbies.map((hobby, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700"
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
                <h2 className="text-xl font-bold mb-3 pb-2 border-b-2" style={{ color: '#1e40af', borderColor: '#1e40af' }}>
                  Referanslar
                </h2>
                <div className="space-y-3">
                  {data.references.map((ref, index) => (
                    <div key={index} className="bg-white border border-gray-300 rounded p-3">
                      <p className="font-semibold text-sm text-gray-900">{ref.name || "İsim"}</p>
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

