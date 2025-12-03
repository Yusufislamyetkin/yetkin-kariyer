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

export default function DeveloperTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-gray-50 text-gray-900 break-words" style={{ fontFamily: 'monospace, "Courier New", Courier' }}>
      <div className="max-w-5xl mx-auto p-8">
        <div className="bg-gray-900 text-green-400 p-8 mb-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-3 font-mono">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="text-green-300 text-sm space-y-1 font-mono">
            {data.personalInfo.email && <div>📧 {data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>📱 {data.personalInfo.phone}</div>}
            {data.personalInfo.linkedin && <div>💼 {data.personalInfo.linkedin}</div>}
            {data.personalInfo.website && <div>🌐 {data.personalInfo.website}</div>}
          </div>
        </div>
        {data.summary && (
          <section className="mb-8 bg-white p-6 rounded-lg border-l-4 border-green-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 font-mono">{'// Özet'}</h2>
            <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">{data.summary}</p>
          </section>
        )}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {data.experience.length > 0 && (
              <section className="bg-white p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 font-mono">{'// İş Deneyimi'}</h2>
                <div className="space-y-4">
                  {data.experience.map((exp, i) => (
                    <div key={i} className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-green-600 font-mono">{exp.company}</p>
                      <p className="text-sm text-gray-600 mb-2">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                      {exp.description && <p className="text-gray-700 mt-2 break-words whitespace-pre-line text-sm">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.projects.length > 0 && (
              <section className="bg-white p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 font-mono">{'// Projeler'}</h2>
                <div className="space-y-4">
                  {data.projects.map((project, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded border-l-4 border-green-500">
                      <h3 className="font-bold text-gray-900">{project.name}</h3>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.technologies.split(',').map((tech, j) => (
                            <span key={j} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-mono">{tech.trim()}</span>
                          ))}
                        </div>
                      )}
                      {project.description && <p className="text-gray-700 mt-2 break-words whitespace-pre-line text-sm">{project.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          <div className="space-y-6">
            {data.skills.length > 0 && (
              <section className="bg-white p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 font-mono">{'// Beceriler'}</h2>
                <div className="space-y-2">
                  {data.skills.map((skill, i) => (
                    <div key={i} className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm">{skill}</div>
                  ))}
                </div>
              </section>
            )}
            {data.education.length > 0 && (
              <section className="bg-white p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 font-mono">{'// Eğitim'}</h2>
                <div className="space-y-3">
                  {data.education.map((edu, i) => (
                    <div key={i} className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-green-600 text-sm font-mono">{edu.school}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.certifications.length > 0 && (
              <section className="bg-white p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 font-mono">{'// Sertifikalar'}</h2>
                <div className="space-y-2">
                  {data.certifications.map((cert, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded">
                      <p className="font-semibold text-gray-900 text-sm">{cert.name}</p>
                      <p className="text-gray-700 text-xs">{cert.issuer}</p>
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

