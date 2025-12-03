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

interface MinimalTemplateProps {
  data: CVData;
}

export default function MinimalTemplate({ data }: MinimalTemplateProps) {
  return (
    <div
      className="bg-white text-black break-words overflow-hidden"
      style={{ 
        fontFamily: 'Helvetica, Arial, sans-serif',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className="max-w-4xl mx-auto p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Minimal Header */}
        <header className="mb-3 pb-3 border-b border-gray-300 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light tracking-tight mb-1 text-black">
                {data.personalInfo.name || "Ad Soyad"}
              </h1>
              <div className="space-y-0.5 text-xs text-gray-600 font-light">
                {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
                {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
                {data.personalInfo.address && <p>{data.personalInfo.address}</p>}
                {data.personalInfo.linkedin && <p>{data.personalInfo.linkedin}</p>}
                {data.personalInfo.website && <p>{data.personalInfo.website}</p>}
              </div>
            </div>
            {data.personalInfo.profilePhoto && (
              <img
                src={data.personalInfo.profilePhoto}
                alt="Profile"
                className="w-16 h-16 object-cover"
                style={{ clipPath: 'circle(50%)' }}
              />
            )}
          </div>
        </header>

        {/* Summary */}
        {data.summary && (
          <section className="mb-2 flex-shrink-0">
            <p className="text-xs leading-tight text-gray-700 break-words whitespace-pre-line font-light line-clamp-3">
              {data.summary}
            </p>
          </section>
        )}

        <div className="grid grid-cols-1 gap-2 flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          {/* Experience */}
          {data.experience.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-black border-b border-black pb-0.5 inline-block">
                İş Deneyimi
              </h2>
              <div className="space-y-1.5">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-base font-semibold text-black">{exp.position || "Pozisyon"}</h3>
                        <p className="text-xs text-gray-600">{exp.company || "Şirket"}</p>
                      </div>
                      <p className="text-xs text-gray-500 font-light">
                        {exp.startDate && `${exp.startDate} - `}
                        {exp.current ? "Devam ediyor" : exp.endDate || ""}
                      </p>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-gray-700 mt-1 leading-tight break-words whitespace-pre-line font-light line-clamp-2">
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
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-black border-b border-black pb-0.5 inline-block">
                Eğitim
              </h2>
              <div className="space-y-1.5">
                {data.education.map((edu, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-semibold text-black">{edu.degree || "Derece"}</h3>
                      <p className="text-xs text-gray-600">{edu.school || "Okul"}</p>
                      {edu.field && <p className="text-xs text-gray-600">{edu.field}</p>}
                      {edu.gpa && <p className="text-xs text-gray-500 mt-0.5">GPA: {edu.gpa}</p>}
                    </div>
                    <p className="text-xs text-gray-500 font-light">
                      {edu.startDate && `${edu.startDate} - `}
                      {edu.endDate || ""}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-black border-b border-black pb-0.5 inline-block">
                Beceriler
              </h2>
              <div className="flex flex-wrap gap-1">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs text-gray-700 font-light"
                  >
                    {skill}{index < data.skills.length - 1 ? ' • ' : ''}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-black border-b border-black pb-0.5 inline-block">
                Projeler
              </h2>
              <div className="space-y-1.5">
                {data.projects.map((project, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-base font-semibold text-black">{project.name || "Proje Adı"}</h3>
                      {project.technologies && (
                        <p className="text-xs text-gray-500 font-light">{project.technologies}</p>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-xs text-gray-700 leading-tight break-words whitespace-pre-line font-light line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-black border-b border-black pb-0.5 inline-block">
                Diller
              </h2>
              <div className="space-y-1">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="text-black">{lang.name || "Dil"}</span>
                    <span className="text-gray-600 font-light">{lang.level || "Seviye"}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-black border-b border-black pb-0.5 inline-block">
                Sertifikalar
              </h2>
              <div className="space-y-1">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="text-xs font-semibold text-black">{cert.name || "Sertifika"}</p>
                      <p className="text-xs text-gray-600">{cert.issuer || "Kurum"}</p>
                    </div>
                    {cert.date && <p className="text-xs text-gray-500 font-light">{cert.date}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {data.achievements.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-black border-b border-black pb-0.5 inline-block">
                Başarılar
              </h2>
              <div className="space-y-1">
                {data.achievements.map((achievement, index) => (
                  <div key={index}>
                    <h3 className="text-xs font-semibold text-black">{achievement.title || "Başlık"}</h3>
                    {achievement.description && (
                      <p className="text-xs text-gray-700 mt-0.5 break-words whitespace-pre-line font-light line-clamp-1">
                        {achievement.description}
                      </p>
                    )}
                    {achievement.date && (
                      <p className="text-xs text-gray-500 mt-0.5 font-light">{achievement.date}</p>
                    )}
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

