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
    <div className="bg-white text-gray-900 break-words" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="max-w-4xl mx-auto p-10">
        <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="text-sm text-gray-700 space-y-1">
            {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
            {data.personalInfo.address && <div>{data.personalInfo.address}</div>}
            {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
          </div>
        </div>
        {data.summary && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase">Özet</h2>
            <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">{data.summary}</p>
          </section>
        )}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase">İş Deneyimi</h2>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <h3 className="font-bold text-gray-900">{exp.position} | {exp.company}</h3>
                  <p className="text-sm text-gray-600 mb-2">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                  {exp.description && <p className="text-gray-700 break-words whitespace-pre-line text-sm">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
        {data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase">Eğitim</h2>
            <div className="space-y-3">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <h3 className="font-bold text-gray-900">{edu.degree} | {edu.school}</h3>
                  <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        {data.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase">Beceriler</h2>
            <p className="text-gray-700">{data.skills.join(', ')}</p>
          </section>
        )}
        {data.certifications.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase">Sertifikalar</h2>
            <div className="space-y-2">
              {data.certifications.map((cert, i) => (
                <div key={i}>
                  <p className="font-semibold text-gray-900">{cert.name} | {cert.issuer}</p>
                  {cert.date && <p className="text-sm text-gray-600">{cert.date}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
        {data.languages.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase">Diller</h2>
            <p className="text-gray-700">{data.languages.map(l => `${l.name} (${l.level})`).join(', ')}</p>
          </section>
        )}
      </div>
    </div>
  );
}

