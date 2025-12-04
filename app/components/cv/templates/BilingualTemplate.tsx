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

export default function BilingualTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words overflow-hidden" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="max-w-5xl mx-auto p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="border-b-4 border-teal-600 pb-3 mb-2 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="text-xs text-gray-700 space-y-0.5">
            {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          </div>
        </div>
        <div className="flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
          {data.summary && (
            <section className="mb-2 flex-shrink-0">
              <h2 className="text-lg font-bold text-teal-600 mb-1 border-b-2 border-teal-600 pb-1">Özet / Summary</h2>
              <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-sm line-clamp-3">{data.summary}</p>
            </section>
          )}
          {data.experience.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold text-teal-600 mb-2 border-b-2 border-teal-600 pb-1">İş Deneyimi / Experience</h2>
              <div className="space-y-1.5 overflow-y-auto" style={{ maxHeight: '100%' }}>
                {data.experience.map((exp, i) => (
                  <div key={i} className="border-l-4 border-teal-600 pl-2">
                    <h3 className="font-semibold text-gray-900 text-xs">{exp.position}</h3>
                    <p className="text-teal-700 text-xs">{exp.company}</p>
                    <p className="text-xs text-gray-600 mb-1">{exp.startDate} - {exp.current ? "Devam ediyor / Present" : exp.endDate}</p>
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
                  <h2 className="text-base font-bold text-teal-600 mb-1 border-b-2 border-teal-600 pb-1">Eğitim / Education</h2>
                  <div className="space-y-1">
                    {data.education.map((edu, i) => (
                      <div key={i} className="border-l-4 border-teal-600 pl-2">
                        <h3 className="font-semibold text-gray-900 text-xs">{edu.degree}</h3>
                        <p className="text-teal-700 text-xs">{edu.school}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '100%' }}>
              {data.skills.length > 0 && (
                <section className="mb-2">
                  <h2 className="text-base font-bold text-teal-600 mb-1 border-b-2 border-teal-600 pb-1">Beceriler / Skills</h2>
                  <div className="flex flex-wrap gap-1">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded text-xs">{skill}</span>
                    ))}
                  </div>
                </section>
              )}
              {data.languages.length > 0 && (
                <section>
                  <h2 className="text-base font-bold text-teal-600 mb-1 border-b-2 border-teal-600 pb-1">Diller / Languages</h2>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

