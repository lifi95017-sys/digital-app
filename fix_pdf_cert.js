import fs from 'fs';
let code = fs.readFileSync('src/components/DigitalCertificateView.tsx', 'utf8');

// 1. Add jsPDF import
code = code.replace(
  "import html2canvas from 'html2canvas';",
  "import html2canvas from 'html2canvas';\nimport { jsPDF } from 'jspdf';"
);

// 2. Replace downloadCertificate with a formatted version
const oldDownload = `  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3, 
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = \`ប័ណ្ណសរសើរ_\${studentName || 'សិស្ស'}.png\`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate certificate:', error);
    } finally {
      setIsGenerating(false);
    }
  };`;

const newDownload = `  const downloadCertificate = async (format: 'png' | 'pdf') => {
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
        link.download = \`ប័ណ្ណសរសើរ_\${studentName || 'សិស្ស'}.png\`;
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
        pdf.save(\`ប័ណ្ណសរសើរ_\${studentName || 'សិស្ស'}.pdf\`);
      }
    } catch (error) {
      console.error('Failed to generate certificate:', error);
    } finally {
      setIsGenerating(false);
    }
  };`;

code = code.replace(oldDownload, newDownload);

// 3. Replace the single download button with two buttons
const oldButtons = `<button 
            onClick={downloadCertificate}
            disabled={isGenerating}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black khmer-font text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
          >
            {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-5 h-5" />}
            ទាញយក (PNG)
          </button>`;

const newButtons = `<div className="flex gap-4">
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
          </div>`;

code = code.replace(oldButtons, newButtons);

// 4. Fix bottom hint text
code = code.replace(
  'អ្នកអាចទាញយកប័ណ្ណសរសើរនេះជាទម្រង់រូបភាព PNG (ទំហំ A4 Landscape គុណភាពខ្ពស់) សម្រាប់ព្រីន។',
  'អ្នកអាចទាញយកប័ណ្ណសរសើរនេះជាទម្រង់រូបភាព PNG ឬឯកសារ PDF (ទំហំ A4 Landscape គុណភាពខ្ពស់) សម្រាប់ព្រីន។'
);

fs.writeFileSync('src/components/DigitalCertificateView.tsx', code);
