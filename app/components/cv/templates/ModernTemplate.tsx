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
      className="bg-white text-gray-900 break-words"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* Header */}
      <div className="bg-blue-600 text-white p-8">
        <div className="flex items-center gap-6">
          {data.personalInfo.profilePhoto && (
            <img
              src={data.personalInfo.profilePhoto}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{data.personalInfo.name || "Ad Soyad"}</h1>
            <div className="flex flex-wrap gap-4 text-blue-100 text-sm">
              {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
              {data.personalInfo.address && <span>{data.personalInfo.address}</span>}
              {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
              {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {data.summary && (
          <section className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 pb-2 border-b-2 border-blue-600">
              Profesyonel Özet
            </h2>
            <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">
              {data.summary}
            </p>
          </section>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Experience */}
            {data.experience.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-blue-600 mb-4 pb-2 border-b-2 border-blue-600">
                  İş Deneyimi
                </h2>
                <div className="space-y-4">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-600 pl-4">
                      <h3 className="text-xl font-semibold text-gray-900">{exp.position || "Pozisyon"}</h3>
                      <p className="text-blue-600 font-medium">{exp.company || "Şirket"}</p>
                      <p className="text-sm text-gray-600 mb-2">
                        {exp.startDate && `${exp.startDate} - `}
                        {exp.current ? "Devam ediyor" : exp.endDate || ""}
                      </p>
                      {exp.description && (
                        <p className="text-gray-700 mt-2 leading-relaxed break-words whitespace-pre-line">
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
                <h2 className="text-2xl font-bold text-blue-600 mb-4 pb-2 border-b-2 border-blue-600">
                  Eğitim
                </h2>
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-blue-600 pl-4">
                      <h3 className="text-xl font-semibold text-gray-900">{edu.degree || "Derece"}</h3>
                      <p className="text-blue-600 font-medium">{edu.school || "Okul"}</p>
                      {edu.field && <p className="text-gray-600">{edu.field}</p>}
                      <p className="text-sm text-gray-600">
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
                <h2 className="text-2xl font-bold text-blue-600 mb-4 pb-2 border-b-2 border-blue-600">
                  Projeler
                </h2>
                <div className="space-y-4">
                  {data.projects.map((project, index) => (
                    <div key={index} className="border-l-4 border-blue-600 pl-4">
                      <h3 className="text-xl font-semibold text-gray-900">{project.name || "Proje Adı"}</h3>
                      {project.technologies && (
                        <p className="text-sm text-blue-600 mb-2">{project.technologies}</p>
                      )}
                      {project.description && (
                        <p className="text-gray-700 mt-2 leading-relaxed break-words whitespace-pre-line">
                          {project.description}
                        </p>
                      )}
                      {project.url && (
                        <a href={project.url} className="text-blue-600 text-sm hover:underline">
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
                <h2 className="text-2xl font-bold text-blue-600 mb-4 pb-2 border-b-2 border-blue-600">
                  Başarılar
                </h2>
                <div className="space-y-3">
                  {data.achievements.map((achievement, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-900">{achievement.title || "Başlık"}</h3>
                      {achievement.description && (
                        <p className="text-gray-700 text-sm mt-1">{achievement.description}</p>
                      )}
                      {achievement.date && (
                        <p className="text-gray-600 text-xs mt-1">{achievement.date}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Skills */}
            {data.skills.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-blue-600 mb-3 pb-2 border-b-2 border-blue-600">
                  Beceriler
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
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
                <h2 className="text-xl font-bold text-blue-600 mb-3 pb-2 border-b-2 border-blue-600">
                  Diller
                </h2>
                <div className="space-y-2">
                  {data.languages.map((lang, index) => (
                    <div key={index}>
                      <p className="font-semibold text-gray-900">{lang.name || "Dil"}</p>
                      <p className="text-sm text-gray-600">{lang.level || "Seviye"}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {data.certifications.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-blue-600 mb-3 pb-2 border-b-2 border-blue-600">
                  Sertifikalar
                </h2>
                <div className="space-y-3">
                  {data.certifications.map((cert, index) => (
                    <div key={index}>
                      <p className="font-semibold text-gray-900">{cert.name || "Sertifika"}</p>
                      <p className="text-sm text-gray-600">{cert.issuer || "Kurum"}</p>
                      {cert.date && <p className="text-xs text-gray-500">{cert.date}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Hobbies */}
            {data.hobbies.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-blue-600 mb-3 pb-2 border-b-2 border-blue-600">
                  Hobiler
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.hobbies.map((hobby, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
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
                <h2 className="text-xl font-bold text-blue-600 mb-3 pb-2 border-b-2 border-blue-600">
                  Referanslar
                </h2>
                <div className="space-y-3">
                  {data.references.map((ref, index) => (
                    <div key={index}>
                      <p className="font-semibold text-gray-900">{ref.name || "İsim"}</p>
                      <p className="text-sm text-gray-600">{ref.position || "Pozisyon"}</p>
                      <p className="text-sm text-gray-600">{ref.company || "Şirket"}</p>
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

