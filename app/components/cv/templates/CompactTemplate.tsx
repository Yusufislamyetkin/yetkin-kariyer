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
    <div className="bg-white text-gray-900 break-words" style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px' }}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="border-b-2 border-gray-800 pb-3 mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="text-xs text-gray-700 flex flex-wrap gap-3">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
          </div>
        </div>
        {data.summary && (
          <section className="mb-4">
            <h2 className="text-sm font-bold text-gray-900 mb-1 uppercase">Özet</h2>
            <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-xs">{data.summary}</p>
          </section>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            {data.experience.length > 0 && (
              <section className="mb-4">
                <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase border-b border-gray-400 pb-1">İş Deneyimi</h2>
                <div className="space-y-2">
                  {data.experience.map((exp, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-gray-900 text-xs">{exp.position}</h3>
                      <p className="text-gray-700 text-xs">{exp.company} | {exp.startDate} - {exp.current ? "Devam" : exp.endDate}</p>
                      {exp.description && <p className="text-gray-600 mt-1 break-words whitespace-pre-line text-xs leading-tight">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.education.length > 0 && (
              <section className="mb-4">
                <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase border-b border-gray-400 pb-1">Eğitim</h2>
                <div className="space-y-1">
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
          <div>
            {data.skills.length > 0 && (
              <section className="mb-4">
                <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase border-b border-gray-400 pb-1">Beceriler</h2>
                <p className="text-gray-700 text-xs leading-tight">{data.skills.join(' • ')}</p>
              </section>
            )}
            {data.certifications.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase border-b border-gray-400 pb-1">Sertifikalar</h2>
                <div className="space-y-1">
                  {data.certifications.map((cert, i) => (
                    <div key={i}>
                      <p className="font-semibold text-gray-900 text-xs">{cert.name}</p>
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

