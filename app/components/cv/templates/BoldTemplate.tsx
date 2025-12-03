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

export default function BoldTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words">
      <div className="max-w-5xl mx-auto">
        <div className="bg-black text-white p-10">
          <h1 className="text-5xl font-black mb-3" style={{ letterSpacing: '2px', fontFamily: 'Arial Black, sans-serif' }}>{data.personalInfo.name || "AD SOYAD"}</h1>
          <div className="flex flex-wrap gap-6 text-gray-300 text-sm font-bold">
            {data.personalInfo.email && <span>{data.personalInfo.email.toUpperCase()}</span>}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin.toUpperCase()}</span>}
          </div>
        </div>
        <div className="p-10">
          {data.summary && (
            <section className="mb-10 bg-yellow-400 p-8 -mx-10">
              <h2 className="text-3xl font-black mb-4 text-black">ÖZET</h2>
              <p className="text-gray-900 leading-relaxed break-words whitespace-pre-line font-semibold">{data.summary}</p>
            </section>
          )}
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
              {data.experience.length > 0 && (
                <section>
                  <h2 className="text-3xl font-black mb-6 text-black border-b-4 border-black pb-2">İŞ DENEYİMİ</h2>
                  <div className="space-y-6">
                    {data.experience.map((exp, i) => (
                      <div key={i} className="border-l-8 border-black pl-6">
                        <h3 className="text-2xl font-black text-gray-900 mb-1">{exp.position.toUpperCase()}</h3>
                        <p className="text-black font-bold text-lg">{exp.company}</p>
                        <p className="text-gray-700 font-semibold mb-3">{exp.startDate} - {exp.current ? "DEVAM" : exp.endDate}</p>
                        {exp.description && <p className="text-gray-800 mt-3 break-words whitespace-pre-line font-medium">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <div className="space-y-8">
              {data.skills.length > 0 && (
                <section>
                  <h2 className="text-3xl font-black mb-6 text-black border-b-4 border-black pb-2">BECERİLER</h2>
                  <div className="space-y-3">
                    {data.skills.map((skill, i) => (
                      <div key={i} className="bg-black text-white p-4 font-bold text-center">{skill.toUpperCase()}</div>
                    ))}
                  </div>
                </section>
              )}
              {data.education.length > 0 && (
                <section>
                  <h2 className="text-3xl font-black mb-6 text-black border-b-4 border-black pb-2">EĞİTİM</h2>
                  <div className="space-y-4">
                    {data.education.map((edu, i) => (
                      <div key={i} className="border-l-8 border-black pl-6">
                        <h3 className="text-xl font-black text-gray-900">{edu.degree.toUpperCase()}</h3>
                        <p className="text-black font-bold">{edu.school}</p>
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

