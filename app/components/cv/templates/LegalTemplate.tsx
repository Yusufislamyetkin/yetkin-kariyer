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

export default function LegalTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words" style={{ fontFamily: 'Times New Roman, serif' }}>
      <div className="max-w-4xl mx-auto p-10">
        <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ letterSpacing: '1px' }}>{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="text-sm text-gray-700 space-y-1">
            {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
            {data.personalInfo.address && <div>{data.personalInfo.address}</div>}
          </div>
        </div>
        {data.summary && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-400 pb-1">Özet</h2>
            <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">{data.summary}</p>
          </section>
        )}
        {data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-400 pb-1">Eğitim</h2>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i} className="pl-4 border-l-2 border-gray-400">
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-700 italic">{edu.school}</p>
                  <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-400 pb-1">İş Deneyimi</h2>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i} className="pl-4 border-l-2 border-gray-400">
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-gray-700 italic">{exp.company}</p>
                  <p className="text-sm text-gray-600 mb-2">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                  {exp.description && <p className="text-gray-700 mt-2 break-words whitespace-pre-line text-sm">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
        {data.certifications.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-400 pb-1">Sertifikalar ve Lisanslar</h2>
            <div className="space-y-3">
              {data.certifications.map((cert, i) => (
                <div key={i} className="pl-4 border-l-2 border-gray-400">
                  <p className="font-semibold text-gray-900">{cert.name}</p>
                  <p className="text-gray-700 text-sm italic">{cert.issuer}</p>
                  {cert.date && <p className="text-gray-600 text-xs mt-1">{cert.date}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
        {data.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-400 pb-1">Beceriler</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">{skill}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

