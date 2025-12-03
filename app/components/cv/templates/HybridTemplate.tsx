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

export default function HybridTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-10">
          <div className="flex items-center gap-8">
            {data.personalInfo.profilePhoto && (
              <img src={data.personalInfo.profilePhoto} alt="Profile" className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl" />
            )}
            <div className="flex-1">
              <h1 className="text-5xl font-bold mb-3">{data.personalInfo.name || "Ad Soyad"}</h1>
              <div className="flex flex-wrap gap-6 text-indigo-100 text-sm">
                {data.personalInfo.email && <span>✉ {data.personalInfo.email}</span>}
                {data.personalInfo.phone && <span>📱 {data.personalInfo.phone}</span>}
                {data.personalInfo.linkedin && <span>💼 {data.personalInfo.linkedin}</span>}
                {data.personalInfo.website && <span>🌐 {data.personalInfo.website}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="p-10">
          {data.summary && (
            <section className="mb-10 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-xl border-l-8 border-indigo-600">
              <h2 className="text-3xl font-bold text-indigo-700 mb-4">Özet</h2>
              <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line text-lg">{data.summary}</p>
            </section>
          )}
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
              {data.experience.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-indigo-600 mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-indigo-600 to-purple-600"></div>
                    İş Deneyimi
                  </h2>
                  <div className="space-y-6">
                    {data.experience.map((exp, i) => (
                      <div key={i} className="border-l-4 border-indigo-600 pl-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{exp.position}</h3>
                        <p className="text-indigo-600 font-semibold mb-2">{exp.company}</p>
                        <p className="text-sm text-gray-600 mb-3">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                        {exp.description && <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.projects.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-purple-600 mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-purple-600 to-pink-600"></div>
                    Projeler
                  </h2>
                  <div className="space-y-4">
                    {data.projects.map((project, i) => (
                      <div key={i} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h3>
                        {project.technologies && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.technologies.split(',').map((tech, j) => (
                              <span key={j} className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-xs font-semibold">{tech.trim()}</span>
                            ))}
                          </div>
                        )}
                        {project.description && <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">{project.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <div className="space-y-8">
              {data.skills.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-pink-600 mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-pink-600 to-purple-600"></div>
                    Beceriler
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-semibold">{skill}</span>
                    ))}
                  </div>
                </section>
              )}
              {data.education.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-indigo-600 mb-6">Eğitim</h2>
                  <div className="space-y-4">
                    {data.education.map((edu, i) => (
                      <div key={i} className="border-l-4 border-indigo-600 pl-4">
                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                        <p className="text-indigo-600 font-medium">{edu.school}</p>
                        <p className="text-gray-600 text-sm mt-1">{edu.startDate} - {edu.endDate}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.achievements.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-purple-600 mb-6">Başarılar</h2>
                  <div className="space-y-4">
                    {data.achievements.map((achievement, i) => (
                      <div key={i} className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-900 mb-1">{achievement.title}</h3>
                        {achievement.description && <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-sm">{achievement.description}</p>}
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

