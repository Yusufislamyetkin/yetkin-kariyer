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
    <div className="bg-white text-gray-900 break-words">
      <div className="max-w-5xl mx-auto p-8">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-8 mb-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-3">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="text-orange-100 text-sm space-y-1">
            {data.personalInfo.email && <div>📧 {data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>📱 {data.personalInfo.phone}</div>}
            {data.personalInfo.linkedin && <div>💼 {data.personalInfo.linkedin}</div>}
          </div>
        </div>
        {data.summary && (
          <section className="mb-8 bg-orange-50 p-6 rounded-lg border-l-4 border-orange-600">
            <h2 className="text-2xl font-bold text-orange-700 mb-3">Özet</h2>
            <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">{data.summary}</p>
          </section>
        )}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {data.experience.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-orange-600 mb-4 border-b-2 border-orange-600 pb-1">İş Deneyimi</h2>
                <div className="space-y-4">
                  {data.experience.map((exp, i) => (
                    <div key={i} className="border-l-4 border-orange-600 pl-4">
                      <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-orange-600 font-medium">{exp.company}</p>
                      <p className="text-sm text-gray-600 mb-2">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                      {exp.description && <p className="text-gray-700 mt-2 break-words whitespace-pre-line">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.projects.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-orange-600 mb-4 border-b-2 border-orange-600 pb-1">Projeler</h2>
                <div className="space-y-4">
                  {data.projects.map((project, i) => (
                    <div key={i} className="bg-orange-50 p-4 rounded border-l-4 border-orange-600">
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.technologies.split(',').map((tech, j) => (
                            <span key={j} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">{tech.trim()}</span>
                          ))}
                        </div>
                      )}
                      {project.description && <p className="text-gray-700 mt-2 break-words whitespace-pre-line text-sm">{project.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.education.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-orange-600 mb-4 border-b-2 border-orange-600 pb-1">Eğitim</h2>
                <div className="space-y-3">
                  {data.education.map((edu, i) => (
                    <div key={i} className="border-l-4 border-orange-600 pl-4">
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-orange-600">{edu.school}</p>
                      <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          <div className="space-y-6">
            {data.skills.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-orange-600 mb-4">Beceriler</h2>
                <div className="space-y-2">
                  {data.skills.map((skill, i) => (
                    <div key={i} className="bg-orange-50 p-2 rounded text-sm text-orange-900">{skill}</div>
                  ))}
                </div>
              </section>
            )}
            {data.certifications.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-orange-600 mb-4">Sertifikalar</h2>
                <div className="space-y-2">
                  {data.certifications.map((cert, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded">
                      <p className="font-semibold text-gray-900 text-sm">{cert.name}</p>
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

