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

export default function ATSFocusedTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words overflow-hidden" style={{ fontFamily: 'Arial, sans-serif', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="max-w-4xl mx-auto p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="text-center border-b-2 border-gray-800 pb-3 mb-2 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="text-xs text-gray-700 space-y-0.5">
            {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
            {data.personalInfo.address && <div>{data.personalInfo.address}</div>}
            {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          {data.summary && (
            <section className="mb-2">
              <h2 className="text-lg font-bold text-gray-900 mb-1 uppercase">Özet</h2>
              <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-sm line-clamp-3">{data.summary}</p>
            </section>
          )}
          {data.experience.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase">İş Deneyimi</h2>
              <div className="space-y-1.5">
                {data.experience.map((exp, i) => (
                  <div key={i}>
                    <h3 className="font-bold text-gray-900 text-xs">{exp.position} | {exp.company}</h3>
                    <p className="text-xs text-gray-600 mb-1">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                    {exp.description && <p className="text-gray-700 break-words whitespace-pre-line text-xs line-clamp-2">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.education.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold text-gray-900 mb-1 uppercase">Eğitim</h2>
              <div className="space-y-1">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <h3 className="font-bold text-gray-900 text-xs">{edu.degree} | {edu.school}</h3>
                    <p className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.skills.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold text-gray-900 mb-1 uppercase">Beceriler</h2>
              <p className="text-gray-700 text-xs">{data.skills.join(', ')}</p>
            </section>
          )}
          {data.certifications.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold text-gray-900 mb-1 uppercase">Sertifikalar</h2>
              <div className="space-y-1">
                {data.certifications.map((cert, i) => (
                  <div key={i}>
                    <p className="font-semibold text-gray-900 text-xs">{cert.name} | {cert.issuer}</p>
                    {cert.date && <p className="text-xs text-gray-600">{cert.date}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.languages.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold text-gray-900 mb-1 uppercase">Diller</h2>
              <p className="text-gray-700 text-xs">{data.languages.map(l => `${l.name} (${l.level})`).join(', ')}</p>
            </section>
          )}
          {data.projects.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold text-gray-900 mb-1 uppercase">Projeler</h2>
              <div className="space-y-1">
                {data.projects.map((project, i) => (
                  <div key={i}>
                    <p className="font-semibold text-gray-900 text-xs">{project.name}</p>
                    {project.technologies && (
                      <p className="text-xs text-gray-600">Technologies: {project.technologies}</p>
                    )}
                    {project.description && (
                      <p className="text-gray-700 break-words whitespace-pre-line text-xs line-clamp-2">{project.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.achievements.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold text-gray-900 mb-1 uppercase">Başarılar</h2>
              <div className="space-y-1">
                {data.achievements.map((achievement, i) => (
                  <div key={i}>
                    <p className="font-semibold text-gray-900 text-xs">{achievement.title}</p>
                    {achievement.description && (
                      <p className="text-gray-700 break-words whitespace-pre-line text-xs line-clamp-1">{achievement.description}</p>
                    )}
                    {achievement.date && <p className="text-xs text-gray-600">{achievement.date}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.hobbies.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold text-gray-900 mb-1 uppercase">Hobiler</h2>
              <p className="text-gray-700 text-xs">{data.hobbies.join(', ')}</p>
            </section>
          )}
          {data.references.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-1 uppercase">Referanslar</h2>
              <div className="space-y-1">
                {data.references.map((ref, i) => (
                  <div key={i}>
                    <p className="font-semibold text-gray-900 text-xs">{ref.name} | {ref.position} | {ref.company}</p>
                    <p className="text-xs text-gray-600">{ref.email} | {ref.phone}</p>
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

