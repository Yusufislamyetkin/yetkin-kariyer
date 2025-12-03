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

export default function BilingualTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words">
      <div className="max-w-5xl mx-auto p-8">
        <div className="border-b-4 border-teal-600 pb-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="text-sm text-gray-700 space-y-1">
            {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          </div>
        </div>
        {data.summary && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-teal-600 mb-3 border-b-2 border-teal-600 pb-1">Özet / Summary</h2>
            <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">{data.summary}</p>
          </section>
        )}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-teal-600 mb-4 border-b-2 border-teal-600 pb-1">İş Deneyimi / Experience</h2>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i} className="border-l-4 border-teal-600 pl-4">
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-teal-700">{exp.company}</p>
                  <p className="text-sm text-gray-600 mb-2">{exp.startDate} - {exp.current ? "Devam ediyor / Present" : exp.endDate}</p>
                  {exp.description && <p className="text-gray-700 mt-2 break-words whitespace-pre-line text-sm">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {data.education.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-teal-600 mb-4 border-b-2 border-teal-600 pb-1">Eğitim / Education</h2>
                <div className="space-y-3">
                  {data.education.map((edu, i) => (
                    <div key={i} className="border-l-4 border-teal-600 pl-4">
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-teal-700 text-sm">{edu.school}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          <div>
            {data.skills.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-teal-600 mb-4 border-b-2 border-teal-600 pb-1">Beceriler / Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-teal-100 text-teal-800 rounded text-sm">{skill}</span>
                  ))}
                </div>
              </section>
            )}
            {data.languages.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-teal-600 mb-4 border-b-2 border-teal-600 pb-1">Diller / Languages</h2>
                <div className="space-y-2">
                  {data.languages.map((lang, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-900">{lang.name}</span>
                      <span className="text-gray-600 text-sm">{lang.level}</span>
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

