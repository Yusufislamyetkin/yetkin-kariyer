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

export default function PortfolioTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words overflow-hidden" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="max-w-6xl mx-auto flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            {data.personalInfo.profilePhoto && (
              <img src={data.personalInfo.profilePhoto} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-lg" />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{data.personalInfo.name || "Ad Soyad"}</h1>
              <div className="flex flex-wrap gap-2 text-violet-100 text-xs">
                {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
          {data.summary && (
            <section className="mb-2 bg-violet-50 p-3 rounded-lg border-l-4 border-violet-600 flex-shrink-0">
              <h2 className="text-lg font-bold text-violet-700 mb-1">Özet</h2>
              <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-sm line-clamp-3">{data.summary}</p>
            </section>
          )}
          <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
            {data.projects.length > 0 && (
              <section className="mb-2">
                <h2 className="text-lg font-bold text-violet-700 mb-2">Projeler</h2>
                <div className="grid md:grid-cols-2 gap-2">
                  {data.projects.map((project, i) => (
                    <div key={i} className="bg-gradient-to-br from-violet-50 to-purple-50 p-2 rounded-lg border-2 border-violet-200">
                      <h3 className="text-base font-bold text-gray-900 mb-1">{project.name}</h3>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1 mb-1">
                          {project.technologies.split(',').map((tech, j) => (
                            <span key={j} className="px-2 py-0.5 bg-violet-600 text-white rounded-full text-xs font-semibold">{tech.trim()}</span>
                          ))}
                        </div>
                      )}
                      {project.description && <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-xs line-clamp-2">{project.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                {data.experience.length > 0 && (
                  <section>
                    <h2 className="text-base font-bold text-violet-700 mb-1">Deneyim</h2>
                    <div className="space-y-1">
                      {data.experience.map((exp, i) => (
                        <div key={i} className="border-l-4 border-violet-600 pl-2">
                          <h3 className="text-base font-semibold text-gray-900">{exp.position}</h3>
                          <p className="text-violet-600 font-medium text-sm">{exp.company}</p>
                          <p className="text-xs text-gray-600">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
              <div>
                {data.skills.length > 0 && (
                  <section>
                    <h2 className="text-base font-bold text-violet-700 mb-1">Beceriler</h2>
                    <div className="flex flex-wrap gap-1">
                      {data.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-violet-600 text-white rounded-lg text-xs font-semibold">{skill}</span>
                      ))}
                    </div>
                  </section>
                )}
                {data.education.length > 0 && (
                  <section>
                    <h2 className="text-base font-bold text-violet-700 mb-1">Eğitim</h2>
                    <div className="space-y-1">
                      {data.education.map((edu, i) => (
                        <div key={i} className="border-l-4 border-violet-600 pl-2">
                          <h3 className="font-semibold text-gray-900 text-xs">{edu.degree}</h3>
                          <p className="text-violet-600 text-xs">{edu.school}</p>
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
    </div>
  );
}

