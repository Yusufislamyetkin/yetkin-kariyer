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

export default function InternationalTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words overflow-hidden" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="max-w-5xl mx-auto p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="border-b-4 border-blue-600 pb-3 mb-2 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="grid md:grid-cols-2 gap-2 text-xs text-gray-700">
            {data.personalInfo.email && <div>📧 {data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>📱 {data.personalInfo.phone}</div>}
            {data.personalInfo.address && <div>📍 {data.personalInfo.address}</div>}
            {data.personalInfo.linkedin && <div>💼 {data.personalInfo.linkedin}</div>}
          </div>
        </div>
        <div className="flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
          {data.summary && (
            <section className="mb-2 flex-shrink-0">
              <h2 className="text-lg font-bold text-blue-600 mb-1 border-b-2 border-blue-600 pb-1">Professional Summary</h2>
              <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-sm line-clamp-3">{data.summary}</p>
            </section>
          )}
          {data.experience.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold text-blue-600 mb-2 border-b-2 border-blue-600 pb-1">Professional Experience</h2>
              <div className="space-y-1.5 overflow-y-auto" style={{ maxHeight: '100%' }}>
                {data.experience.map((exp, i) => (
                  <div key={i} className="border-l-4 border-blue-600 pl-2">
                    <h3 className="font-semibold text-gray-900 text-xs">{exp.position}</h3>
                    <p className="text-blue-700 text-xs">{exp.company}</p>
                    <p className="text-xs text-gray-600 mb-1">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</p>
                    {exp.description && <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-xs line-clamp-2">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          <div className="grid md:grid-cols-2 gap-4 flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            <div className="overflow-y-auto" style={{ maxHeight: '100%' }}>
              {data.education.length > 0 && (
                <section className="mb-2">
                  <h2 className="text-base font-bold text-blue-600 mb-1 border-b-2 border-blue-600 pb-1">Education</h2>
                  <div className="space-y-1">
                    {data.education.map((edu, i) => (
                      <div key={i} className="border-l-4 border-blue-600 pl-2">
                        <h3 className="font-semibold text-gray-900 text-xs">{edu.degree}</h3>
                        <p className="text-blue-700 text-xs">{edu.school}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.projects.length > 0 && (
                <section className="mb-2">
                  <h2 className="text-base font-bold text-blue-600 mb-1 border-b-2 border-blue-600 pb-1">Projects</h2>
                  <div className="space-y-1">
                    {data.projects.map((project, i) => (
                      <div key={i} className="border-l-4 border-blue-600 pl-2">
                        <h3 className="font-semibold text-gray-900 text-xs">{project.name}</h3>
                        {project.technologies && (
                          <p className="text-blue-700 text-xs mt-0.5">Technologies: {project.technologies}</p>
                        )}
                        {project.description && (
                          <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-xs line-clamp-2">{project.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.achievements.length > 0 && (
                <section>
                  <h2 className="text-base font-bold text-blue-600 mb-1 border-b-2 border-blue-600 pb-1">Achievements</h2>
                  <div className="space-y-1">
                    {data.achievements.map((achievement, i) => (
                      <div key={i} className="border-l-4 border-blue-600 pl-2">
                        <h3 className="font-semibold text-gray-900 text-xs">{achievement.title}</h3>
                        {achievement.description && (
                          <p className="text-gray-700 mt-0.5 break-words whitespace-pre-line text-xs line-clamp-1">{achievement.description}</p>
                        )}
                        {achievement.date && <p className="text-gray-600 text-xs mt-0.5">{achievement.date}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '100%' }}>
              {data.skills.length > 0 && (
                <section className="mb-2">
                  <h2 className="text-base font-bold text-blue-600 mb-1 border-b-2 border-blue-600 pb-1">Skills</h2>
                  <div className="flex flex-wrap gap-1">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">{skill}</span>
                    ))}
                  </div>
                </section>
              )}
              {data.languages.length > 0 && (
                <section className="mb-2">
                  <h2 className="text-base font-bold text-blue-600 mb-1 border-b-2 border-blue-600 pb-1">Languages</h2>
                  <div className="space-y-1">
                    {data.languages.map((lang, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-gray-900 text-xs">{lang.name}</span>
                        <span className="text-gray-600 text-xs">{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.certifications.length > 0 && (
                <section className="mb-2">
                  <h2 className="text-base font-bold text-blue-600 mb-1 border-b-2 border-blue-600 pb-1">Certifications</h2>
                  <div className="space-y-1">
                    {data.certifications.map((cert, i) => (
                      <div key={i} className="border-l-4 border-blue-600 pl-2">
                        <p className="font-semibold text-gray-900 text-xs">{cert.name}</p>
                        <p className="text-blue-700 text-xs">{cert.issuer}</p>
                        {cert.date && <p className="text-gray-600 text-xs mt-0.5">{cert.date}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.hobbies.length > 0 && (
                <section className="mb-2">
                  <h2 className="text-base font-bold text-blue-600 mb-1 border-b-2 border-blue-600 pb-1">Interests</h2>
                  <div className="flex flex-wrap gap-1">
                    {data.hobbies.map((hobby, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">{hobby}</span>
                    ))}
                  </div>
                </section>
              )}
              {data.references.length > 0 && (
                <section>
                  <h2 className="text-base font-bold text-blue-600 mb-1 border-b-2 border-blue-600 pb-1">References</h2>
                  <div className="space-y-1">
                    {data.references.map((ref, i) => (
                      <div key={i} className="border-l-4 border-blue-600 pl-2">
                        <p className="font-semibold text-gray-900 text-xs">{ref.name}</p>
                        <p className="text-blue-700 text-xs">{ref.position}, {ref.company}</p>
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
  );
}

