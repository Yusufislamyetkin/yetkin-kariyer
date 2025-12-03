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

export default function InnovativeTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 text-gray-900 break-words">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
          <div className="relative">
            <h1 className="text-5xl font-bold mb-3">{data.personalInfo.name || "Ad Soyad"}</h1>
            <div className="flex flex-wrap gap-6 text-cyan-100 text-sm">
              {data.personalInfo.email && <span>✉ {data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span>📱 {data.personalInfo.phone}</span>}
              {data.personalInfo.linkedin && <span>💼 {data.personalInfo.linkedin}</span>}
            </div>
          </div>
        </div>
        <div className="p-10">
          {data.summary && (
            <section className="mb-10 bg-white p-8 rounded-2xl shadow-lg border-l-8 border-cyan-600">
              <h2 className="text-3xl font-bold text-cyan-600 mb-4">Özet</h2>
              <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line text-lg">{data.summary}</p>
            </section>
          )}
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
              {data.experience.length > 0 && (
                <section className="bg-white p-8 rounded-2xl shadow-lg">
                  <h2 className="text-2xl font-bold text-cyan-600 mb-6 flex items-center gap-3">
                    <div className="w-3 h-3 bg-cyan-600 rounded-full"></div>
                    İş Deneyimi
                  </h2>
                  <div className="space-y-6">
                    {data.experience.map((exp, i) => (
                      <div key={i} className="border-l-4 border-cyan-600 pl-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{exp.position}</h3>
                        <p className="text-cyan-600 font-semibold mb-2">{exp.company}</p>
                        <p className="text-sm text-gray-600 mb-3">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                        {exp.description && <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <div className="space-y-8">
              {data.skills.length > 0 && (
                <section className="bg-white p-8 rounded-2xl shadow-lg">
                  <h2 className="text-2xl font-bold text-cyan-600 mb-6">Beceriler</h2>
                  <div className="flex flex-wrap gap-3">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-full text-sm font-semibold">{skill}</span>
                    ))}
                  </div>
                </section>
              )}
              {data.education.length > 0 && (
                <section className="bg-white p-8 rounded-2xl shadow-lg">
                  <h2 className="text-2xl font-bold text-cyan-600 mb-6">Eğitim</h2>
                  <div className="space-y-4">
                    {data.education.map((edu, i) => (
                      <div key={i} className="border-l-4 border-cyan-600 pl-4">
                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                        <p className="text-cyan-600">{edu.school}</p>
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

