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

export default function MarketingTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 text-gray-900 break-words">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-8">
          <div className="flex items-center gap-6">
            {data.personalInfo.profilePhoto && (
              <img src={data.personalInfo.profilePhoto} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{data.personalInfo.name || "Ad Soyad"}</h1>
              <div className="flex flex-wrap gap-4 text-orange-100 text-sm">
                {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="p-8">
          {data.summary && (
            <section className="mb-8 bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
              <h2 className="text-2xl font-bold text-orange-600 mb-3">Özet</h2>
              <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">{data.summary}</p>
            </section>
          )}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {data.experience.length > 0 && (
                <section className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold text-orange-600 mb-4">İş Deneyimi</h2>
                  <div className="space-y-4">
                    {data.experience.map((exp, i) => (
                      <div key={i} className="border-l-4 border-orange-500 pl-4">
                        <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-orange-600 font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-600 mb-2">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                        {exp.description && <p className="text-gray-700 mt-2 break-words whitespace-pre-line text-sm">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.projects.length > 0 && (
                <section className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold text-orange-600 mb-4">Projeler</h2>
                  <div className="space-y-4">
                    {data.projects.map((project, i) => (
                      <div key={i} className="border-l-4 border-orange-500 pl-4">
                        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                        {project.description && <p className="text-gray-700 mt-2 break-words whitespace-pre-line text-sm">{project.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <div className="space-y-6">
              {data.skills.length > 0 && (
                <section className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold text-orange-600 mb-4">Beceriler</h2>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">{skill}</span>
                    ))}
                  </div>
                </section>
              )}
              {data.education.length > 0 && (
                <section className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold text-orange-600 mb-4">Eğitim</h2>
                  <div className="space-y-3">
                    {data.education.map((edu, i) => (
                      <div key={i}>
                        <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-orange-600 text-sm">{edu.school}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.achievements.length > 0 && (
                <section className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold text-orange-600 mb-4">Başarılar</h2>
                  <div className="space-y-3">
                    {data.achievements.map((achievement, i) => (
                      <div key={i} className="border-l-4 border-orange-500 pl-3">
                        <h3 className="font-semibold text-gray-900 text-sm">{achievement.title}</h3>
                        {achievement.description && <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-xs">{achievement.description}</p>}
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

