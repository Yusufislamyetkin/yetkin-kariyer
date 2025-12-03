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

export default function CorporateTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words">
      <div className="max-w-5xl mx-auto p-8">
        <div className="bg-gray-800 text-white p-8 mb-8">
          <h1 className="text-4xl font-bold mb-3">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="grid md:grid-cols-2 gap-4 text-gray-300 text-sm">
            {data.personalInfo.email && <div>Email: {data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>Telefon: {data.personalInfo.phone}</div>}
            {data.personalInfo.address && <div>Adres: {data.personalInfo.address}</div>}
            {data.personalInfo.linkedin && <div>LinkedIn: {data.personalInfo.linkedin}</div>}
          </div>
        </div>
        {data.summary && (
          <section className="mb-8 border-l-4 border-gray-800 pl-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Özet</h2>
            <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">{data.summary}</p>
          </section>
        )}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {data.experience.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-800 pb-1">İş Deneyimi</h2>
                <div className="space-y-4">
                  {data.experience.map((exp, i) => (
                    <div key={i} className="border-l-4 border-gray-800 pl-4">
                      <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-gray-800 font-medium">{exp.company}</p>
                      <p className="text-sm text-gray-600 mb-2">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                      {exp.description && <p className="text-gray-700 mt-2 break-words whitespace-pre-line text-sm">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.education.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-800 pb-1">Eğitim</h2>
                <div className="space-y-3">
                  {data.education.map((edu, i) => (
                    <div key={i} className="border-l-4 border-gray-800 pl-4">
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-800">{edu.school}</p>
                      <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          <div className="space-y-6">
            {data.skills.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-800 pb-1">Beceriler</h2>
                <div className="space-y-2">
                  {data.skills.map((skill, i) => (
                    <div key={i} className="bg-gray-100 p-2 rounded text-sm text-gray-900">{skill}</div>
                  ))}
                </div>
              </section>
            )}
            {data.certifications.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-800 pb-1">Sertifikalar</h2>
                <div className="space-y-2">
                  {data.certifications.map((cert, i) => (
                    <div key={i} className="bg-gray-100 p-3 rounded">
                      <p className="font-semibold text-gray-900 text-sm">{cert.name}</p>
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

