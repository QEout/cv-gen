import React from 'react';
import { ResumeData, TemplateType } from '../types';

interface PreviewProps {
  data: ResumeData;
  template: TemplateType;
  scale?: number;
}

export const Preview: React.FC<PreviewProps> = ({ data, template, scale = 1 }) => {
  
  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'minimalist':
        return <MinimalistTemplate data={data} />;
      case 'classic':
      default:
        return <ClassicTemplate data={data} />;
    }
  };

  return (
    <div 
        className="bg-white shadow-2xl mx-auto transition-all origin-top print:shadow-none print:mx-0 print:w-full print:h-full"
        style={{ 
            width: '210mm', 
            minHeight: '297mm', 
            transform: `scale(${scale})`,
            marginBottom: `${(scale - 1) * 297}mm` // Compensate for scale space
        }}
    >
      {renderTemplate()}
    </div>
  );
};

// --- Helper Components for Rendering ---

const DateRange = ({ start, end }: { start: string, end: string }) => (
    <span className="whitespace-nowrap">{start} {start && end ? '–' : ''} {end}</span>
);

const BulletList = ({ text }: { text: string }) => {
    if (!text) return null;
    const items = text.split('\n').filter(line => line.trim().length > 0);
    return (
        <ul className="list-disc ml-4 space-y-1">
            {items.map((item, idx) => (
                <li key={idx} className="text-inherit leading-relaxed">{item.replace(/^[•-]\s*/, '')}</li>
            ))}
        </ul>
    );
};

// --- Templates ---

