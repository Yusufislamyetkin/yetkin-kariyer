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
    <div className="bg-white text-gray-900 break-words" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="text-center border-b-4 border-gray-800 pb-6 mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="text-sm text-gray-600 space-y-1">
            {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
            {data.personalInfo.address && <div>{data.personalInfo.address}</div>}
            {(data.personalInfo.linkedin || data.personalInfo.website) && (
              <div className="mt-2">
                {data.personalInfo.linkedin && <span className="mr-4">{data.personalInfo.linkedin}</span>}
                {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {data.summary && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
              Özet
            </h2>
            <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line text-sm">
              {data.summary}
            </p>
          </section>
        )}

        {/* Education - Prioritized for Academic CV */}
        {data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
              Eğitim
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="pl-4 border-l-2 border-gray-400">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900">{edu.degree || "Derece"}</h3>
                      <p className="text-gray-700 italic">{edu.school || "Okul"}</p>
                      {edu.field && <p className="text-gray-600 text-sm">{edu.field}</p>}
                      {edu.gpa && <p className="text-gray-600 text-sm mt-1">GPA: {edu.gpa}</p>}
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap">
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
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
              İş Deneyimi
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, index) => (
                <div key={index} className="pl-4 border-l-2 border-gray-400">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.position || "Pozisyon"}</h3>
                      <p className="text-gray-700 italic">{exp.company || "Şirket"}</p>
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                      {exp.startDate && `${exp.startDate} - `}
                      {exp.current ? "Devam ediyor" : exp.endDate || ""}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 mt-2 leading-relaxed break-words whitespace-pre-line text-sm">
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
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
              Beceriler
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
              Sertifikalar
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert, index) => (
                <div key={index} className="pl-4 border-l-2 border-gray-400">
                  <p className="font-semibold text-gray-900">{cert.name || "Sertifika"}</p>
                  <p className="text-gray-700 text-sm italic">{cert.issuer || "Kurum"}</p>
                  {cert.date && <p className="text-gray-600 text-xs mt-1">{cert.date}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
              Diller
            </h2>
            <div className="space-y-2">
              {data.languages.map((lang, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium">{lang.name || "Dil"}</span>
                  <span className="text-gray-600 text-sm">{lang.level || "Seviye"}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {data.achievements.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
              Başarılar
            </h2>
            <div className="space-y-3">
              {data.achievements.map((achievement, index) => (
                <div key={index} className="pl-4 border-l-2 border-gray-400">
                  <h3 className="font-semibold text-gray-900">{achievement.title || "Başlık"}</h3>
                  {achievement.description && (
                    <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-sm">
                      {achievement.description}
                    </p>
                  )}
                  {achievement.date && <p className="text-gray-600 text-xs mt-1">{achievement.date}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

