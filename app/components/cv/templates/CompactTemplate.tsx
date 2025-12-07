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

export default function CompactTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words overflow-hidden" style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="max-w-4xl mx-auto p-3 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="border-b-2 border-gray-800 pb-2 mb-2 flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-900 mb-0.5">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="text-xs text-gray-700 flex flex-wrap gap-2">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.address && <span>{data.personalInfo.address}</span>}
            {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
            {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
          </div>
        </div>
        {data.summary && (
          <section className="mb-2 flex-shrink-0">
            <h2 className="text-xs font-bold text-gray-900 mb-0.5 uppercase">Özet</h2>
            <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-xs">{data.summary}</p>
          </section>
        )}
        <div className="grid md:grid-cols-2 gap-2 flex-1 overflow-hidden" style={{ minHeight: 0 }}>
          <div className="overflow-y-auto" style={{ maxHeight: '100%' }}>
            {data.experience.length > 0 && (
              <section className="mb-2">
                <h2 className="text-xs font-bold text-gray-900 mb-1 uppercase border-b border-gray-400 pb-0.5">İş Deneyimi</h2>
                <div className="space-y-1">
                  {data.experience.map((exp, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-gray-900 text-xs">{exp.position}</h3>
                      <p className="text-gray-700 text-xs">{exp.company} | {exp.startDate} - {exp.current ? "Devam" : exp.endDate}</p>
                      {exp.description && <p className="text-gray-600 mt-0.5 break-words whitespace-pre-line text-xs leading-tight line-clamp-1">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.education.length > 0 && (
              <section className="mb-2">
                <h2 className="text-xs font-bold text-gray-900 mb-1 uppercase border-b border-gray-400 pb-0.5">Eğitim</h2>
                <div className="space-y-0.5">
                  {data.education.map((edu, i) => (
                    <div key={i}>
                      <p className="font-semibold text-gray-900 text-xs">{edu.degree}</p>
                      <p className="text-gray-700 text-xs">{edu.school} | {edu.startDate} - {edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: '100%' }}>
            {data.skills.length > 0 && (
              <section className="mb-2">
                <h2 className="text-xs font-bold text-gray-900 mb-1 uppercase border-b border-gray-400 pb-0.5">Beceriler</h2>
                <p className="text-gray-700 text-xs leading-tight">{data.skills.join(' • ')}</p>
              </section>
            )}
            {data.certifications.length > 0 && (
              <section className="mb-2">
                <h2 className="text-xs font-bold text-gray-900 mb-1 uppercase border-b border-gray-400 pb-0.5">Sertifikalar</h2>
                <div className="space-y-0.5">
                  {data.certifications.map((cert, i) => (
                    <div key={i}>
                      <p className="font-semibold text-gray-900 text-xs">{cert.name}</p>
                      <p className="text-gray-700 text-xs">{cert.issuer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.languages.length > 0 && (
              <section className="mb-2">
                <h2 className="text-xs font-bold text-gray-900 mb-1 uppercase border-b border-gray-400 pb-0.5">Diller</h2>
                <div className="space-y-0.5">
                  {data.languages.map((lang, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-900 text-xs">{lang.name}</span>
                      <span className="text-gray-700 text-xs">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.projects.length > 0 && (
              <section className="mb-2">
                <h2 className="text-xs font-bold text-gray-900 mb-1 uppercase border-b border-gray-400 pb-0.5">Projeler</h2>
                <div className="space-y-0.5">
                  {data.projects.map((project, i) => (
                    <div key={i}>
                      <p className="font-semibold text-gray-900 text-xs">{project.name}</p>
                      {project.technologies && <p className="text-gray-700 text-xs">Tech: {project.technologies}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.achievements.length > 0 && (
              <section className="mb-2">
                <h2 className="text-xs font-bold text-gray-900 mb-1 uppercase border-b border-gray-400 pb-0.5">Başarılar</h2>
                <div className="space-y-0.5">
                  {data.achievements.map((achievement, i) => (
                    <div key={i}>
                      <p className="font-semibold text-gray-900 text-xs">{achievement.title}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.hobbies.length > 0 && (
              <section className="mb-2">
                <h2 className="text-xs font-bold text-gray-900 mb-1 uppercase border-b border-gray-400 pb-0.5">Hobiler</h2>
                <p className="text-gray-700 text-xs">{data.hobbies.join(', ')}</p>
              </section>
            )}
            {data.references.length > 0 && (
              <section>
                <h2 className="text-xs font-bold text-gray-900 mb-1 uppercase border-b border-gray-400 pb-0.5">Referanslar</h2>
                <div className="space-y-0.5">
                  {data.references.map((ref, i) => (
                    <div key={i}>
                      <p className="font-semibold text-gray-900 text-xs">{ref.name}</p>
                      <p className="text-gray-700 text-xs">{ref.position}, {ref.company}</p>
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

