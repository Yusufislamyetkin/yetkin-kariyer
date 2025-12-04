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

export default function MedicalTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words overflow-hidden" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="max-w-4xl mx-auto p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="text-center border-b-4 border-red-600 pb-3 mb-2 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="text-xs text-gray-700 space-y-0.5">
            {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          {data.summary && (
            <section className="mb-2">
              <h2 className="text-lg font-bold text-red-600 mb-1 border-b-2 border-red-600 pb-1">Özet</h2>
              <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-sm line-clamp-3">{data.summary}</p>
            </section>
          )}
          {data.education.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold text-red-600 mb-2 border-b-2 border-red-600 pb-1">Eğitim</h2>
              <div className="space-y-1">
                {data.education.map((edu, i) => (
                  <div key={i} className="border-l-4 border-red-600 pl-2">
                    <h3 className="font-semibold text-gray-900 text-xs">{edu.degree}</h3>
                    <p className="text-red-700 text-xs">{edu.school}</p>
                    <p className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.experience.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold text-red-600 mb-2 border-b-2 border-red-600 pb-1">Deneyim</h2>
              <div className="space-y-1.5">
                {data.experience.map((exp, i) => (
                  <div key={i} className="border-l-4 border-red-600 pl-2">
                    <h3 className="font-semibold text-gray-900 text-xs">{exp.position}</h3>
                    <p className="text-red-700 text-xs">{exp.company}</p>
                    <p className="text-xs text-gray-600">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                    {exp.description && <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-xs line-clamp-2">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.certifications.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold text-red-600 mb-1 border-b-2 border-red-600 pb-1">Sertifikalar</h2>
              <div className="space-y-1">
                {data.certifications.map((cert, i) => (
                  <div key={i} className="border-l-4 border-red-600 pl-2">
                    <p className="font-semibold text-gray-900 text-xs">{cert.name}</p>
                    <p className="text-red-700 text-xs">{cert.issuer}</p>
                    {cert.date && <p className="text-gray-600 text-xs mt-0.5">{cert.date}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.skills.length > 0 && (
            <section className="mb-2">
              <h2 className="text-lg font-bold text-red-600 mb-1 border-b-2 border-red-600 pb-1">Beceriler</h2>
              <div className="flex flex-wrap gap-1">
                {data.skills.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">{skill}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

