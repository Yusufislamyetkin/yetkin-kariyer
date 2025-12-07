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

export default function StudentTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words overflow-hidden" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="max-w-5xl mx-auto p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 mb-2 rounded-lg flex-shrink-0">
          <h1 className="text-2xl font-bold mb-1">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="flex flex-wrap gap-2 text-green-100 text-xs">
            {data.personalInfo.email && <span>✉ {data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>📱 {data.personalInfo.phone}</span>}
            {data.personalInfo.address && <span>📍 {data.personalInfo.address}</span>}
            {data.personalInfo.linkedin && <span>💼 {data.personalInfo.linkedin}</span>}
            {data.personalInfo.website && <span>🌐 {data.personalInfo.website}</span>}
          </div>
        </div>
        <div className="flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
          {data.summary && (
            <section className="mb-2 bg-green-50 p-3 rounded-lg border-l-4 border-green-500 flex-shrink-0">
              <h2 className="text-lg font-bold text-green-700 mb-1">Özet</h2>
              <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-sm">{data.summary}</p>
            </section>
          )}
          <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
            {data.education.length > 0 && (
              <section className="mb-2">
                <h2 className="text-lg font-bold text-green-600 mb-2 border-b-2 border-green-600 pb-1">Eğitim</h2>
                <div className="space-y-1">
                  {data.education.map((edu, i) => (
                    <div key={i} className="border-l-4 border-green-500 pl-2">
                      <h3 className="text-base font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-green-600 font-medium text-sm">{edu.school}</p>
                      {edu.field && <p className="text-gray-700 text-xs">{edu.field}</p>}
                      {edu.gpa && <p className="text-gray-600 text-xs">GPA: {edu.gpa}</p>}
                      <p className="text-xs text-gray-600 mt-0.5">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.experience.length > 0 && (
              <section className="mb-2">
                <h2 className="text-lg font-bold text-green-600 mb-2 border-b-2 border-green-600 pb-1">Deneyim</h2>
                <div className="space-y-1.5">
                  {data.experience.map((exp, i) => (
                    <div key={i} className="border-l-4 border-green-500 pl-2">
                      <h3 className="text-base font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-green-600 font-medium text-sm">{exp.company}</p>
                      <p className="text-xs text-gray-600 mb-1">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                      {exp.description && <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-xs line-clamp-2">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.projects.length > 0 && (
              <section className="mb-2">
                <h2 className="text-lg font-bold text-green-600 mb-2 border-b-2 border-green-600 pb-1">Projeler</h2>
                <div className="grid md:grid-cols-2 gap-2">
                  {data.projects.map((project, i) => (
                    <div key={i} className="bg-green-50 p-2 rounded-lg border-l-4 border-green-500">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{project.name}</h3>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1 mb-1">
                          {project.technologies.split(',').map((tech, j) => (
                            <span key={j} className="px-1 py-0.5 bg-green-100 text-green-700 rounded text-xs">{tech.trim()}</span>
                          ))}
                        </div>
                      )}
                      {project.description && <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-xs line-clamp-2">{project.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                {data.skills.length > 0 && (
                  <section className="mb-2">
                    <h2 className="text-base font-bold text-green-600 mb-1">Beceriler</h2>
                    <div className="flex flex-wrap gap-1">
                      {data.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">{skill}</span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
              <div>
                {data.achievements.length > 0 && (
                  <section className="mb-2">
                    <h2 className="text-base font-bold text-green-600 mb-1">Başarılar</h2>
                    <div className="space-y-1">
                      {data.achievements.map((achievement, i) => (
                        <div key={i} className="border-l-4 border-green-500 pl-2">
                          <h3 className="font-semibold text-gray-900 text-xs">{achievement.title}</h3>
                          {achievement.description && <p className="text-gray-700 mt-0.5 break-words whitespace-pre-line text-xs line-clamp-1">{achievement.description}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {data.certifications.length > 0 && (
                  <section className="mb-2">
                    <h2 className="text-base font-bold text-green-600 mb-1">Sertifikalar</h2>
                    <div className="space-y-1">
                      {data.certifications.map((cert, i) => (
                        <div key={i} className="border-l-4 border-green-500 pl-2">
                          <h3 className="font-semibold text-gray-900 text-xs">{cert.name}</h3>
                          <p className="text-green-600 text-xs">{cert.issuer}</p>
                          {cert.date && <p className="text-gray-600 text-xs mt-0.5">{cert.date}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {data.languages.length > 0 && (
                  <section className="mb-2">
                    <h2 className="text-base font-bold text-green-600 mb-1">Diller</h2>
                    <div className="space-y-1">
                      {data.languages.map((lang, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-gray-900 font-medium text-xs">{lang.name}</span>
                          <span className="text-green-600 text-xs">{lang.level}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {data.hobbies.length > 0 && (
                  <section className="mb-2">
                    <h2 className="text-base font-bold text-green-600 mb-1">Hobiler</h2>
                    <p className="text-gray-700 text-xs">{data.hobbies.join(', ')}</p>
                  </section>
                )}
                {data.references.length > 0 && (
                  <section>
                    <h2 className="text-base font-bold text-green-600 mb-1">Referanslar</h2>
                    <div className="space-y-1">
                      {data.references.map((ref, i) => (
                        <div key={i} className="border-l-4 border-green-500 pl-2">
                          <p className="font-semibold text-gray-900 text-xs">{ref.name}</p>
                          <p className="text-green-600 text-xs">{ref.position}, {ref.company}</p>
                          <p className="text-gray-600 text-xs mt-0.5">{ref.email} | {ref.phone}</p>
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

