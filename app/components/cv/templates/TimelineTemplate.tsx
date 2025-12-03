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
    <div className="bg-white text-gray-900 break-words">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center border-b-4 border-blue-600 pb-6 mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.personalInfo.name || "Ad Soyad"}</h1>
          <div className="text-sm text-gray-700 space-y-1">
            {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          </div>
        </div>
        {data.summary && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Özet</h2>
            <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">{data.summary}</p>
          </section>
        )}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-blue-600"></div>
          <div className="space-y-8">
            {data.experience.map((exp, i) => (
              <div key={i} className="relative pl-20">
                <div className="absolute left-6 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-600 bg-blue-100 px-3 py-1 rounded">
                      {exp.startDate} - {exp.current ? "Devam" : exp.endDate}
                    </span>
                  </div>
                  {exp.description && <p className="text-gray-700 mt-3 break-words whitespace-pre-line text-sm">{exp.description}</p>}
                </div>
              </div>
            ))}
            {data.education.map((edu, i) => (
              <div key={`edu-${i}`} className="relative pl-20">
                <div className="absolute left-6 w-4 h-4 bg-green-600 rounded-full border-4 border-white"></div>
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-green-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-green-600 font-medium">{edu.school}</p>
                    </div>
                    <span className="text-sm text-gray-600 bg-green-100 px-3 py-1 rounded">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {data.skills.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Beceriler</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">{skill}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

