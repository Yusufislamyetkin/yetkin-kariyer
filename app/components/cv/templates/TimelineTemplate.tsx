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

export default function TimelineTemplate({ data }: { data: CVData }) {
  return (
    <div className="bg-white text-gray-900 break-words overflow-hidden" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="max-w-4xl mx-auto p-4 flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="text-center border-b-4 border-blue-600 pb-3 mb-2 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="text-xs text-gray-700 space-y-0.5">
            {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          </div>
        </div>
        {data.summary && (
          <section className="mb-2 flex-shrink-0">
            <h2 className="text-lg font-bold text-blue-600 mb-1">Özet</h2>
            <p className="text-gray-700 leading-tight break-words whitespace-pre-line text-sm line-clamp-3">{data.summary}</p>
          </section>
        )}
        <div className="relative flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-600"></div>
          <div className="space-y-2">
            {data.experience.map((exp, i) => (
              <div key={i} className="relative pl-10">
                <div className="absolute left-3 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></div>
                <div className="bg-gray-50 p-2 rounded-lg border-l-4 border-blue-600">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-blue-600 font-medium text-sm">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-600 bg-blue-100 px-2 py-0.5 rounded">
                      {exp.startDate} - {exp.current ? "Devam" : exp.endDate}
                    </span>
                  </div>
                  {exp.description && <p className="text-gray-700 mt-1 break-words whitespace-pre-line text-xs line-clamp-2">{exp.description}</p>}
                </div>
              </div>
            ))}
            {data.education.map((edu, i) => (
              <div key={`edu-${i}`} className="relative pl-10">
                <div className="absolute left-3 w-2 h-2 bg-green-600 rounded-full border-2 border-white"></div>
                <div className="bg-gray-50 p-2 rounded-lg border-l-4 border-green-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-green-600 font-medium text-sm">{edu.school}</p>
                    </div>
                    <span className="text-xs text-gray-600 bg-green-100 px-2 py-0.5 rounded">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {data.skills.length > 0 && (
          <section className="mt-2 flex-shrink-0">
            <h2 className="text-lg font-bold text-blue-600 mb-1">Beceriler</h2>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((skill, i) => (
                <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">{skill}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

