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

interface ModernTemplateProps {
  data: CVData;
}

export default function ModernTemplate({ data }: ModernTemplateProps) {
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
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          {data.personalInfo.profilePhoto && (
            <img
              src={data.personalInfo.profilePhoto}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-lg"
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{data.personalInfo.name || "Ad Soyad"}</h1>
            <div className="flex flex-wrap gap-2 text-blue-100 text-xs">
              {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
              {data.personalInfo.address && <span>{data.personalInfo.address}</span>}
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
            <h2 className="text-lg font-bold text-blue-600 mb-1 pb-1 border-b-2 border-blue-600">
              Profesyonel Özet
            </h2>
            <p className="text-gray-700 text-sm leading-tight break-words whitespace-pre-line">
              {data.summary}
            </p>
          </section>
        )}

        <div className="grid md:grid-cols-3 gap-4 flex-1 overflow-hidden" style={{ minHeight: 0 }}>
          {/* Main Content */}
          <div className="md:col-span-2 space-y-2 overflow-y-auto" style={{ maxHeight: '100%' }}>
            {/* Experience */}
            {data.experience.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-blue-600 mb-2 pb-1 border-b-2 border-blue-600">
                  İş Deneyimi
                </h2>
                <div className="space-y-1.5">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-600 pl-2">
                      <h3 className="text-base font-semibold text-gray-900">{exp.position || "Pozisyon"}</h3>
                      <p className="text-blue-600 font-medium text-sm">{exp.company || "Şirket"}</p>
                      <p className="text-xs text-gray-600 mb-1">
                        {exp.startDate && `${exp.startDate} - `}
                        {exp.current ? "Devam ediyor" : exp.endDate || ""}
                      </p>
                      {exp.description && (
                        <p className="text-gray-700 text-xs mt-1 leading-tight break-words whitespace-pre-line line-clamp-2">
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
                <h2 className="text-lg font-bold text-blue-600 mb-2 pb-1 border-b-2 border-blue-600">
                  Eğitim
                </h2>
                <div className="space-y-1.5">
                  {data.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-blue-600 pl-2">
                      <h3 className="text-base font-semibold text-gray-900">{edu.degree || "Derece"}</h3>
                      <p className="text-blue-600 font-medium text-sm">{edu.school || "Okul"}</p>
                      {edu.field && <p className="text-gray-600 text-xs">{edu.field}</p>}
                      <p className="text-xs text-gray-600">
                        {edu.startDate && `${edu.startDate} - `}
                        {edu.endDate || ""}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-blue-600 mb-2 pb-1 border-b-2 border-blue-600">
                  Projeler
                </h2>
                <div className="space-y-1.5">
                  {data.projects.map((project, index) => (
                    <div key={index} className="border-l-4 border-blue-600 pl-2">
                      <h3 className="text-base font-semibold text-gray-900">{project.name || "Proje Adı"}</h3>
                      {project.technologies && (
                        <p className="text-xs text-blue-600 mb-1">{project.technologies}</p>
                      )}
                      {project.description && (
                        <p className="text-gray-700 text-xs mt-1 leading-tight break-words whitespace-pre-line line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      {project.url && (
                        <a href={project.url} className="text-blue-600 text-xs hover:underline">
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
                <h2 className="text-lg font-bold text-blue-600 mb-2 pb-1 border-b-2 border-blue-600">
                  Başarılar
                </h2>
                <div className="space-y-1">
                  {data.achievements.map((achievement, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-900 text-sm">{achievement.title || "Başlık"}</h3>
                      {achievement.description && (
                        <p className="text-gray-700 text-xs mt-0.5 line-clamp-1">{achievement.description}</p>
                      )}
                      {achievement.date && (
                        <p className="text-gray-600 text-xs mt-0.5">{achievement.date}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-2 overflow-y-auto" style={{ maxHeight: '100%' }}>
            {/* Skills */}
            {data.skills.length > 0 && (
              <section>
                <h2 className="text-base font-bold text-blue-600 mb-1 pb-1 border-b-2 border-blue-600">
                  Beceriler
                </h2>
                <div className="flex flex-wrap gap-1">
                  {data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
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
                <h2 className="text-base font-bold text-blue-600 mb-1 pb-1 border-b-2 border-blue-600">
                  Diller
                </h2>
                <div className="space-y-1">
                  {data.languages.map((lang, index) => (
                    <div key={index}>
                      <p className="font-semibold text-gray-900 text-xs">{lang.name || "Dil"}</p>
                      <p className="text-xs text-gray-600">{lang.level || "Seviye"}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {data.certifications.length > 0 && (
              <section>
                <h2 className="text-base font-bold text-blue-600 mb-1 pb-1 border-b-2 border-blue-600">
                  Sertifikalar
                </h2>
                <div className="space-y-1">
                  {data.certifications.map((cert, index) => (
                    <div key={index}>
                      <p className="font-semibold text-gray-900 text-xs">{cert.name || "Sertifika"}</p>
                      <p className="text-xs text-gray-600">{cert.issuer || "Kurum"}</p>
                      {cert.date && <p className="text-xs text-gray-500">{cert.date}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Hobbies */}
            {data.hobbies.length > 0 && (
              <section>
                <h2 className="text-base font-bold text-blue-600 mb-1 pb-1 border-b-2 border-blue-600">
                  Hobiler
                </h2>
                <div className="flex flex-wrap gap-1">
                  {data.hobbies.map((hobby, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs"
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
                <h2 className="text-base font-bold text-blue-600 mb-1 pb-1 border-b-2 border-blue-600">
                  Referanslar
                </h2>
                <div className="space-y-1">
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
          </div>
        </div>
      </div>
    </div>
  );
}

