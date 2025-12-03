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

export default function DetailedTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words">
      <div className="max-w-5xl mx-auto p-10">
        <div className="border-b-4 border-gray-800 pb-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            {data.personalInfo.email && <div>Email: {data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>Telefon: {data.personalInfo.phone}</div>}
            {data.personalInfo.address && <div>Adres: {data.personalInfo.address}</div>}
            {data.personalInfo.linkedin && <div>LinkedIn: {data.personalInfo.linkedin}</div>}
            {data.personalInfo.website && <div>Website: {data.personalInfo.website}</div>}
          </div>
        </div>
        {data.summary && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b-2 border-gray-800 pb-1">Profesyonel Özet</h2>
            <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">{data.summary}</p>
          </section>
        )}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-800 pb-1">İş Deneyimi</h2>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i} className="border-l-4 border-gray-800 pl-4">
                  <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-gray-800 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-600 mb-3">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                  {exp.description && <p className="text-gray-700 mt-3 break-words whitespace-pre-line leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {data.education.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-800 pb-1">Eğitim</h2>
                <div className="space-y-4">
                  {data.education.map((edu, i) => (
                    <div key={i} className="border-l-4 border-gray-800 pl-4">
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-800">{edu.school}</p>
                      {edu.field && <p className="text-gray-700 text-sm">{edu.field}</p>}
                      {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                      <p className="text-sm text-gray-600 mt-1">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.projects.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-800 pb-1">Projeler</h2>
                <div className="space-y-4">
                  {data.projects.map((project, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded border-l-4 border-gray-800">
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      {project.technologies && (
                        <p className="text-gray-700 text-sm mt-1">Teknolojiler: {project.technologies}</p>
                      )}
                      {project.description && <p className="text-gray-700 mt-2 break-words whitespace-pre-line text-sm">{project.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          <div className="space-y-6">
            {data.skills.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-800 pb-1">Beceriler</h2>
                <div className="space-y-2">
                  {data.skills.map((skill, i) => (
                    <div key={i} className="bg-gray-100 p-2 rounded text-sm text-gray-900">{skill}</div>
                  ))}
                </div>
              </section>
            )}
            {data.languages.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-800 pb-1">Diller</h2>
                <div className="space-y-3">
                  {data.languages.map((lang, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-gray-900 font-medium">{lang.name}</span>
                      <span className="text-gray-700 text-sm">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.certifications.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-800 pb-1">Sertifikalar</h2>
                <div className="space-y-3">
                  {data.certifications.map((cert, i) => (
                    <div key={i} className="border-l-4 border-gray-800 pl-4">
                      <p className="font-semibold text-gray-900">{cert.name}</p>
                      <p className="text-gray-800 text-sm">{cert.issuer}</p>
                      {cert.date && <p className="text-gray-600 text-xs mt-1">{cert.date}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.achievements.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-800 pb-1">Başarılar</h2>
                <div className="space-y-3">
                  {data.achievements.map((achievement, i) => (
                    <div key={i} className="border-l-4 border-gray-800 pl-4">
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      {achievement.description && <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-sm">{achievement.description}</p>}
                      {achievement.date && <p className="text-gray-600 text-xs mt-1">{achievement.date}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.references.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-800 pb-1">Referanslar</h2>
                <div className="space-y-3">
                  {data.references.map((ref, i) => (
                    <div key={i} className="border-l-4 border-gray-800 pl-4">
                      <p className="font-semibold text-gray-900">{ref.name}</p>
                      <p className="text-gray-800 text-sm">{ref.position}, {ref.company}</p>
                      <p className="text-gray-700 text-xs mt-1">{ref.email} | {ref.phone}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {data.hobbies.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-800 pb-1">Hobiler</h2>
                <p className="text-gray-700">{data.hobbies.join(', ')}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

