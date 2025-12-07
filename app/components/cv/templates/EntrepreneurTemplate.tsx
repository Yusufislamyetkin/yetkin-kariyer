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

export default function EntrepreneurTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 text-gray-900 break-words overflow-hidden" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="max-w-6xl mx-auto flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 flex-shrink-0">
          <h1 className="text-2xl font-bold mb-1">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="flex flex-wrap gap-2 text-yellow-100 text-xs">
            {data.personalInfo.email && <span>✉ {data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>📱 {data.personalInfo.phone}</span>}
            {data.personalInfo.address && <span>📍 {data.personalInfo.address}</span>}
            {data.personalInfo.linkedin && <span>💼 {data.personalInfo.linkedin}</span>}
            {data.personalInfo.website && <span>🌐 {data.personalInfo.website}</span>}
          </div>
        </div>
        <div className="p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
          {data.summary && (
            <section className="mb-2 bg-white p-3 rounded-lg shadow-lg border-l-4 border-yellow-500 flex-shrink-0">
              <h2 className="text-lg font-bold text-yellow-600 mb-1">Özet</h2>
              <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-sm">{data.summary}</p>
            </section>
          )}
          <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
            {data.experience.length > 0 && (
              <section className="mb-2 bg-white p-3 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold text-yellow-600 mb-2">Girişimcilik Deneyimi</h2>
                <div className="space-y-1.5">
                  {data.experience.map((exp, i) => (
                    <div key={i} className="border-l-4 border-yellow-500 pl-2">
                      <h3 className="text-base font-bold text-gray-900 mb-0.5">{exp.position}</h3>
                      <p className="text-yellow-600 font-semibold text-sm mb-1">{exp.company}</p>
                      <p className="text-xs text-gray-600 mb-1">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                      {exp.description && <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-xs line-clamp-2">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.projects.length > 0 && (
              <section className="mb-2 bg-white p-3 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold text-yellow-600 mb-2">Projeler</h2>
                <div className="grid md:grid-cols-2 gap-2">
                  {data.projects.map((project, i) => (
                    <div key={i} className="bg-gradient-to-br from-yellow-50 to-orange-50 p-2 rounded-lg border-2 border-yellow-300">
                      <h3 className="text-base font-bold text-gray-900 mb-1">{project.name}</h3>
                      {project.description && <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-xs line-clamp-2">{project.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.achievements.length > 0 && (
              <section className="mb-2 bg-white p-3 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold text-yellow-600 mb-2">Başarılar</h2>
                <div className="grid md:grid-cols-2 gap-2">
                  {data.achievements.map((achievement, i) => (
                    <div key={i} className="bg-yellow-50 p-2 rounded-lg border-l-4 border-yellow-500">
                      <h3 className="font-bold text-gray-900 text-xs mb-0.5">{achievement.title}</h3>
                      {achievement.description && <p className="text-gray-700 mt-0.5 break-words whitespace-pre-line text-xs line-clamp-1">{achievement.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                {data.skills.length > 0 && (
                  <section className="bg-white p-3 rounded-lg shadow-lg">
                    <h2 className="text-base font-bold text-yellow-600 mb-1">Beceriler</h2>
                    <div className="flex flex-wrap gap-1">
                      {data.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold">{skill}</span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
              <div>
                {data.education.length > 0 && (
                  <section className="bg-white p-3 rounded-lg shadow-lg mb-2">
                    <h2 className="text-base font-bold text-yellow-600 mb-1">Eğitim</h2>
                    <div className="space-y-1">
                      {data.education.map((edu, i) => (
                        <div key={i} className="border-l-4 border-yellow-500 pl-2">
                          <h3 className="font-semibold text-gray-900 text-xs">{edu.degree}</h3>
                          <p className="text-yellow-600 text-xs">{edu.school}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {data.certifications.length > 0 && (
                  <section className="bg-white p-3 rounded-lg shadow-lg mb-2">
                    <h2 className="text-base font-bold text-yellow-600 mb-1">Sertifikalar</h2>
                    <div className="space-y-1">
                      {data.certifications.map((cert, i) => (
                        <div key={i} className="border-l-4 border-yellow-500 pl-2">
                          <h3 className="font-semibold text-gray-900 text-xs">{cert.name}</h3>
                          <p className="text-yellow-600 text-xs">{cert.issuer}</p>
                          {cert.date && <p className="text-gray-600 text-xs mt-0.5">{cert.date}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {data.languages.length > 0 && (
                  <section className="bg-white p-3 rounded-lg shadow-lg mb-2">
                    <h2 className="text-base font-bold text-yellow-600 mb-1">Diller</h2>
                    <div className="space-y-1">
                      {data.languages.map((lang, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-gray-900 font-medium text-xs">{lang.name}</span>
                          <span className="text-yellow-600 text-xs">{lang.level}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {data.hobbies.length > 0 && (
                  <section className="bg-white p-3 rounded-lg shadow-lg mb-2">
                    <h2 className="text-base font-bold text-yellow-600 mb-1">Hobiler</h2>
                    <div className="flex flex-wrap gap-1">
                      {data.hobbies.map((hobby, i) => (
                        <span key={i} className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">{hobby}</span>
                      ))}
                    </div>
                  </section>
                )}
                {data.references.length > 0 && (
                  <section className="bg-white p-3 rounded-lg shadow-lg">
                    <h2 className="text-base font-bold text-yellow-600 mb-1">Referanslar</h2>
                    <div className="space-y-1">
                      {data.references.map((ref, i) => (
                        <div key={i} className="border-l-4 border-yellow-500 pl-2">
                          <p className="font-semibold text-gray-900 text-xs">{ref.name}</p>
                          <p className="text-yellow-600 text-xs">{ref.position}, {ref.company}</p>
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

