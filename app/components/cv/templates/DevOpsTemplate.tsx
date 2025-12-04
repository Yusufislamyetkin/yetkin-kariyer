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

export default function DevOpsTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words overflow-hidden" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="max-w-5xl mx-auto p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 mb-2 rounded-lg flex-shrink-0">
          <h1 className="text-2xl font-bold mb-1">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="text-orange-100 text-xs space-y-0.5">
            {data.personalInfo.email && <div>📧 {data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>📱 {data.personalInfo.phone}</div>}
            {data.personalInfo.linkedin && <div>💼 {data.personalInfo.linkedin}</div>}
          </div>
        </div>
        {data.summary && (
          <section className="mb-2 bg-orange-50 p-3 rounded-lg border-l-4 border-orange-600 flex-shrink-0">
            <h2 className="text-lg font-bold text-orange-700 mb-1">Özet</h2>
            <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-sm line-clamp-3">{data.summary}</p>
          </section>
        )}
        <div className="grid md:grid-cols-3 gap-4 flex-1 overflow-hidden" style={{ minHeight: 0 }}>
          <div className="md:col-span-2 space-y-2 overflow-y-auto" style={{ maxHeight: '100%' }}>
            {data.experience.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-orange-600 mb-2 border-b-2 border-orange-600 pb-1">İş Deneyimi</h2>
                <div className="space-y-1.5">
                  {data.experience.map((exp, i) => (
                    <div key={i} className="border-l-4 border-orange-600 pl-2">
                      <h3 className="text-base font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-orange-600 font-medium text-sm">{exp.company}</p>
                      <p className="text-xs text-gray-600 mb-1">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                      {exp.description && <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-xs line-clamp-2">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.projects.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-orange-600 mb-2 border-b-2 border-orange-600 pb-1">Projeler</h2>
                <div className="space-y-1.5">
                  {data.projects.map((project, i) => (
                    <div key={i} className="bg-orange-50 p-2 rounded border-l-4 border-orange-600">
                      <h3 className="text-base font-semibold text-gray-900">{project.name}</h3>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.technologies.split(',').map((tech, j) => (
                            <span key={j} className="px-1 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">{tech.trim()}</span>
                          ))}
                        </div>
                      )}
                      {project.description && <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-xs line-clamp-2">{project.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.education.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-orange-600 mb-2 border-b-2 border-orange-600 pb-1">Eğitim</h2>
                <div className="space-y-1">
                  {data.education.map((edu, i) => (
                    <div key={i} className="border-l-4 border-orange-600 pl-2">
                      <h3 className="font-semibold text-gray-900 text-xs">{edu.degree}</h3>
                      <p className="text-orange-600 text-xs">{edu.school}</p>
                      <p className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '100%' }}>
            {data.skills.length > 0 && (
              <section>
                <h2 className="text-base font-bold text-orange-600 mb-1">Beceriler</h2>
                <div className="space-y-1">
                  {data.skills.map((skill, i) => (
                    <div key={i} className="bg-orange-50 p-1 rounded text-xs text-orange-900">{skill}</div>
                  ))}
                </div>
              </section>
            )}
            {data.certifications.length > 0 && (
              <section>
                <h2 className="text-base font-bold text-orange-600 mb-1">Sertifikalar</h2>
                <div className="space-y-1">
                  {data.certifications.map((cert, i) => (
                    <div key={i} className="bg-gray-50 p-2 rounded">
                      <p className="font-semibold text-gray-900 text-xs">{cert.name}</p>
                      <p className="text-orange-600 text-xs">{cert.issuer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

