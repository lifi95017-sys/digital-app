import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Download, Search } from 'lucide-react';
import { Student } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import kbachBorder from '../assets/images/kbach_border_a4_1785113686250.jpg';
import logoWatermark from '../assets/images/moeys_logo_watermark_1785113704449.jpg';
import logoColor from '../assets/images/moeys_logo_color_1785113722843.jpg';

interface DigitalCertificateViewProps {
  onBack: () => void;
  students: Student[];
}

export default function DigitalCertificateView({ onBack, students }: DigitalCertificateViewProps) {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  
  // Certificate Fields
  const [ministry, setMinistry] = useState('ក្រសួងអប់រំ យុវជន និងកីឡា');
  const [schoolName, setSchoolName] = useState('សាលាបឋមសិក្សា.........................');
  const [certNo, setCertNo] = useState('.........................');
  
  const [studentName, setStudentName] = useState('សិត វ៉ាន់សេង');
  const [gender, setGender] = useState('ប្រុស');
  const [dob, setDob] = useState('១៧ កញ្ញា ២០០៥');
  const [grade, setGrade] = useState('៤ "ក"');
  
  const [average, setAverage] = useState('៩.៥០');
  const [rank, setRank] = useState('១');
  const [rating, setRating] = useState('ល្អ');
  const [academicYear, setAcademicYear] = useState('២០២៤-២០២៥');
  const [issueDateLine1, setIssueDateLine1] = useState('ថ្ងៃ................ខែ...................ឆ្នាំ.....................ស័ក ព.ស.២៥.......');
  const [issueDateLine2, setIssueDateLine2] = useState('.........................ថ្ងៃទី..............ខែ.................ឆ្នាំ២០............');
  
  const [principalName, setPrincipalName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  // Update fields when student is selected
  useEffect(() => {
    if (selectedStudentId) {
      const student = students.find(s => s.id === selectedStudentId);
      if (student) {
        setStudentName(student.name);
        setGender(student.gender === 'female' ? 'ស្រី' : 'ប្រុស');
        // Other fields could be mapped if they existed on the Student object
      }
    }
  }, [selectedStudentId, students]);

  const downloadCertificate = async (format: 'png' | 'pdf') => {
    if (!certificateRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3, 
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `ប័ណ្ណសរសើរ_${studentName || 'សិស្ស'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else if (format === 'pdf') {
        const imgData = canvas.toDataURL('image/png');
        // A4 landscape is 297 x 210 mm
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
        pdf.save(`ប័ណ្ណសរសើរ_${studentName || 'សិស្ស'}.pdf`);
      }
    } catch (error) {
      console.error('Failed to generate certificate:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 min-h-screen pb-20">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-medium border border-slate-200 shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
          ត្រឡប់ក្រោយ
        </button>
      </div>

      <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
        {/* Left Form */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
          <h2 className="text-xl font-black text-slate-800 khmer-font">ព័ត៌មានប័ណ្ណសរសើរ</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2 khmer-font">ជ្រើសរើសសិស្ស</label>
              <select 
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 font-khmer transition-all"
              >
                <option value="">-- បំពេញព័ត៌មានដោយខ្លួនឯង --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.gender === 'female' ? 'ស្រី' : 'ប្រុស'})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 khmer-font">ឈ្មោះសិស្ស</label>
                <input 
                  type="text" 
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 font-khmer" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 khmer-font">ភេទ</label>
                <select 
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 font-khmer"
                >
                  <option value="ប្រុស">ប្រុស</option>
                  <option value="ស្រី">ស្រី</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 khmer-font">ថ្ងៃខែឆ្នាំកំណើត</label>
                <input 
                  type="text" 
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 font-khmer" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 khmer-font">ថ្នាក់ទី</label>
                <input 
                  type="text" 
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 font-khmer" 
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 khmer-font">មធ្យមភាគ</label>
                <input 
                  type="text" 
                  value={average}
                  onChange={e => setAverage(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 font-khmer text-center" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 khmer-font">ចំណាត់ថ្នាក់</label>
                <input 
                  type="text" 
                  value={rank}
                  onChange={e => setRank(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 font-khmer text-center" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 khmer-font">និទ្ទេស</label>
                <input 
                  type="text" 
                  value={rating}
                  onChange={e => setRating(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 font-khmer text-center" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 khmer-font">ឆ្នាំសិក្សា</label>
              <input 
                type="text" 
                value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 font-khmer" 
              />
            </div>

            
            <div className="border-t border-slate-100 pt-4 mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 khmer-font">កាលបរិច្ឆេទទី១ (ព.ស)</label>
                <input 
                  type="text" 
                  value={issueDateLine1}
                  onChange={e => setIssueDateLine1(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 font-khmer" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 khmer-font">កាលបរិច្ឆេទទី២ (គ.ស)</label>
                <input 
                  type="text" 
                  value={issueDateLine2}
                  onChange={e => setIssueDateLine2(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 font-khmer" 
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 khmer-font">ឈ្មោះសាលា</label>
                <input 
                  type="text" 
                  value={schoolName}
                  onChange={e => setSchoolName(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 font-khmer" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 khmer-font">លេខប័ណ្ណសរសើរ</label>
                <input 
                  type="text" 
                  value={certNo}
                  onChange={e => setCertNo(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 font-khmer" 
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => downloadCertificate('png')}
              disabled={isGenerating}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black khmer-font text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-5 h-5" />}
              ទាញយក (PNG)
            </button>
            <button 
              onClick={() => downloadCertificate('pdf')}
              disabled={isGenerating}
              className="flex-1 bg-rose-600 text-white py-4 rounded-2xl font-black khmer-font text-lg shadow-xl shadow-rose-100 hover:bg-rose-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-5 h-5" />}
              ទាញយក (PDF)
            </button>
          </div>
        </div>

        {/* Right Preview */}
        <div className="sticky top-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Certificate Canvas Container A4 Landscape (297x210) aspect ratio 1.414 */}
          <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
            <div 
              ref={certificateRef}
              className="bg-white mx-auto relative select-none"
              style={{ 
                width: '1122px', 
                height: '793px',
                // transform: 'scale(0.7)',
                // transformOrigin: 'top left'
              }}
            >
              {/* Outer Kbach Border */}
              <div 
                className="absolute inset-0 z-0 opacity-90"
                style={{
                  backgroundImage: `url(${kbachBorder})`,
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  mixBlendMode: 'multiply'
                }}
              />
              
              {/* Green Inner Border Line */}
              <div className="absolute top-[80px] bottom-[80px] left-[80px] right-[80px] border-4 border-green-600 z-10" />
              <div className="absolute top-[85px] bottom-[85px] left-[85px] right-[85px] border-2 border-green-600 z-10" />

              {/* Watermark */}
              <div 
                className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.12]"
                style={{ mixBlendMode: 'multiply' }}
              >
                <img src={logoWatermark} alt="Watermark" className="w-[400px] h-[400px] object-contain" />
              </div>

              {/* Top Left Header */}
              <div className="absolute top-[100px] left-[100px] z-20 flex flex-col items-center">
                <img src={logoColor} alt="Logo" className="w-24 h-24 object-contain mb-2 mix-blend-multiply" />
                <h2 className="text-xl font-black text-slate-800 khmer-font">{ministry}</h2>
                <h3 className="text-lg font-bold text-green-700 khmer-font mt-1">{schoolName}</h3>
                <h3 className="text-base font-bold text-slate-700 khmer-font mt-1">លេខ.............................................</h3>
              </div>

              {/* Top Right Header */}
              <div className="absolute top-[100px] right-[100px] z-20 flex flex-col items-center text-blue-700">
                <h1 className="text-3xl font-black khmer-font">ព្រះរាជាណាចក្រកម្ពុជា</h1>
                <h2 className="text-2xl font-bold khmer-font mt-2">ជាតិ សាសនា ព្រះមហាក្សត្រ</h2>
                <p className="text-xl mt-1">❧⸻ ♱ ⸻☙</p>
              </div>

              {/* Main Title */}
              <div className="absolute top-[280px] w-full z-20 flex flex-col items-center">
                <h1 className="text-6xl font-black text-red-600 khmer-font tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
                  ប័ណ្ណសរសើរ
                </h1>
                <h3 className="text-2xl font-bold text-slate-800 khmer-font mt-6">
                  នាយក{schoolName}
                </h3>
              </div>

              {/* Body Content */}
              <div className="absolute top-[420px] left-[120px] z-20 space-y-4">
                <div className="flex items-end gap-2 text-xl khmer-font">
                  <span className="text-slate-800">សូមសរសើរចំពោះសិស្សឈ្មោះ៖</span>
                  <span className="font-black text-blue-700 text-2xl px-4">{studentName}</span>
                  <span className="text-slate-800">ភេទ</span>
                  <span className="font-black text-blue-700 px-4">{gender}</span>
                </div>
                <div className="flex items-end gap-2 text-xl khmer-font">
                  <span className="text-slate-800">ជាសិស្សរៀនថ្នាក់ទី</span>
                  <span className="font-black text-blue-700 px-2">{grade}</span>
                  <span className="text-slate-800">នៃ{schoolName}</span>
                </div>
                <div className="flex items-end gap-2 text-xl khmer-font">
                  <span className="text-slate-800">ដែលទទួលបានមធ្យមភាគ</span>
                  <span className="font-black text-blue-700 text-2xl px-2">{average}</span>
                </div>
              </div>

              {/* Rank Badge */}
              <div className="absolute top-[520px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                <h4 className="text-2xl font-black text-green-600 khmer-font mb-2">ចំណាត់ថ្នាក់</h4>
                <div className="w-32 h-32 rounded-full border-4 border-amber-600 bg-white flex items-center justify-center shadow-lg relative">
                  <div className="absolute inset-2 border-2 border-amber-400 rounded-full" />
                  <span className="text-6xl font-black text-red-600 khmer-font relative z-10" style={{ textShadow: '2px 2px 0px rgba(255,200,0,0.5)' }}>{rank}</span>
                </div>
              </div>

              {/* Right Side Details */}
              <div className="absolute top-[420px] right-[120px] z-20 space-y-4 text-xl khmer-font">
                <div className="flex gap-2">
                  <span className="text-slate-800">ថ្ងៃខែឆ្នាំកំណើត</span>
                  <span className="font-black text-blue-700">{dob}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-800">ប្រចាំឆ្នាំសិក្សា</span>
                  <span className="font-black text-blue-700">{academicYear}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-800">និទ្ទេស</span>
                  <span className="font-black text-red-600 text-2xl">{rating}</span>
                  <span>។</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="absolute bottom-[100px] left-[140px] z-20 text-center">
                <p className="text-base khmer-font text-slate-700">{issueDateLine1}</p>
                <p className="text-base khmer-font text-slate-700 mt-1">{issueDateLine2}</p>
                <h4 className="text-xl font-black khmer-font mt-4 text-slate-900">នាយកសាលា</h4>
              </div>

              <div className="absolute bottom-[100px] right-[140px] z-20 text-center">
                <p className="text-base khmer-font text-slate-700">{issueDateLine1}</p>
                <p className="text-base khmer-font text-slate-700 mt-1">{issueDateLine2}</p>
                <h4 className="text-xl font-black khmer-font mt-4 text-slate-900">គ្រូបន្ទុកថ្នាក់</h4>
              </div>

            </div>
          </div>
          
          <div className="p-4 bg-amber-50 border-t border-amber-100 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0">
               <span className="text-amber-700 font-bold">!</span>
             </div>
             <p className="text-sm font-medium text-amber-800 khmer-font">
               អ្នកអាចទាញយកប័ណ្ណសរសើរនេះជាទម្រង់រូបភាព PNG ឬឯកសារ PDF (ទំហំ A4 Landscape គុណភាពខ្ពស់) សម្រាប់ព្រីន។
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
