import React, { useState, useEffect, useRef } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { ResumeData, TemplateType, PolishRequest } from './types';
import { polishContent } from './services/gemini';
import { Download, Printer, LayoutTemplate, Wand2, FileText } from 'lucide-react';

const INITIAL_DATA: ResumeData = {
  personalInfo: {
    fullName: 'Alex Chen',
    email: 'alex.chen@example.com',
    phone: '+86 138 0000 0000',
    linkedin: 'linkedin.com/in/alexchen',
    website: '',
    summary: 'Aspiring Data Scientist with a strong foundation in mathematics and computer science. Passionate about using machine learning to solve real-world problems.',
  },
  education: [
    {
      id: '1',
      school: 'Peking University',
      degree: 'B.S. in Computer Science',
      location: 'Beijing, China',
      startDate: 'Sep 2020',
      endDate: 'Jun 2024',
      gpa: '3.8/4.0',
      courses: 'Algorithms, Data Structures, Machine Learning'
    }
  ],
  experience: [
    {
      id: '1',
      role: 'Research Assistant',
      company: 'AI Lab, PKU',
      location: 'Beijing',
      startDate: 'Jun 2023',
      endDate: 'Present',
      description: 'Assisted in developing NLP models. cleaned large datasets using Python pandas. Wrote reports for weekly meetings.'
    }
  ],
  projects: [],
  skills: 'Python, Java, PyTorch, React, SQL, English (TOEFL 110)',
  awards: 'National Scholarship 2022'
};

export default function App() {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [template, setTemplate] = useState<TemplateType>('classic');
  const [scale, setScale] = useState(0.8);
  const [isPolishing, setIsPolishing] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Adjust scale based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.offsetWidth;
        // 210mm is approx 794px. Add padding buffer.
        const targetScale = Math.min(0.9, (containerWidth - 40) / 794); 
        setScale(targetScale < 0.4 ? 0.4 : targetScale);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Init
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePolish = async (req: PolishRequest, callback: (newText: string) => void) => {
    if (!process.env.API_KEY) {
        alert("未检测到 API Key。请确保环境变量 process.env.API_KEY 已设置。");
        return;
    }
    setIsPolishing(true);
    try {
      const result = await polishContent(req);
      callback(result);
    } catch (error) {
      alert("AI 润色失败，请检查控制台日志。");
    } finally {
      setIsPolishing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const templateLabels: Record<TemplateType, string> = {
      classic: "经典 (Classic)",
      modern: "现代 (Modern)",
      minimalist: "极简 (Minimalist)"
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-white border-b flex items-center justify-between px-6 shrink-0 z-20 no-print shadow-sm">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <FileText />
          <span>CV GenAI <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-1">留学版</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            {(['classic', 'modern', 'minimalist'] as TemplateType[]).map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  template === t 
                    ? 'bg-white text-primary shadow-sm font-medium' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {templateLabels[t]}
              </button>
            ))}
          </div>

          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all shadow-sm hover:shadow active:translate-y-0.5"
          >
            <Download size={16} />
            <span className="hidden sm:inline">导出 PDF</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: Editor */}
        <div className="w-full md:w-[450px] lg:w-[520px] flex-shrink-0 h-full bg-white border-r z-10 no-print shadow-xl md:shadow-none">
          <Editor 
            data={data} 
            onChange={setData} 
            onPolish={handlePolish} 
            isPolishing={isPolishing}
          />
        </div>

        {/* Right: Preview */}
        <div 
            ref={previewContainerRef}
            className="flex-1 bg-slate-100/50 overflow-y-auto relative print:overflow-visible print-container"
        >
            <div className="min-h-full flex flex-col items-center justify-start pt-8 pb-20 print:p-0 print:block">
                <div className="print:hidden text-slate-400 text-xs mb-4 font-mono flex items-center gap-2">
                   <span>A4 预览模式</span> • <span>实时更新</span>
                </div>
                <Preview data={data} template={template} scale={scale} />
            </div>
        </div>
      </div>
      
      {/* Polishing Overlay */}
      {isPolishing && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center no-print backdrop-blur-sm transition-all">
             <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center animate-bounce-subtle">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                    <Wand2 className="text-primary w-10 h-10 relative z-10 animate-spin-slow" />
                </div>
                <p className="font-medium text-slate-800 mt-4">AI 正在润色您的简历...</p>
                <p className="text-xs text-slate-500 mt-1">Translating & Polishing</p>
             </div>
        </div>
      )}
    </div>
  );
}