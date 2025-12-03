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

export default function ArtisticTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-purple-800 via-pink-600 to-red-600 text-white p-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="relative">
            <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: 'serif', letterSpacing: '3px' }}>{data.personalInfo.name || "Ad Soyad"}</h1>
            <div className="flex flex-wrap gap-6 text-purple-100 text-sm">
              {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
              {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
            </div>
          </div>
        </div>
        <div className="p-10">
          {data.summary && (
            <section className="mb-10">
              <div className="h-2 w-32 bg-gradient-to-r from-purple-600 to-pink-600 mb-4"></div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'serif' }}>Özet</h2>
              <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line text-lg">{data.summary}</p>
            </section>
          )}
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
              {data.experience.length > 0 && (
                <section>
                  <div className="h-2 w-32 bg-gradient-to-r from-purple-600 to-pink-600 mb-4"></div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900" style={{ fontFamily: 'serif' }}>Deneyim</h2>
                  <div className="space-y-6">
                    {data.experience.map((exp, i) => (
                      <div key={i} className="relative pl-8 border-l-4 border-purple-600">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{exp.position}</h3>
                        <p className="text-purple-600 font-semibold mb-2">{exp.company}</p>
                        <p className="text-sm text-gray-600 mb-3">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                        {exp.description && <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.projects.length > 0 && (
                <section>
                  <div className="h-2 w-32 bg-gradient-to-r from-purple-600 to-pink-600 mb-4"></div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900" style={{ fontFamily: 'serif' }}>Projeler</h2>
                  <div className="space-y-6">
                    {data.projects.map((project, i) => (
                      <div key={i} className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
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
                  <div className="h-2 w-32 bg-gradient-to-r from-purple-600 to-pink-600 mb-4"></div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900" style={{ fontFamily: 'serif' }}>Beceriler</h2>
                  <div className="flex flex-wrap gap-3">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold">{skill}</span>
                    ))}
                  </div>
                </section>
              )}
              {data.education.length > 0 && (
                <section>
                  <div className="h-2 w-32 bg-gradient-to-r from-purple-600 to-pink-600 mb-4"></div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900" style={{ fontFamily: 'serif' }}>Eğitim</h2>
                  <div className="space-y-4">
                    {data.education.map((edu, i) => (
                      <div key={i} className="border-l-4 border-purple-600 pl-4">
                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                        <p className="text-purple-600 font-medium">{edu.school}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.achievements.length > 0 && (
                <section>
                  <div className="h-2 w-32 bg-gradient-to-r from-purple-600 to-pink-600 mb-4"></div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900" style={{ fontFamily: 'serif' }}>Başarılar</h2>
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

