import React from 'react';
import { ResumeData, Education, Experience, Project, PolishRequest } from '../types';
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp, Wand2, User, GraduationCap, Briefcase, Trophy, Code } from 'lucide-react';

interface EditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onPolish: (req: PolishRequest, callback: (newText: string) => void) => void;
  isPolishing: boolean;
}

export const Editor: React.FC<EditorProps> = ({ data, onChange, onPolish, isPolishing }) => {
  const [activeSection, setActiveSection] = React.useState<string | null>('personal');

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  // Generic handlers for arrays (Edu, Exp, Proj)
  const addItem = <T extends { id: string }>(
    field: 'education' | 'experience' | 'projects',
    newItem: T
  ) => {
    onChange({ ...data, [field]: [...data[field], newItem] });
  };

  const updateItem = <K extends 'education' | 'experience' | 'projects'>(
    field: K,
    id: string,
    itemField: K extends 'education' ? keyof Education : K extends 'experience' ? keyof Experience : keyof Project,
    value: string
  ) => {
    onChange({
      ...data,
      [field]: data[field].map((item: any) => (item.id === id ? { ...item, [itemField]: value } : item))
    });
  };

  const removeItem = (field: 'education' | 'experience' | 'projects', id: string) => {
    onChange({ ...data, [field]: data[field].filter((item: any) => item.id !== id) });
  };

  const SectionHeader = ({ title, id, icon: Icon }: { title: string, id: string, icon: any }) => (
    <button
      onClick={() => toggleSection(id)}
      className={`w-full flex items-center justify-between p-4 bg-white border-b transition-colors ${activeSection === id ? 'text-primary font-semibold bg-blue-50/50' : 'text-slate-600 hover:bg-slate-50'}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={activeSection === id ? 'text-primary' : 'text-slate-400'} />
        <span>{title}</span>
      </div>
      {activeSection === id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  );

  // Polish Button Component
  const PolishButton = ({ text, type, onApply }: { text: string, type: PolishRequest['type'], onApply: (val: string) => void }) => (
    <div className="flex justify-end mt-2">
      <button
        type="button"
        disabled={isPolishing || !text}
        onClick={() => onPolish({ text, type }, onApply)}
        className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border shadow-sm
            ${!text 
                ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200' 
                : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 hover:shadow-md active:scale-95'
            }
        `}
        title="使用 AI 优化这段文字"
      >
        <Wand2 size={12} className={isPolishing ? "animate-spin" : ""} />
        {isPolishing ? "润色中..." : "AI 润色"}
      </button>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-slate-50 border-r border-slate-200 pb-20 custom-scrollbar">
      <div className="p-5 border-b bg-white sticky top-0 z-10 shadow-sm">
        <h2 className="font-bold text-lg text-slate-800">简历编辑器</h2>
        <p className="text-xs text-slate-500 mt-1">填写信息，右侧实时预览。支持中英文输入，AI自动润色为英文。</p>
      </div>

      {/* Personal Info */}
      <SectionHeader title="个人信息 (Personal Info)" id="personal" icon={User} />
      {activeSection === 'personal' && (
        <div className="p-5 space-y-4 bg-white animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">姓名 (Name)</label>
              <input
                type="text"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={data.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                placeholder="Zhang San"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">邮箱 (Email)</label>
              <input
                type="email"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={data.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                placeholder="zhang.san@example.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">电话 (Phone)</label>
              <input
                type="text"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={data.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                placeholder="+86 138 0000 0000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">LinkedIn / 作品集</label>
              <input
                type="text"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={data.personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                placeholder="linkedin.com/in/zhangsan"
              />
            </div>
          </div>
          <div className="relative">
             <label className="block text-xs font-medium text-slate-500 mb-1.5">个人陈述 (Summary)</label>
             <textarea
                className="w-full p-3 border border-slate-200 rounded-lg text-sm h-32 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                value={data.personalInfo.summary}
                onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                placeholder="简要描述你的学术背景、研究兴趣和职业目标..."
             />
             <PolishButton 
                text={data.personalInfo.summary} 
                type="summary" 
                onApply={(val) => updatePersonalInfo('summary', val)} 
             />
          </div>
        </div>
      )}

      {/* Education */}
      <SectionHeader title="教育经历 (Education)" id="education" icon={GraduationCap} />
      {activeSection === 'education' && (
        <div className="p-5 space-y-6 bg-white animate-in slide-in-from-top-2 duration-200">
          {data.education.map((edu, index) => (
            <div key={edu.id} className="relative p-4 border border-slate-200 rounded-xl bg-slate-50/50 hover:border-blue-200 transition-colors group">
              <button 
                onClick={() => removeItem('education', edu.id)}
                className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                title="删除"
              >
                <Trash2 size={14} />
              </button>
              <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">学校名称</label>
                    <input
                    placeholder="Peking University"
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-medium focus:border-primary outline-none"
                    value={edu.school}
                    onChange={(e) => updateItem('education', edu.id, 'school', e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">学位</label>
                        <input
                            placeholder="BS Computer Science"
                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                            value={edu.degree}
                            onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">GPA</label>
                        <input
                            placeholder="3.8/4.0"
                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                            value={edu.gpa}
                            onChange={(e) => updateItem('education', edu.id, 'gpa', e.target.value)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">开始时间</label>
                        <input
                            placeholder="Sep 2020"
                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                            value={edu.startDate}
                            onChange={(e) => updateItem('education', edu.id, 'startDate', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">结束时间</label>
                        <input
                            placeholder="Jun 2024"
                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                            value={edu.endDate}
                            onChange={(e) => updateItem('education', edu.id, 'endDate', e.target.value)}
                        />
                    </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => addItem('education', {
              id: Date.now().toString(),
              school: '',
              degree: '',
              location: '',
              startDate: '',
              endDate: '',
              gpa: '',
              courses: ''
            })}
            className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-primary border border-dashed border-primary/50 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Plus size={16} /> 添加教育经历
          </button>
        </div>
      )}

      {/* Experience */}
      <SectionHeader title="实习/工作 (Experience)" id="experience" icon={Briefcase} />
      {activeSection === 'experience' && (
        <div className="p-5 space-y-6 bg-white animate-in slide-in-from-top-2 duration-200">
           {data.experience.map((exp) => (
            <div key={exp.id} className="relative p-4 border border-slate-200 rounded-xl bg-slate-50/50 hover:border-blue-200 transition-colors group">
              <button 
                onClick={() => removeItem('experience', exp.id)}
                className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                title="删除"
              >
                <Trash2 size={14} />
              </button>
              <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">公司/组织名称</label>
                    <input
                    placeholder="Company Name"
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-medium focus:border-primary outline-none"
                    value={exp.company}
                    onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">职位/角色</label>
                    <input
                    placeholder="Role Title"
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                    value={exp.role}
                    onChange={(e) => updateItem('experience', exp.id, 'role', e.target.value)}
                    />
                </div>
                 <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">开始时间</label>
                        <input
                            placeholder="Start Date"
                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                            value={exp.startDate}
                            onChange={(e) => updateItem('experience', exp.id, 'startDate', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">结束时间</label>
                        <input
                            placeholder="End Date"
                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                            value={exp.endDate}
                            onChange={(e) => updateItem('experience', exp.id, 'endDate', e.target.value)}
                        />
                    </div>
                </div>
                <div className="relative">
                    <label className="block text-xs font-medium text-slate-500 mb-1">具体内容 (Bullet Points)</label>
                    <textarea
                    placeholder="描述你的主要职责和成就 (支持中文，AI会自动翻译并润色)..."
                    className="w-full p-3 border border-slate-200 rounded-lg text-sm h-32 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                    value={exp.description}
                    onChange={(e) => updateItem('experience', exp.id, 'description', e.target.value)}
                    />
                     <PolishButton 
                        text={exp.description} 
                        type="experience" 
                        onApply={(val) => updateItem('experience', exp.id, 'description', val)} 
                     />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => addItem('experience', {
              id: Date.now().toString(),
              role: '',
              company: '',
              location: '',
              startDate: '',
              endDate: '',
              description: ''
            })}
            className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-primary border border-dashed border-primary/50 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Plus size={16} /> 添加实习/工作经历
          </button>
        </div>
      )}

      {/* Skills & Awards */}
      <SectionHeader title="技能 & 其他 (Skills & Others)" id="skills" icon={Code} />
      {activeSection === 'skills' && (
          <div className="p-5 space-y-5 bg-white animate-in slide-in-from-top-2 duration-200">
             <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">技能列表 (Skills)</label>
              <textarea
                className="w-full p-3 border border-slate-200 rounded-lg text-sm h-24 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                value={data.skills}
                onChange={(e) => onChange({...data, skills: e.target.value})}
                placeholder="Python, React, Data Analysis, Machine Learning..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">奖项 & 荣誉 (Awards)</label>
              <textarea
                className="w-full p-3 border border-slate-200 rounded-lg text-sm h-24 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                value={data.awards}
                onChange={(e) => onChange({...data, awards: e.target.value})}
                placeholder="Dean's List 2023, First Prize in Hackathon..."
              />
            </div>
          </div>
      )}
    </div>
  );
};