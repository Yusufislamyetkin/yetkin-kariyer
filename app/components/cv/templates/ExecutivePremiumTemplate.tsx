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

export default function ExecutivePremiumTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words overflow-hidden" style={{ fontFamily: 'Georgia, serif', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="max-w-5xl mx-auto p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 mb-2 flex-shrink-0">
          <h1 className="text-2xl font-light mb-1" style={{ letterSpacing: '2px' }}>{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="text-gray-300 text-xs space-y-1" style={{ letterSpacing: '0.5px' }}>
            {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
            {data.personalInfo.address && <div>{data.personalInfo.address}</div>}
            {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          {data.summary && (
            <section className="mb-2 text-center flex-shrink-0">
              <div className="w-16 h-px bg-gray-400 mx-auto mb-1"></div>
              <p className="text-gray-700 leading-tight break-words whitespace-pre-line italic text-sm max-w-3xl mx-auto line-clamp-3">{data.summary}</p>
              <div className="w-16 h-px bg-gray-400 mx-auto mt-1"></div>
            </section>
          )}
          {data.experience.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-light mb-2 text-gray-900 uppercase tracking-widest text-center border-b-2 border-gray-400 pb-1">Executive Experience</h2>
              <div className="space-y-1.5">
                {data.experience.map((exp, i) => (
                  <div key={i} className="text-center">
                    <h3 className="text-base font-light text-gray-900 mb-0.5">{exp.position}</h3>
                    <p className="text-gray-600 italic text-sm mb-1">{exp.company}</p>
                    <p className="text-xs text-gray-500 mb-1">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</p>
                    {exp.description && <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-xs max-w-3xl mx-auto leading-tight line-clamp-2">{exp.description}</p>}
                    {i < data.experience.length - 1 && <div className="w-12 h-px bg-gray-300 mx-auto mt-1.5"></div>}
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.achievements.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-light mb-2 text-gray-900 uppercase tracking-widest text-center border-b-2 border-gray-400 pb-1">Key Achievements</h2>
              <div className="grid md:grid-cols-2 gap-2">
                {data.achievements.map((achievement, i) => (
                  <div key={i} className="text-center">
                    <h3 className="text-base font-light text-gray-900 mb-0.5">{achievement.title}</h3>
                    {achievement.description && <p className="text-gray-700 text-xs line-clamp-1">{achievement.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            {data.education.length > 0 && (
              <section>
                <h2 className="text-base font-light mb-1 text-gray-900 uppercase tracking-widest text-center border-b border-gray-300 pb-1">Education</h2>
                <div className="space-y-1 text-center">
                  {data.education.map((edu, i) => (
                    <div key={i}>
                      <h3 className="font-light text-gray-900 text-xs">{edu.degree}</h3>
                      <p className="text-gray-600 italic text-xs">{edu.school}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.skills.length > 0 && (
              <section>
                <h2 className="text-base font-light mb-1 text-gray-900 uppercase tracking-widest text-center border-b border-gray-300 pb-1">Core Competencies</h2>
                <div className="space-y-1 text-center">
                  {data.skills.map((skill, i) => (
                    <div key={i} className="text-gray-700 text-xs">{skill}</div>
                  ))}
                </div>
              </section>
            )}
          </div>
          {data.certifications.length > 0 && (
            <section className="mb-2">
              <h2 className="text-base font-light mb-1 text-gray-900 uppercase tracking-widest text-center border-b border-gray-300 pb-1">Certifications</h2>
              <div className="space-y-1 text-center">
                {data.certifications.map((cert, i) => (
                  <div key={i}>
                    <h3 className="font-light text-gray-900 text-xs">{cert.name}</h3>
                    <p className="text-gray-600 italic text-xs">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.languages.length > 0 && (
            <section className="mb-2">
              <h2 className="text-base font-light mb-1 text-gray-900 uppercase tracking-widest text-center border-b border-gray-300 pb-1">Languages</h2>
              <div className="space-y-1 text-center">
                {data.languages.map((lang, i) => (
                  <div key={i} className="flex justify-between items-center max-w-xs mx-auto">
                    <span className="text-gray-900 font-light text-xs">{lang.name}</span>
                    <span className="text-gray-600 italic text-xs">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.projects.length > 0 && (
            <section className="mb-2">
              <h2 className="text-base font-light mb-1 text-gray-900 uppercase tracking-widest text-center border-b border-gray-300 pb-1">Projects</h2>
              <div className="space-y-1 text-center">
                {data.projects.map((project, i) => (
                  <div key={i}>
                    <h3 className="font-light text-gray-900 text-xs">{project.name}</h3>
                    {project.technologies && (
                      <p className="text-gray-600 italic text-xs mt-0.5">Technologies: {project.technologies}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.hobbies.length > 0 && (
            <section className="mb-2">
              <h2 className="text-base font-light mb-1 text-gray-900 uppercase tracking-widest text-center border-b border-gray-300 pb-1">Interests</h2>
              <div className="text-center">
                <p className="text-gray-700 text-xs italic">{data.hobbies.join(' • ')}</p>
              </div>
            </section>
          )}
          {data.references.length > 0 && (
            <section>
              <h2 className="text-base font-light mb-1 text-gray-900 uppercase tracking-widest text-center border-b border-gray-300 pb-1">References</h2>
              <div className="space-y-1 text-center">
                {data.references.map((ref, i) => (
                  <div key={i}>
                    <p className="font-light text-gray-900 text-xs">{ref.name}</p>
                    <p className="text-gray-600 italic text-xs">{ref.position}, {ref.company}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{ref.email}</p>
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

