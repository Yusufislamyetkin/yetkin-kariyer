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

export default function PortfolioTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-10">
          <div className="flex items-center gap-8">
            {data.personalInfo.profilePhoto && (
              <img src={data.personalInfo.profilePhoto} alt="Profile" className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl" />
            )}
            <div className="flex-1">
              <h1 className="text-5xl font-bold mb-3">{data.personalInfo.name || "Ad Soyad"}</h1>
              <div className="flex flex-wrap gap-6 text-violet-100 text-sm">
                {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="p-10">
          {data.summary && (
            <section className="mb-10 bg-violet-50 p-8 rounded-xl border-l-8 border-violet-600">
              <h2 className="text-3xl font-bold text-violet-700 mb-4">Özet</h2>
              <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line text-lg">{data.summary}</p>
            </section>
          )}
          {data.projects.length > 0 && (
            <section className="mb-10">
              <h2 className="text-3xl font-bold text-violet-700 mb-8">Projeler</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {data.projects.map((project, i) => (
                  <div key={i} className="bg-gradient-to-br from-violet-50 to-purple-50 p-6 rounded-xl border-2 border-violet-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h3>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies.split(',').map((tech, j) => (
                          <span key={j} className="px-3 py-1 bg-violet-600 text-white rounded-full text-xs font-semibold">{tech.trim()}</span>
                        ))}
                      </div>
                    )}
                    {project.description && <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">{project.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
              {data.experience.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-violet-700 mb-6">Deneyim</h2>
                  <div className="space-y-4">
                    {data.experience.map((exp, i) => (
                      <div key={i} className="border-l-4 border-violet-600 pl-4">
                        <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-violet-600 font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-600">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <div className="space-y-8">
              {data.skills.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-violet-700 mb-6">Beceriler</h2>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold">{skill}</span>
                    ))}
                  </div>
                </section>
              )}
              {data.education.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-violet-700 mb-6">Eğitim</h2>
                  <div className="space-y-3">
                    {data.education.map((edu, i) => (
                      <div key={i} className="border-l-4 border-violet-600 pl-4">
                        <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-violet-600">{edu.school}</p>
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

