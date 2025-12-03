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

export default function SalesTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8">
          <h1 className="text-4xl font-bold mb-2">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="flex flex-wrap gap-4 text-emerald-100 text-sm">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
          </div>
        </div>
        <div className="p-8">
          {data.summary && (
            <section className="mb-8 bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-600">
              <h2 className="text-2xl font-bold text-emerald-700 mb-3">Özet</h2>
              <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">{data.summary}</p>
            </section>
          )}
          {data.experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-emerald-700 mb-4 border-b-2 border-emerald-600 pb-1">İş Deneyimi</h2>
              <div className="space-y-4">
                {data.experience.map((exp, i) => (
                  <div key={i} className="bg-gray-50 p-5 rounded-lg border-l-4 border-emerald-600">
                    <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-emerald-700 font-medium">{exp.company}</p>
                    <p className="text-sm text-gray-600 mb-2">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                    {exp.description && <p className="text-gray-700 mt-2 break-words whitespace-pre-line">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.achievements.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-emerald-700 mb-4 border-b-2 border-emerald-600 pb-1">Başarılar</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.achievements.map((achievement, i) => (
                  <div key={i} className="bg-emerald-50 p-4 rounded-lg">
                    <h3 className="font-bold text-emerald-900">{achievement.title}</h3>
                    {achievement.description && <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-sm">{achievement.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {data.skills.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-emerald-700 mb-4">Beceriler</h2>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">{skill}</span>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <div>
              {data.education.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-emerald-700 mb-4">Eğitim</h2>
                  <div className="space-y-3">
                    {data.education.map((edu, i) => (
                      <div key={i}>
                        <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-emerald-700 text-sm">{edu.school}</p>
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

