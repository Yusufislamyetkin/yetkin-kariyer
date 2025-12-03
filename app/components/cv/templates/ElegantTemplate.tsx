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

export default function ElegantTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words" style={{ fontFamily: 'Garamond, serif' }}>
      <div className="max-w-4xl mx-auto p-12">
        <div className="text-center border-b-2 border-gray-400 pb-8 mb-10">
          <h1 className="text-5xl font-light mb-4 text-gray-900" style={{ letterSpacing: '4px' }}>{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="text-sm text-gray-600 space-y-2" style={{ letterSpacing: '1px' }}>
            {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
            {data.personalInfo.address && <div>{data.personalInfo.address}</div>}
          </div>
        </div>
        {data.summary && (
          <section className="mb-10 text-center">
            <div className="w-24 h-px bg-gray-400 mx-auto mb-6"></div>
            <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line italic text-lg">{data.summary}</p>
            <div className="w-24 h-px bg-gray-400 mx-auto mt-6"></div>
          </section>
        )}
        {data.experience.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-light mb-6 text-gray-900 uppercase tracking-widest text-center border-b border-gray-300 pb-3">İş Deneyimi</h2>
            <div className="space-y-8">
              {data.experience.map((exp, i) => (
                <div key={i} className="text-center">
                  <h3 className="text-xl font-light text-gray-900 mb-1">{exp.position}</h3>
                  <p className="text-gray-600 italic mb-2">{exp.company}</p>
                  <p className="text-sm text-gray-500 mb-4">{exp.startDate} - {exp.current ? "Devam ediyor" : exp.endDate}</p>
                  {exp.description && <p className="text-gray-700 mt-4 break-words whitespace-pre-line text-sm max-w-2xl mx-auto">{exp.description}</p>}
                  {i < data.experience.length - 1 && <div className="w-16 h-px bg-gray-300 mx-auto mt-8"></div>}
                </div>
              ))}
            </div>
          </section>
        )}
        <div className="grid md:grid-cols-2 gap-12">
          {data.education.length > 0 && (
            <section>
              <h2 className="text-xl font-light mb-6 text-gray-900 uppercase tracking-widest text-center border-b border-gray-300 pb-2">Eğitim</h2>
              <div className="space-y-6">
                {data.education.map((edu, i) => (
                  <div key={i} className="text-center">
                    <h3 className="font-light text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600 italic text-sm">{edu.school}</p>
                    <p className="text-xs text-gray-500 mt-1">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-xl font-light mb-6 text-gray-900 uppercase tracking-widest text-center border-b border-gray-300 pb-2">Beceriler</h2>
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