const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    return (
        <div className="p-10 font-serif text-slate-900 h-full">
            {/* Header */}
            <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">{data.personalInfo.fullName || "Your Name"}</h1>
                <div className="text-sm flex justify-center gap-4 flex-wrap">
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
                    {data.personalInfo.linkedin && <span>• {data.personalInfo.linkedin}</span>}
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-6">
                {/* Summary */}
                {data.personalInfo.summary && (
                    <section>
                        <h2 className="text-sm font-bold uppercase border-b border-slate-300 mb-3">Professional Summary</h2>
                        <p className="text-sm text-justify">{data.personalInfo.summary}</p>
                    </section>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase border-b border-slate-300 mb-3">Education</h2>
                        <div className="space-y-3">
                            {data.education.map(edu => (
                                <div key={edu.id}>
                                    <div className="flex justify-between font-bold text-sm">
                                        <span>{edu.school}</span>
                                        <DateRange start={edu.startDate} end={edu.endDate} />
                                    </div>
                                    <div className="flex justify-between text-sm italic">
                                        <span>{edu.degree}</span>
                                        <span>{edu.location}</span>
                                    </div>
                                    {edu.gpa && <div className="text-sm">GPA: {edu.gpa}</div>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase border-b border-slate-300 mb-3">Experience</h2>
                        <div className="space-y-4">
                            {data.experience.map(exp => (
                                <div key={exp.id}>
                                    <div className="flex justify-between font-bold text-sm">
                                        <span>{exp.company}</span>
                                        <DateRange start={exp.startDate} end={exp.endDate} />
                                    </div>
                                    <div className="flex justify-between text-sm italic mb-1">
                                        <span>{exp.role}</span>
                                    </div>
                                    <div className="text-sm text-justify">
                                        <BulletList text={exp.description} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                 {/* Skills */}
                 {data.skills && (
                    <section>
                        <h2 className="text-sm font-bold uppercase border-b border-slate-300 mb-3">Skills</h2>
                        <p className="text-sm">{data.skills}</p>
                    </section>
                )}
            </div>
        </div>
    );
};

const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    return (
        <div className="font-sans text-slate-800 h-full flex flex-col">
            {/* Header */}
            <div className="bg-slate-800 text-white p-8">
                <h1 className="text-4xl font-bold mb-2">{data.personalInfo.fullName || "Your Name"}</h1>
                <p className="text-slate-300 text-sm max-w-2xl">{data.personalInfo.summary}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
                    {data.personalInfo.email && <span>📧 {data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>📱 {data.personalInfo.phone}</span>}
                    {data.personalInfo.linkedin && <span>🔗 {data.personalInfo.linkedin}</span>}
                </div>
            </div>

            <div className="p-8 grid grid-cols-12 gap-8 flex-grow">
                {/* Main Column */}
                <div className="col-span-8 space-y-8">
                     {/* Experience */}
                    {data.experience.length > 0 && (
                        <section>
                            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider mb-4 border-b-2 border-slate-200 pb-1">Experience</h3>
                            <div className="space-y-5">
                                {data.experience.map(exp => (
                                    <div key={exp.id}>
                                        <h4 className="font-bold text-md text-slate-900">{exp.role}</h4>
                                        <div className="text-sm text-slate-600 font-medium mb-2">{exp.company} | <DateRange start={exp.startDate} end={exp.endDate} /></div>
                                        <div className="text-sm text-slate-700">
                                            <BulletList text={exp.description} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                     {/* Projects (Merged into main for modern) */}
                     {data.projects && data.projects.length > 0 && (
                        <section>
                            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider mb-4 border-b-2 border-slate-200 pb-1">Projects</h3>
                             <div className="space-y-4">
                                {data.projects.map(proj => (
                                    <div key={proj.id}>
                                        <h4 className="font-bold text-md">{proj.name}</h4>
                                        <div className="text-sm text-slate-700">
                                            <BulletList text={proj.description} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                     )}
                </div>

                {/* Sidebar Column */}
                <div className="col-span-4 space-y-8">
                    {/* Education */}
                    {data.education.length > 0 && (
                        <section>
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b-2 border-slate-200 pb-1">Education</h3>
                            <div className="space-y-4">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <div className="font-bold text-sm">{edu.school}</div>
                                        <div className="text-xs text-slate-600">{edu.degree}</div>
                                        <div className="text-xs text-slate-500 mb-1"><DateRange start={edu.startDate} end={edu.endDate} /></div>
                                        {edu.gpa && <div className="text-xs font-medium text-blue-600">GPA: {edu.gpa}</div>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {data.skills && (
                         <section>
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b-2 border-slate-200 pb-1">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.split(',').map((skill, idx) => (
                                    <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">{skill.trim()}</span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Awards */}
                    {data.awards && (
                         <section>
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b-2 border-slate-200 pb-1">Awards</h3>
                            <p className="text-xs text-slate-700 whitespace-pre-line">{data.awards}</p>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

const MinimalistTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
     return (
        <div className="p-12 font-sans text-gray-800 h-full">
            <header className="mb-8">
                <h1 className="text-4xl font-light tracking-tight mb-1">{data.personalInfo.fullName || "Your Name"}</h1>
                <div className="text-sm text-gray-500 flex gap-3">
                    <span>{data.personalInfo.email}</span>
                    <span>{data.personalInfo.phone}</span>
                </div>
            </header>

            <div className="grid gap-6">
                {data.personalInfo.summary && (
                    <section>
                         <p className="text-sm leading-relaxed text-gray-700 max-w-3xl">{data.personalInfo.summary}</p>
                    </section>
                )}

                {data.experience.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Experience</h2>
                        <div className="space-y-6 border-l border-gray-200 pl-4">
                             {data.experience.map(exp => (
                                <div key={exp.id} className="relative">
                                    <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-gray-200"></div>
                                    <h3 className="font-semibold text-sm">{exp.role} <span className="font-normal text-gray-500">at {exp.company}</span></h3>
                                    <div className="text-xs text-gray-400 mb-2 font-mono"><DateRange start={exp.startDate} end={exp.endDate} /></div>
                                    <div className="text-sm text-gray-600">
                                         <BulletList text={exp.description} />
                                    </div>
                                </div>
                             ))}
                        </div>
                    </section>
                )}

                {data.education.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Education</h2>
                         <div className="space-y-3 pl-4">
                             {data.education.map(edu => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-semibold text-sm">{edu.school}</h3>
                                        <span className="text-xs text-gray-400 font-mono"><DateRange start={edu.startDate} end={edu.endDate} /></span>
                                    </div>
                                    <div className="text-sm text-gray-600">{edu.degree}</div>
                                </div>
                             ))}
                         </div>
                    </section>
                )}
                 
                {data.skills && (
                    <section>
                         <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Skills</h2>
                         <p className="text-sm text-gray-600 pl-4">{data.skills}</p>
                    </section>
                )}
            </div>
        </div>
     );
};