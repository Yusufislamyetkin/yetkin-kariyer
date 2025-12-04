/* eslint-disable @next/next/no-img-element */
interface CVData {
  personalInfo: { name: string; email: string; phone: string; address: string; linkedin: string; website: string; profilePhoto?: string; };
  summary: string;
  experience: Array<{ company: string; position: string; startDate: string; endDate: string; description: string; current: boolean; }>;
  education: Array<{ school: string; degree: string; field: string; startDate: string; endDate: string; gpa?: string; }>;
  skills: string[];
  languages: Array<{ name: string; level: string; }>;
  projects: Array<{ name: string; description: string; technologies: string; url?: string; startDate: string; endDate: string; }>;
  achievements: Array<{ title: string; description: string; date: string; }>;
  certifications: Array<{ name: string; issuer: string; date: string; expiryDate?: string; }>;
  references: Array<{ name: string; position: string; company: string; email: string; phone: string; }>;
  hobbies: string[];
}

export default function HybridTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words overflow-hidden" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="max-w-6xl mx-auto flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            {data.personalInfo.profilePhoto && (
              <img src={data.personalInfo.profilePhoto} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-lg" />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{data.personalInfo.name || "Ad Soyad"}</h1>
              <div className="flex flex-wrap gap-2 text-indigo-100 text-xs">
                {data.personalInfo.email && <span>✉ {data.personalInfo.email}</span>}
                {data.personalInfo.phone && <span>📱 {data.personalInfo.phone}</span>}
                {data.personalInfo.linkedin && <span>💼 {data.personalInfo.linkedin}</span>}
                {data.personalInfo.website && <span>🌐 {data.personalInfo.website}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
          {data.summary && (
            <section className="mb-2 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-3 rounded-lg border-l-4 border-indigo-600 flex-shrink-0">
              <h2 className="text-lg font-bold text-indigo-700 mb-1">Özet</h2>
              <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-sm line-clamp-3">{data.summary}</p>
            </section>
          )}
          <div className="grid md:grid-cols-2 gap-4 flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '100%' }}>
              {data.experience.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-indigo-600 mb-2 flex items-center gap-1">
                    <div className="w-1 h-4 bg-gradient-to-b from-indigo-600 to-purple-600"></div>
                    İş Deneyimi
                  </h2>
                  <div className="space-y-1.5">
                    {data.experience.map((exp, i) => (
                      <div key={i} className="border-l-4 border-indigo-600 pl-2">
                        <h3 className="text-base font-bold text-gray-900 mb-0.5">{exp.position}</h3>
                        <p className="text-indigo-600 font-semibold text-sm mb-1">{exp.company}</p>
                        <p className="text-xs text-gray-600 mb-1">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                        {exp.description && <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-xs line-clamp-2">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.projects.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-purple-600 mb-2 flex items-center gap-1">
                    <div className="w-1 h-4 bg-gradient-to-b from-purple-600 to-pink-600"></div>
                    Projeler
                  </h2>
                  <div className="space-y-1.5">
                    {data.projects.map((project, i) => (
                      <div key={i} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-2 rounded-lg">
                        <h3 className="text-base font-bold text-gray-900 mb-1">{project.name}</h3>
                        {project.technologies && (
                          <div className="flex flex-wrap gap-1 mb-1">
                            {project.technologies.split(',').map((tech, j) => (
                              <span key={j} className="px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-xs font-semibold">{tech.trim()}</span>
                            ))}
                          </div>
                        )}
                        {project.description && <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-xs line-clamp-2">{project.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '100%' }}>
              {data.skills.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-pink-600 mb-2 flex items-center gap-1">
                    <div className="w-1 h-4 bg-gradient-to-b from-pink-600 to-purple-600"></div>
                    Beceriler
                  </h2>
                  <div className="flex flex-wrap gap-1">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-xs font-semibold">{skill}</span>
                    ))}
                  </div>
                </section>
              )}
              {data.education.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-indigo-600 mb-1">Eğitim</h2>
                  <div className="space-y-1">
                    {data.education.map((edu, i) => (
                      <div key={i} className="border-l-4 border-indigo-600 pl-2">
                        <h3 className="font-bold text-gray-900 text-xs">{edu.degree}</h3>
                        <p className="text-indigo-600 font-medium text-xs">{edu.school}</p>
                        <p className="text-gray-600 text-xs mt-0.5">{edu.startDate} - {edu.endDate}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.achievements.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-purple-600 mb-1">Başarılar</h2>
                  <div className="space-y-1">
                    {data.achievements.map((achievement, i) => (
                      <div key={i} className="bg-gradient-to-br from-purple-50 to-pink-50 p-2 rounded-lg">
                        <h3 className="font-bold text-gray-900 text-xs mb-0.5">{achievement.title}</h3>
                        {achievement.description && <p className="text-gray-700 mt-0.5 break-words whitespace-pre-line text-xs line-clamp-1">{achievement.description}</p>}
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

