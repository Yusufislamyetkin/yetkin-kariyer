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
      className="bg-white text-gray-900 break-words"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* Colorful Header */}
      <div className="relative overflow-hidden">
        <div className="flex gap-1 h-4">
          <div className="flex-1 bg-pink-500"></div>
          <div className="flex-1 bg-blue-500"></div>
          <div className="flex-1 bg-green-500"></div>
          <div className="flex-1 bg-yellow-500"></div>
          <div className="flex-1 bg-purple-500"></div>
          <div className="flex-1 bg-orange-500"></div>
        </div>
        <div className="p-8 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
          <div className="flex items-center gap-6">
            {data.personalInfo.profilePhoto && (
              <div className="relative">
                <img
                  src={data.personalInfo.profilePhoto}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                  style={{ borderColor: '#ec4899' }}
                />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full border-4 border-white"></div>
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-5xl font-bold mb-3" style={{ 
                background: 'linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {data.personalInfo.name || "Ad Soyad"}
              </h1>
              <div className="flex flex-wrap gap-3">
                {data.personalInfo.email && (
                  <span className="px-3 py-1 bg-pink-500 text-white rounded-full text-sm font-medium">
                    {data.personalInfo.email}
                  </span>
                )}
                {data.personalInfo.phone && (
                  <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium">
                    {data.personalInfo.phone}
                  </span>
                )}
                {data.personalInfo.linkedin && (
                  <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                    {data.personalInfo.linkedin}
                  </span>
                )}
                {data.personalInfo.website && (
                  <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-medium">
                    {data.personalInfo.website}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {data.summary && (
          <section className="mb-8 p-6 rounded-2xl mb-6" style={{ 
            background: 'linear-gradient(135deg, #fce7f3 0%, #dbeafe 100%)',
            border: '3px solid',
            borderImage: 'linear-gradient(135deg, #ec4899, #3b82f6) 1'
          }}>
            <h2 className="text-3xl font-bold mb-4" style={{ 
              background: 'linear-gradient(135deg, #ec4899 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
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
                <h2 className={`text-3xl font-bold mb-6 pb-3 ${getColor(0).text} border-b-4 ${getColor(0).border}`}>
                  💼 İş Deneyimi
                </h2>
                <div className="space-y-6">
                  {data.experience.map((exp, index) => {
                    const color = getColor(index);
                    return (
                      <div key={index} className={`p-5 rounded-xl border-l-4 ${color.border} ${color.light}`}>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{exp.position || "Pozisyon"}</h3>
                        <p className={`text-lg font-semibold mb-2 ${color.text}`}>{exp.company || "Şirket"}</p>
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
                    );
                  })}
                </div>
              </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <section>
                <h2 className={`text-3xl font-bold mb-6 pb-3 ${getColor(1).text} border-b-4 ${getColor(1).border}`}>
                  🎓 Eğitim
                </h2>
                <div className="space-y-5">
                  {data.education.map((edu, index) => {
                    const color = getColor(index + 10);
                    return (
                      <div key={index} className={`p-5 rounded-xl border-l-4 ${color.border} ${color.light}`}>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{edu.degree || "Derece"}</h3>
                        <p className={`text-lg font-semibold mb-2 ${color.text}`}>{edu.school || "Okul"}</p>
                        {edu.field && <p className="text-gray-600 mb-1">{edu.field}</p>}
                        <p className="text-sm text-gray-600">
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
                <h2 className={`text-3xl font-bold mb-6 pb-3 ${getColor(2).text} border-b-4 ${getColor(2).border}`}>
                  🚀 Projeler
                </h2>
                <div className="space-y-5">
                  {data.projects.map((project, index) => {
                    const color = getColor(index + 20);
                    return (
                      <div key={index} className={`p-5 rounded-xl border-2 ${color.border} ${color.light}`}>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name || "Proje Adı"}</h3>
                        {project.technologies && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.technologies.split(',').map((tech, i) => (
                              <span
                                key={i}
                                className={`px-3 py-1 rounded-full text-sm font-medium text-white ${color.bg}`}
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
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Skills */}
            {data.skills.length > 0 && (
              <section className={`p-6 rounded-2xl ${getColor(3).light}`}>
                <h2 className={`text-2xl font-bold mb-4 ${getColor(3).text}`}>
                  ⚡ Beceriler
                </h2>
                <div className="flex flex-wrap gap-3">
                  {data.skills.map((skill, index) => {
                    const color = getColor(index);
                    return (
                      <span
                        key={index}
                        className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${color.bg} shadow-lg`}
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
                <h2 className={`text-2xl font-bold mb-4 ${getColor(4).text}`}>
                  🌍 Diller
                </h2>
                <div className="space-y-3">
                  {data.languages.map((lang, index) => {
                    const color = getColor(index + 5);
                    return (
                      <div key={index} className={`p-4 rounded-xl ${color.light} border-2 ${color.border}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-900">{lang.name || "Dil"}</span>
                          <span className={`text-sm font-semibold px-3 py-1 rounded-full text-white ${color.bg}`}>
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
                <h2 className={`text-2xl font-bold mb-4 ${getColor(5).text}`}>
                  🏆 Sertifikalar
                </h2>
                <div className="space-y-4">
                  {data.certifications.map((cert, index) => {
                    const color = getColor(index + 15);
                    return (
                      <div key={index} className={`p-4 rounded-xl border-2 ${color.border} ${color.light}`}>
                        <h3 className="font-bold text-gray-900 mb-1">{cert.name || "Sertifika"}</h3>
                        <p className={`text-sm font-semibold mb-1 ${color.text}`}>{cert.issuer || "Kurum"}</p>
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
                <h2 className={`text-2xl font-bold mb-4 ${getColor(0).text}`}>
                  🎯 Başarılar
                </h2>
                <div className="space-y-4">
                  {data.achievements.map((achievement, index) => {
                    const color = getColor(index + 25);
                    return (
                      <div key={index} className={`p-4 rounded-xl ${color.light}`}>
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

