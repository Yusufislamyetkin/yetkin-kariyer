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

export default function ExecutivePremiumTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="max-w-5xl mx-auto p-12">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-12 mb-10">
          <h1 className="text-5xl font-light mb-4" style={{ letterSpacing: '3px' }}>{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="text-gray-300 text-sm space-y-2" style={{ letterSpacing: '1px' }}>
            {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
            {data.personalInfo.address && <div>{data.personalInfo.address}</div>}
            {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
          </div>
        </div>
        {data.summary && (
          <section className="mb-10 text-center">
            <div className="w-32 h-px bg-gray-400 mx-auto mb-6"></div>
            <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line italic text-lg max-w-3xl mx-auto">{data.summary}</p>
            <div className="w-32 h-px bg-gray-400 mx-auto mt-6"></div>
          </section>
        )}
        {data.experience.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-light mb-8 text-gray-900 uppercase tracking-widest text-center border-b-2 border-gray-400 pb-4">Executive Experience</h2>
            <div className="space-y-8">
              {data.experience.map((exp, i) => (
                <div key={i} className="text-center">
                  <h3 className="text-2xl font-light text-gray-900 mb-2">{exp.position}</h3>
                  <p className="text-gray-600 italic text-lg mb-3">{exp.company}</p>
                  <p className="text-sm text-gray-500 mb-6">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</p>
                  {exp.description && <p className="text-gray-700 mt-6 break-words whitespace-pre-line text-sm max-w-3xl mx-auto leading-relaxed">{exp.description}</p>}
                  {i < data.experience.length - 1 && <div className="w-24 h-px bg-gray-300 mx-auto mt-10"></div>}
                </div>
              ))}
            </div>
          </section>
        )}
        {data.achievements.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-light mb-8 text-gray-900 uppercase tracking-widest text-center border-b-2 border-gray-400 pb-4">Key Achievements</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {data.achievements.map((achievement, i) => (
                <div key={i} className="text-center">
                  <h3 className="text-lg font-light text-gray-900 mb-2">{achievement.title}</h3>
                  {achievement.description && <p className="text-gray-700 text-sm">{achievement.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
        <div className="grid md:grid-cols-2 gap-12">
          {data.education.length > 0 && (
            <section>
              <h2 className="text-xl font-light mb-6 text-gray-900 uppercase tracking-widest text-center border-b border-gray-300 pb-2">Education</h2>
              <div className="space-y-6 text-center">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <h3 className="font-light text-gray-900 text-lg">{edu.degree}</h3>
                    <p className="text-gray-600 italic text-sm">{edu.school}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-xl font-light mb-6 text-gray-900 uppercase tracking-widest text-center border-b border-gray-300 pb-2">Core Competencies</h2>
              <div className="space-y-2 text-center">
                {data.skills.map((skill, i) => (
                  <div key={i} className="text-gray-700 text-sm">{skill}</div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

