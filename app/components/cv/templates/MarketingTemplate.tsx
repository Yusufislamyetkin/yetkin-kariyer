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

export default function MarketingTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 text-gray-900 break-words overflow-hidden" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="max-w-5xl mx-auto flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            {data.personalInfo.profilePhoto && (
              <img src={data.personalInfo.profilePhoto} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-lg" />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{data.personalInfo.name || "Ad Soyad"}</h1>
              <div className="flex flex-wrap gap-2 text-orange-100 text-xs">
                {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
          {data.summary && (
            <section className="mb-2 bg-white p-3 rounded-lg shadow-sm border-l-4 border-orange-500 flex-shrink-0">
              <h2 className="text-lg font-bold text-orange-600 mb-1">Özet</h2>
              <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-sm line-clamp-3">{data.summary}</p>
            </section>
          )}
          <div className="grid md:grid-cols-2 gap-4 flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '100%' }}>
              {data.experience.length > 0 && (
                <section className="bg-white p-3 rounded-lg shadow-sm">
                  <h2 className="text-lg font-bold text-orange-600 mb-2">İş Deneyimi</h2>
                  <div className="space-y-1.5">
                    {data.experience.map((exp, i) => (
                      <div key={i} className="border-l-4 border-orange-500 pl-2">
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
                <section className="bg-white p-3 rounded-lg shadow-sm">
                  <h2 className="text-lg font-bold text-orange-600 mb-2">Projeler</h2>
                  <div className="space-y-1.5">
                    {data.projects.map((project, i) => (
                      <div key={i} className="border-l-4 border-orange-500 pl-2">
                        <h3 className="text-base font-semibold text-gray-900">{project.name}</h3>
                        {project.description && <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-xs line-clamp-2">{project.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '100%' }}>
              {data.skills.length > 0 && (
                <section className="bg-white p-3 rounded-lg shadow-sm">
                  <h2 className="text-lg font-bold text-orange-600 mb-1">Beceriler</h2>
                  <div className="flex flex-wrap gap-1">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">{skill}</span>
                    ))}
                  </div>
                </section>
              )}
              {data.education.length > 0 && (
                <section className="bg-white p-3 rounded-lg shadow-sm">
                  <h2 className="text-lg font-bold text-orange-600 mb-1">Eğitim</h2>
                  <div className="space-y-1">
                    {data.education.map((edu, i) => (
                      <div key={i}>
                        <h3 className="font-semibold text-gray-900 text-xs">{edu.degree}</h3>
                        <p className="text-orange-600 text-xs">{edu.school}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.achievements.length > 0 && (
                <section className="bg-white p-3 rounded-lg shadow-sm">
                  <h2 className="text-lg font-bold text-orange-600 mb-1">Başarılar</h2>
                  <div className="space-y-1">
                    {data.achievements.map((achievement, i) => (
                      <div key={i} className="border-l-4 border-orange-500 pl-2">
                        <h3 className="font-semibold text-gray-900 text-xs">{achievement.title}</h3>
                        {achievement.description && <p className="text-gray-700 mt-0.5 break-words whitespace-pre-line text-xs line-clamp-1">{achievement.description}</p>}
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

