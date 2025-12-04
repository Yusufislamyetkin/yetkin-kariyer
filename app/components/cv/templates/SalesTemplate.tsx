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

export default function SalesTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words overflow-hidden" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="max-w-5xl mx-auto flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 flex-shrink-0">
          <h1 className="text-2xl font-bold mb-1">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="flex flex-wrap gap-2 text-emerald-100 text-xs">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
          </div>
        </div>
        <div className="p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
          {data.summary && (
            <section className="mb-2 bg-emerald-50 p-3 rounded-lg border-l-4 border-emerald-600 flex-shrink-0">
              <h2 className="text-lg font-bold text-emerald-700 mb-1">Özet</h2>
              <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-sm line-clamp-3">{data.summary}</p>
            </section>
          )}
          <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
            {data.experience.length > 0 && (
              <section className="mb-2">
                <h2 className="text-lg font-bold text-emerald-700 mb-2 border-b-2 border-emerald-600 pb-1">İş Deneyimi</h2>
                <div className="space-y-1.5">
                  {data.experience.map((exp, i) => (
                    <div key={i} className="bg-gray-50 p-2 rounded-lg border-l-4 border-emerald-600">
                      <h3 className="text-base font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-emerald-700 font-medium text-sm">{exp.company}</p>
                      <p className="text-xs text-gray-600 mb-1">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                      {exp.description && <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-xs line-clamp-2">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.achievements.length > 0 && (
              <section className="mb-2">
                <h2 className="text-lg font-bold text-emerald-700 mb-2 border-b-2 border-emerald-600 pb-1">Başarılar</h2>
                <div className="grid md:grid-cols-2 gap-2">
                  {data.achievements.map((achievement, i) => (
                    <div key={i} className="bg-emerald-50 p-2 rounded-lg">
                      <h3 className="font-bold text-emerald-900 text-xs">{achievement.title}</h3>
                      {achievement.description && <p className="text-gray-700 mt-0.5 break-words whitespace-pre-line text-xs line-clamp-1">{achievement.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                {data.skills.length > 0 && (
                  <section className="mb-2">
                    <h2 className="text-base font-bold text-emerald-700 mb-1">Beceriler</h2>
                    <div className="flex flex-wrap gap-1">
                      {data.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">{skill}</span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
              <div>
                {data.education.length > 0 && (
                  <section className="mb-2">
                    <h2 className="text-base font-bold text-emerald-700 mb-1">Eğitim</h2>
                    <div className="space-y-1">
                      {data.education.map((edu, i) => (
                        <div key={i}>
                          <h3 className="font-semibold text-gray-900 text-xs">{edu.degree}</h3>
                          <p className="text-emerald-700 text-xs">{edu.school}</p>
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

