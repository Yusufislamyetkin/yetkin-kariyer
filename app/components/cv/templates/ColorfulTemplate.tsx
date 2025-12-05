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

interface ColorfulTemplateProps {
  data: CVData;
}

export default function ColorfulTemplate({ data }: ColorfulTemplateProps) {
  const colors = [
    { bg: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-500', light: 'bg-pink-100' },
    { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500', light: 'bg-blue-100' },
    { bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500', light: 'bg-green-100' },
    { bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500', light: 'bg-yellow-100' },
    { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500', light: 'bg-purple-100' },
    { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', light: 'bg-orange-100' },
  ];

  const getColor = (index: number) => colors[index % colors.length];

  return (
    <div
      className="bg-white text-gray-900 break-words overflow-hidden"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      {/* Colorful Header */}
      <div className="relative overflow-hidden flex-shrink-0">
        <div className="flex gap-0.5 h-2">
          <div className="flex-1 bg-pink-500"></div>
          <div className="flex-1 bg-blue-500"></div>
          <div className="flex-1 bg-green-500"></div>
          <div className="flex-1 bg-yellow-500"></div>
          <div className="flex-1 bg-purple-500"></div>
          <div className="flex-1 bg-orange-500"></div>
        </div>
        <div className="p-4 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            {data.personalInfo.profilePhoto && (
              <div className="relative">
                <img
                  src={data.personalInfo.profilePhoto}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-lg"
                  style={{ borderColor: '#ec4899' }}
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"></div>
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1" style={{ 
                background: 'linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {data.personalInfo.name || "Ad Soyad"}
              </h1>
              <div className="flex flex-wrap gap-1">
                {data.personalInfo.email && (
                  <span className="px-2 py-0.5 bg-pink-500 text-white rounded-full text-xs font-medium">
                    {data.personalInfo.email}
                  </span>
                )}
                {data.personalInfo.phone && (
                  <span className="px-2 py-0.5 bg-blue-500 text-white rounded-full text-xs font-medium">
                    {data.personalInfo.phone}
                  </span>
                )}
                {data.personalInfo.linkedin && (
                  <span className="px-2 py-0.5 bg-green-500 text-white rounded-full text-xs font-medium">
                    {data.personalInfo.linkedin}
                  </span>
                )}
                {data.personalInfo.website && (
                  <span className="px-2 py-0.5 bg-purple-500 text-white rounded-full text-xs font-medium">
                    {data.personalInfo.website}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Summary */}
        {data.summary && (
          <section className="mb-2 p-3 rounded-lg flex-shrink-0" style={{ 
            background: 'linear-gradient(135deg, #fce7f3 0%, #dbeafe 100%)',
            border: '2px solid',
            borderImage: 'linear-gradient(135deg, #ec4899, #3b82f6) 1'
          }}>
            <h2 className="text-lg font-bold mb-1" style={{ 
              background: 'linear-gradient(135deg, #ec4899 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Profesyonel Özet
            </h2>
            <p className="text-gray-800 leading-tight text-xs break-words whitespace-pre-line line-clamp-3">
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
                <h2 className={`text-lg font-bold mb-2 pb-1 ${getColor(0).text} border-b-2 ${getColor(0).border}`}>
                  💼 İş Deneyimi
                </h2>
                <div className="space-y-1.5">
                  {data.experience.map((exp, index) => {
                    const color = getColor(index);
                    return (
                      <div key={index} className={`p-2 rounded-lg border-l-4 ${color.border} ${color.light}`}>
                        <h3 className="text-base font-bold text-gray-900 mb-0.5">{exp.position || "Pozisyon"}</h3>
                        <p className={`text-sm font-semibold mb-1 ${color.text}`}>{exp.company || "Şirket"}</p>
                        <p className="text-xs text-gray-600 mb-1">
                          {exp.startDate && `${exp.startDate} - `}
                          {exp.current ? "Devam ediyor" : exp.endDate || ""}
                        </p>
                        {exp.description && (
                          <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-xs line-clamp-2">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <section>
                <h2 className={`text-lg font-bold mb-2 pb-1 ${getColor(1).text} border-b-2 ${getColor(1).border}`}>
                  🎓 Eğitim
                </h2>
                <div className="space-y-1">
                  {data.education.map((edu, index) => {
                    const color = getColor(index + 10);
                    return (
                      <div key={index} className={`p-2 rounded-lg border-l-4 ${color.border} ${color.light}`}>
                        <h3 className="text-base font-bold text-gray-900 mb-0.5">{edu.degree || "Derece"}</h3>
                        <p className={`text-sm font-semibold mb-1 ${color.text}`}>{edu.school || "Okul"}</p>
                        {edu.field && <p className="text-gray-600 text-xs mb-0.5">{edu.field}</p>}
                        <p className="text-xs text-gray-600">
                          {edu.startDate && `${edu.startDate} - `}
                          {edu.endDate || ""}
                          {edu.gpa && ` • GPA: ${edu.gpa}`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
              <section>
                <h2 className={`text-lg font-bold mb-2 pb-1 ${getColor(2).text} border-b-2 ${getColor(2).border}`}>
                  🚀 Projeler
                </h2>
                <div className="space-y-1.5">
                  {data.projects.map((project, index) => {
                    const color = getColor(index + 20);
                    return (
                      <div key={index} className={`p-2 rounded-lg border-2 ${color.border} ${color.light}`}>
                        <h3 className="text-base font-bold text-gray-900 mb-1">{project.name || "Proje Adı"}</h3>
                        {project.technologies && (
                          <div className="flex flex-wrap gap-1 mb-1">
                            {project.technologies.split(',').map((tech, i) => (
                              <span
                                key={i}
                                className={`px-1 py-0.5 rounded-full text-xs font-medium text-white ${color.bg}`}
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        {project.description && (
                          <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-xs line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '100%' }}>
            {/* Skills */}
            {data.skills.length > 0 && (
              <section className={`p-3 rounded-lg ${getColor(3).light}`}>
                <h2 className={`text-base font-bold mb-1 ${getColor(3).text}`}>
                  ⚡ Beceriler
                </h2>
                <div className="flex flex-wrap gap-1">
                  {data.skills.map((skill, index) => {
                    const color = getColor(index);
                    return (
                      <span
                        key={index}
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${color.bg} shadow-md`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Languages */}
            {data.languages.length > 0 && (
              <section>
                <h2 className={`text-base font-bold mb-1 ${getColor(4).text}`}>
                  🌍 Diller
                </h2>
                <div className="space-y-1">
                  {data.languages.map((lang, index) => {
                    const color = getColor(index + 5);
                    return (
                      <div key={index} className={`p-2 rounded-lg ${color.light} border-2 ${color.border}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-gray-900 text-xs">{lang.name || "Dil"}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${color.bg}`}>
                            {lang.level || "Seviye"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Certifications */}
            {data.certifications.length > 0 && (
              <section>
                <h2 className={`text-base font-bold mb-1 ${getColor(5).text}`}>
                  🏆 Sertifikalar
                </h2>
                <div className="space-y-1">
                  {data.certifications.map((cert, index) => {
                    const color = getColor(index + 15);
                    return (
                      <div key={index} className={`p-2 rounded-lg border-2 ${color.border} ${color.light}`}>
                        <h3 className="font-bold text-gray-900 text-xs mb-0.5">{cert.name || "Sertifika"}</h3>
                        <p className={`text-xs font-semibold mb-0.5 ${color.text}`}>{cert.issuer || "Kurum"}</p>
                        {cert.date && <p className="text-xs text-gray-600">{cert.date}</p>}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Achievements */}
            {data.achievements.length > 0 && (
              <section>
                <h2 className={`text-base font-bold mb-1 ${getColor(0).text}`}>
                  🎯 Başarılar
                </h2>
                <div className="space-y-1">
                  {data.achievements.map((achievement, index) => {
                    const color = getColor(index + 25);
                    return (
                      <div key={index} className={`p-2 rounded-lg ${color.light}`}>
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
                    );
                  })}
                </div>
              </section>
            )}

            {/* Hobbies */}
            {data.hobbies.length > 0 && (
              <section>
                <h2 className={`text-base font-bold mb-1 ${getColor(1).text}`}>
                  🎨 Hobiler
                </h2>
                <div className="flex flex-wrap gap-1">
                  {data.hobbies.map((hobby, index) => {
                    const color = getColor(index);
                    return (
                      <span
                        key={index}
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${color.bg} shadow-md`}
                      >
                        {hobby}
                      </span>
                    );
                  })}
                </div>
              </section>
            )}

            {/* References */}
            {data.references.length > 0 && (
              <section>
                <h2 className={`text-base font-bold mb-1 ${getColor(2).text}`}>
                  📞 Referanslar
                </h2>
                <div className="space-y-1">
                  {data.references.map((ref, index) => {
                    const color = getColor(index + 30);
                    return (
                      <div key={index} className={`p-2 rounded-lg border-2 ${color.border} ${color.light}`}>
                        <p className="font-bold text-gray-900 text-xs mb-0.5">{ref.name || "İsim"}</p>
                        <p className={`text-xs font-semibold mb-0.5 ${color.text}`}>{ref.position || "Pozisyon"}, {ref.company || "Şirket"}</p>
                        <p className="text-xs text-gray-600">{ref.email || ""} | {ref.phone || ""}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

