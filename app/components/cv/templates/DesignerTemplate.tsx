/* eslint-disable @next/next/no-img-element */
interface CVData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    website: string;
    profilePhoto?: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    current: boolean;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: string[];
  languages: Array<{
    name: string;
    level: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    url?: string;
    startDate: string;
    endDate: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }>;
  references: Array<{
    name: string;
    position: string;
    company: string;
    email: string;
    phone: string;
  }>;
  hobbies: string[];
}

interface DesignerTemplateProps {
  data: CVData;
}

export default function DesignerTemplate({ data }: DesignerTemplateProps) {
  return (
    <div className="bg-white text-gray-900 break-words" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="max-w-6xl mx-auto">
        {/* Creative Header */}
        <div className="bg-black text-white p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full opacity-20 -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full opacity-20 -ml-24 -mb-24"></div>
          <div className="relative flex items-center gap-8">
            {data.personalInfo.profilePhoto && (
              <img
                src={data.personalInfo.profilePhoto}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-pink-500 shadow-xl"
              />
            )}
            <div className="flex-1">
              <h1 className="text-5xl font-bold mb-3" style={{ letterSpacing: '2px' }}>
                {data.personalInfo.name || "Ad Soyad"}
              </h1>
              <div className="flex flex-wrap gap-6 text-gray-300 text-sm">
                {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
                {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="p-10">
          {/* Summary */}
          {data.summary && (
            <section className="mb-10">
              <div className="h-1 w-24 bg-pink-500 mb-4"></div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Özet</h2>
              <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line text-lg">
                {data.summary}
              </p>
            </section>
          )}

          <div className="grid md:grid-cols-2 gap-10">
            {/* Main Content */}
            <div className="space-y-8">
              {/* Experience */}
              {data.experience.length > 0 && (
                <section>
                  <div className="h-1 w-24 bg-pink-500 mb-4"></div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">İş Deneyimi</h2>
                  <div className="space-y-6">
                    {data.experience.map((exp, index) => (
                      <div key={index} className="relative pl-6 border-l-4 border-pink-500">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{exp.position || "Pozisyon"}</h3>
                        <p className="text-pink-600 font-semibold mb-2">{exp.company || "Şirket"}</p>
                        <p className="text-sm text-gray-600 mb-3">
                          {exp.startDate && `${exp.startDate} - `}
                          {exp.current ? "Devam ediyor" : exp.endDate || ""}
                        </p>
                        {exp.description && (
                          <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {data.projects.length > 0 && (
                <section>
                  <div className="h-1 w-24 bg-pink-500 mb-4"></div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Projeler</h2>
                  <div className="space-y-6">
                    {data.projects.map((project, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name || "Proje Adı"}</h3>
                        {project.technologies && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.technologies.split(',').map((tech, i) => (
                              <span key={i} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        {project.description && (
                          <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">
                            {project.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Skills */}
              {data.skills.length > 0 && (
                <section>
                  <div className="h-1 w-24 bg-pink-500 mb-4"></div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Beceriler</h2>
                  <div className="flex flex-wrap gap-3">
                    {data.skills.map((skill, index) => (
                      <span key={index} className="px-4 py-2 bg-black text-white rounded text-sm font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {data.education.length > 0 && (
                <section>
                  <div className="h-1 w-24 bg-pink-500 mb-4"></div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Eğitim</h2>
                  <div className="space-y-4">
                    {data.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-pink-500 pl-4">
                        <h3 className="font-bold text-gray-900">{edu.degree || "Derece"}</h3>
                        <p className="text-pink-600 font-medium">{edu.school || "Okul"}</p>
                        <p className="text-gray-600 text-sm mt-1">
                          {edu.startDate && `${edu.startDate} - `}
                          {edu.endDate || ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Achievements */}
              {data.achievements.length > 0 && (
                <section>
                  <div className="h-1 w-24 bg-pink-500 mb-4"></div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Başarılar</h2>
                  <div className="space-y-4">
                    {data.achievements.map((achievement, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-900 mb-1">{achievement.title || "Başlık"}</h3>
                        {achievement.description && (
                          <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-sm">
                            {achievement.description}
                          </p>
                        )}
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

