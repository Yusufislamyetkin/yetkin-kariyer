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

export default function EntrepreneurTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 text-gray-900 break-words">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-10">
          <h1 className="text-5xl font-bold mb-3">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="flex flex-wrap gap-6 text-yellow-100 text-sm">
            {data.personalInfo.email && <span>✉ {data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>📱 {data.personalInfo.phone}</span>}
            {data.personalInfo.website && <span>🌐 {data.personalInfo.website}</span>}
          </div>
        </div>
        <div className="p-10">
          {data.summary && (
            <section className="mb-10 bg-white p-8 rounded-xl shadow-lg border-l-8 border-yellow-500">
              <h2 className="text-3xl font-bold text-yellow-600 mb-4">Özet</h2>
              <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line text-lg">{data.summary}</p>
            </section>
          )}
          {data.experience.length > 0 && (
            <section className="mb-10 bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-yellow-600 mb-6">Girişimcilik Deneyimi</h2>
              <div className="space-y-6">
                {data.experience.map((exp, i) => (
                  <div key={i} className="border-l-8 border-yellow-500 pl-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{exp.position}</h3>
                    <p className="text-yellow-600 font-semibold text-lg mb-2">{exp.company}</p>
                    <p className="text-sm text-gray-600 mb-3">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                    {exp.description && <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.projects.length > 0 && (
            <section className="mb-10 bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-yellow-600 mb-6">Projeler</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {data.projects.map((project, i) => (
                  <div key={i} className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-300">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
                    {project.description && <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">{project.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.achievements.length > 0 && (
            <section className="mb-10 bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-yellow-600 mb-6">Başarılar</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.achievements.map((achievement, i) => (
                  <div key={i} className="bg-yellow-50 p-5 rounded-lg border-l-4 border-yellow-500">
                    <h3 className="font-bold text-gray-900 mb-1">{achievement.title}</h3>
                    {achievement.description && <p className="text-gray-700 mt-2 break-words whitespace-pre-line text-sm">{achievement.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              {data.skills.length > 0 && (
                <section className="bg-white p-8 rounded-xl shadow-lg">
                  <h2 className="text-2xl font-bold text-yellow-600 mb-6">Beceriler</h2>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-4 py-2 bg-yellow-500 text-white rounded-full text-sm font-semibold">{skill}</span>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <div>
              {data.education.length > 0 && (
                <section className="bg-white p-8 rounded-xl shadow-lg">
                  <h2 className="text-2xl font-bold text-yellow-600 mb-6">Eğitim</h2>
                  <div className="space-y-3">
                    {data.education.map((edu, i) => (
                      <div key={i} className="border-l-4 border-yellow-500 pl-4">
                        <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-yellow-600">{edu.school}</p>
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

