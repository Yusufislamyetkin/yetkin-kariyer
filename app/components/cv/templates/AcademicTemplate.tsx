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

interface AcademicTemplateProps {
  data: CVData;
}

export default function AcademicTemplate({ data }: AcademicTemplateProps) {
  return (
    <div className="bg-white text-gray-900 break-words overflow-hidden" style={{ fontFamily: 'Georgia, serif', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="max-w-4xl mx-auto p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="text-center border-b-4 border-gray-800 pb-3 mb-2 flex-shrink-0">
          <h1 className="text-2xl font-bold mb-1 text-gray-900">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="text-xs text-gray-600 space-y-0.5">
            {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
            {data.personalInfo.address && <div>{data.personalInfo.address}</div>}
            {(data.personalInfo.linkedin || data.personalInfo.website) && (
              <div className="mt-1">
                {data.personalInfo.linkedin && <span className="mr-2">{data.personalInfo.linkedin}</span>}
                {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          {/* Summary */}
          {data.summary && (
            <section className="mb-2">
              <h2 className="text-lg font-bold mb-1 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
                Özet
              </h2>
              <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-xs line-clamp-3">
                {data.summary}
              </p>
            </section>
          )}

          {/* Education - Prioritized for Academic CV */}
          {data.education.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold mb-2 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
                Eğitim
              </h2>
              <div className="space-y-1">
                {data.education.map((edu, index) => (
                  <div key={index} className="pl-2 border-l-2 border-gray-400">
                    <div className="flex justify-between items-start mb-0.5">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-xs">{edu.degree || "Derece"}</h3>
                        <p className="text-gray-700 italic text-xs">{edu.school || "Okul"}</p>
                        {edu.field && <p className="text-gray-600 text-xs">{edu.field}</p>}
                        {edu.gpa && <p className="text-gray-600 text-xs mt-0.5">GPA: {edu.gpa}</p>}
                      </div>
                      <span className="text-xs text-gray-600 whitespace-nowrap">
                        {edu.startDate && `${edu.startDate} - `}
                        {edu.endDate || ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold mb-2 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
                İş Deneyimi
              </h2>
              <div className="space-y-1.5">
                {data.experience.map((exp, index) => (
                  <div key={index} className="pl-2 border-l-2 border-gray-400">
                    <div className="flex justify-between items-start mb-0.5">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-xs">{exp.position || "Pozisyon"}</h3>
                        <p className="text-gray-700 italic text-xs">{exp.company || "Şirket"}</p>
                      </div>
                      <span className="text-xs text-gray-600 whitespace-nowrap">
                        {exp.startDate && `${exp.startDate} - `}
                        {exp.current ? "Devam ediyor" : exp.endDate || ""}
                      </span>
                    </div>
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

          {/* Skills */}
          {data.skills.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold mb-1 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
                Beceriler
              </h2>
              <div className="flex flex-wrap gap-1">
                {data.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold mb-1 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
                Sertifikalar
              </h2>
              <div className="space-y-1">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="pl-2 border-l-2 border-gray-400">
                    <p className="font-semibold text-gray-900 text-xs">{cert.name || "Sertifika"}</p>
                    <p className="text-gray-700 text-xs italic">{cert.issuer || "Kurum"}</p>
                    {cert.date && <p className="text-gray-600 text-xs mt-0.5">{cert.date}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold mb-1 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
                Diller
              </h2>
              <div className="space-y-1">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-900 font-medium text-xs">{lang.name || "Dil"}</span>
                    <span className="text-gray-600 text-xs">{lang.level || "Seviye"}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {data.achievements.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold mb-1 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
                Başarılar
              </h2>
              <div className="space-y-1">
                {data.achievements.map((achievement, index) => (
                  <div key={index} className="pl-2 border-l-2 border-gray-400">
                    <h3 className="font-semibold text-gray-900 text-xs">{achievement.title || "Başlık"}</h3>
                    {achievement.description && (
                      <p className="text-gray-700 mt-0.5 break-words whitespace-pre-line text-xs line-clamp-1">
                        {achievement.description}
                      </p>
                    )}
                    {achievement.date && <p className="text-gray-600 text-xs mt-0.5">{achievement.date}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

