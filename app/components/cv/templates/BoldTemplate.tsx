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

export default function BoldTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words overflow-hidden" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="max-w-5xl mx-auto flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="bg-black text-white p-4 flex-shrink-0">
          <h1 className="text-2xl font-black mb-1" style={{ letterSpacing: '1px', fontFamily: 'Arial Black, sans-serif' }}>{data.personalInfo.name || "AD SOYAD"}</h1>
          <div className="flex flex-wrap gap-2 text-gray-300 text-xs font-bold">
            {data.personalInfo.email && <span>{data.personalInfo.email.toUpperCase()}</span>}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.address && <span>{data.personalInfo.address.toUpperCase()}</span>}
            {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin.toUpperCase()}</span>}
            {data.personalInfo.website && <span>{data.personalInfo.website.toUpperCase()}</span>}
          </div>
        </div>
        <div className="p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
          {data.summary && (
            <section className="mb-2 bg-yellow-400 p-3 -mx-4 flex-shrink-0">
              <h2 className="text-lg font-black mb-1 text-black">ÖZET</h2>
              <p className="text-gray-900 leading-tight break-words whitespace-pre-line font-semibold text-sm">{data.summary}</p>
            </section>
          )}
          <div className="grid md:grid-cols-2 gap-4 flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '100%' }}>
              {data.experience.length > 0 && (
                <section>
                  <h2 className="text-lg font-black mb-2 text-black border-b-2 border-black pb-1">İŞ DENEYİMİ</h2>
                  <div className="space-y-1.5">
                    {data.experience.map((exp, i) => (
                      <div key={i} className="border-l-4 border-black pl-2">
                        <h3 className="text-base font-black text-gray-900 mb-0.5">{exp.position.toUpperCase()}</h3>
                        <p className="text-black font-bold text-sm">{exp.company}</p>
                        <p className="text-gray-700 font-semibold text-xs mb-1">{exp.startDate} - {exp.current ? "DEVAM" : exp.endDate}</p>
                        {exp.description && <p className="text-gray-800 mt-1 break-words whitespace-pre-line font-medium text-xs line-clamp-2">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '100%' }}>
              {data.skills.length > 0 && (
                <section>
                  <h2 className="text-lg font-black mb-2 text-black border-b-2 border-black pb-1">BECERİLER</h2>
                  <div className="space-y-1">
                    {data.skills.map((skill, i) => (
                      <div key={i} className="bg-black text-white p-2 font-bold text-center text-xs">{skill.toUpperCase()}</div>
                    ))}
                  </div>
                </section>
              )}
              {data.education.length > 0 && (
                <section>
                  <h2 className="text-lg font-black mb-2 text-black border-b-2 border-black pb-1">EĞİTİM</h2>
                  <div className="space-y-1">
                    {data.education.map((edu, i) => (
                      <div key={i} className="border-l-4 border-black pl-2">
                        <h3 className="text-base font-black text-gray-900">{edu.degree.toUpperCase()}</h3>
                        <p className="text-black font-bold text-xs">{edu.school}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.projects.length > 0 && (
                <section>
                  <h2 className="text-lg font-black mb-2 text-black border-b-2 border-black pb-1">PROJELER</h2>
                  <div className="space-y-1">
                    {data.projects.map((project, i) => (
                      <div key={i} className="border-l-4 border-black pl-2 bg-yellow-50">
                        <h3 className="text-base font-black text-gray-900 mb-0.5">{project.name.toUpperCase()}</h3>
                        {project.technologies && (
                          <p className="text-black font-bold text-xs">Teknolojiler: {project.technologies}</p>
                        )}
                        {project.description && (
                          <p className="text-gray-800 mt-1 break-words whitespace-pre-line font-medium text-xs line-clamp-2">{project.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.achievements.length > 0 && (
                <section>
                  <h2 className="text-lg font-black mb-2 text-black border-b-2 border-black pb-1">BAŞARILAR</h2>
                  <div className="space-y-1">
                    {data.achievements.map((achievement, i) => (
                      <div key={i} className="border-l-4 border-black pl-2">
                        <h3 className="font-black text-gray-900 text-xs">{achievement.title.toUpperCase()}</h3>
                        {achievement.description && (
                          <p className="text-gray-800 mt-0.5 break-words whitespace-pre-line font-medium text-xs line-clamp-1">{achievement.description}</p>
                        )}
                        {achievement.date && <p className="text-gray-700 font-semibold text-xs mt-0.5">{achievement.date}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.certifications.length > 0 && (
                <section>
                  <h2 className="text-lg font-black mb-2 text-black border-b-2 border-black pb-1">SERTİFİKALAR</h2>
                  <div className="space-y-1">
                    {data.certifications.map((cert, i) => (
                      <div key={i} className="border-l-4 border-black pl-2">
                        <h3 className="font-black text-gray-900 text-xs">{cert.name.toUpperCase()}</h3>
                        <p className="text-black font-bold text-xs">{cert.issuer}</p>
                        {cert.date && <p className="text-gray-700 font-semibold text-xs mt-0.5">{cert.date}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.languages.length > 0 && (
                <section>
                  <h2 className="text-lg font-black mb-2 text-black border-b-2 border-black pb-1">DİLLER</h2>
                  <div className="space-y-1">
                    {data.languages.map((lang, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-gray-900 font-black text-xs">{lang.name.toUpperCase()}</span>
                        <span className="text-black font-bold text-xs">{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.hobbies.length > 0 && (
                <section>
                  <h2 className="text-lg font-black mb-2 text-black border-b-2 border-black pb-1">HOBİLER</h2>
                  <div className="flex flex-wrap gap-1">
                    {data.hobbies.map((hobby, i) => (
                      <span key={i} className="bg-black text-white p-2 font-bold text-center text-xs">{hobby.toUpperCase()}</span>
                    ))}
                  </div>
                </section>
              )}
              {data.references.length > 0 && (
                <section>
                  <h2 className="text-lg font-black mb-2 text-black border-b-2 border-black pb-1">REFERANSLAR</h2>
                  <div className="space-y-1">
                    {data.references.map((ref, i) => (
                      <div key={i} className="border-l-4 border-black pl-2">
                        <p className="font-black text-gray-900 text-xs">{ref.name.toUpperCase()}</p>
                        <p className="text-black font-bold text-xs">{ref.position}, {ref.company}</p>
                        <p className="text-gray-700 font-semibold text-xs mt-0.5">{ref.email} | {ref.phone}</p>
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

