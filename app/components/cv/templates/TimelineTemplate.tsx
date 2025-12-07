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

export default function TimelineTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words overflow-hidden" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="max-w-4xl mx-auto p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="text-center border-b-4 border-blue-600 pb-3 mb-2 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="text-xs text-gray-700 space-y-0.5">
            {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
            {data.personalInfo.address && <div>{data.personalInfo.address}</div>}
            {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
            {data.personalInfo.website && <div>{data.personalInfo.website}</div>}
          </div>
        </div>
        {data.summary && (
          <section className="mb-2 flex-shrink-0">
            <h2 className="text-lg font-bold text-blue-600 mb-1">Özet</h2>
            <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-sm">{data.summary}</p>
          </section>
        )}
        {data.experience.length > 0 && (
          <div className="relative flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-600"></div>
            <div className="space-y-2">
              {data.experience.map((exp, i) => (
              <div key={i} className="relative pl-10">
                <div className="absolute left-3 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></div>
                <div className="bg-gray-50 p-2 rounded-lg border-l-4 border-blue-600">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-blue-600 font-medium text-sm">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-600 bg-blue-100 px-2 py-0.5 rounded">
                      {exp.startDate} - {exp.current ? "Devam" : exp.endDate}
                    </span>
                  </div>
                  {exp.description && <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-xs line-clamp-2">{exp.description}</p>}
                </div>
              </div>
              ))}
              {data.education.length > 0 && data.education.map((edu, i) => (
              <div key={`edu-${i}`} className="relative pl-10">
                <div className="absolute left-3 w-2 h-2 bg-green-600 rounded-full border-2 border-white"></div>
                <div className="bg-gray-50 p-2 rounded-lg border-l-4 border-green-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-green-600 font-medium text-sm">{edu.school}</p>
                    </div>
                    <span className="text-xs text-gray-600 bg-green-100 px-2 py-0.5 rounded">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}
        {data.skills.length > 0 && (
          <section className="mt-2 flex-shrink-0">
            <h2 className="text-lg font-bold text-blue-600 mb-1">Beceriler</h2>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((skill, i) => (
                <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">{skill}</span>
              ))}
            </div>
          </section>
        )}
        {(data.projects.length > 0 || data.achievements.length > 0 || data.certifications.length > 0) && (
          <div className="relative flex-1 overflow-y-auto mt-2" style={{ minHeight: 0 }}>
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-600"></div>
            <div className="space-y-2">
              {data.projects.length > 0 && data.projects.map((project, i) => (
              <div key={`proj-${i}`} className="relative pl-10">
                <div className="absolute left-3 w-2 h-2 bg-purple-600 rounded-full border-2 border-white"></div>
                <div className="bg-gray-50 p-2 rounded-lg border-l-4 border-purple-600">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{project.name}</h3>
                      {project.technologies && (
                        <p className="text-purple-600 font-medium text-sm">Teknolojiler: {project.technologies}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-600 bg-purple-100 px-2 py-0.5 rounded">
                      {project.startDate} - {project.endDate}
                    </span>
                  </div>
                  {project.description && <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-xs line-clamp-2">{project.description}</p>}
                </div>
              </div>
              ))}
              {data.achievements.length > 0 && data.achievements.map((achievement, i) => (
              <div key={`ach-${i}`} className="relative pl-10">
                <div className="absolute left-3 w-2 h-2 bg-yellow-600 rounded-full border-2 border-white"></div>
                <div className="bg-gray-50 p-2 rounded-lg border-l-4 border-yellow-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{achievement.title}</h3>
                      {achievement.description && (
                        <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-xs line-clamp-1">{achievement.description}</p>
                      )}
                    </div>
                    {achievement.date && (
                      <span className="text-xs text-gray-600 bg-yellow-100 px-2 py-0.5 rounded">
                        {achievement.date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              ))}
              {data.certifications.length > 0 && data.certifications.map((cert, i) => (
              <div key={`cert-${i}`} className="relative pl-10">
                <div className="absolute left-3 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></div>
                <div className="bg-gray-50 p-2 rounded-lg border-l-4 border-indigo-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{cert.name}</h3>
                      <p className="text-indigo-600 font-medium text-sm">{cert.issuer}</p>
                    </div>
                    {cert.date && (
                      <span className="text-xs text-gray-600 bg-indigo-100 px-2 py-0.5 rounded">
                        {cert.date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
        <div className="grid md:grid-cols-2 gap-4 mt-2 flex-shrink-0">
          {data.languages.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-600 mb-1">Diller</h2>
              <div className="space-y-1">
                {data.languages.map((lang, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-gray-900 font-medium text-xs">{lang.name}</span>
                    <span className="text-blue-600 text-xs">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.hobbies.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-600 mb-1">Hobiler</h2>
              <div className="flex flex-wrap gap-1">
                {data.hobbies.map((hobby, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">{hobby}</span>
                ))}
              </div>
            </section>
          )}
        </div>
        {data.references.length > 0 && (
          <section className="mt-2 flex-shrink-0">
            <h2 className="text-lg font-bold text-blue-600 mb-1">Referanslar</h2>
            <div className="space-y-1">
              {data.references.map((ref, i) => (
                <div key={i} className="border-l-4 border-blue-600 pl-2">
                  <p className="font-semibold text-gray-900 text-xs">{ref.name}</p>
                  <p className="text-blue-600 text-xs">{ref.position}, {ref.company}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{ref.email} | {ref.phone}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

