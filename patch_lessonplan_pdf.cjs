const fs = require('fs');
let file = 'src/components/LessonPlanForm.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import html2pdf from 'html2pdf.js';")) {
  content = content.replace("import remarkGfm from 'remark-gfm';", "import remarkGfm from 'remark-gfm';\n// @ts-ignore\nimport html2pdf from 'html2pdf.js';");
}

if (!content.includes("const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);")) {
  content = content.replace("const [showGlossary, setShowGlossary] = useState(false);", "const [showGlossary, setShowGlossary] = useState(false);\n  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);");
}

const downloadFunc = `
  const handleDownloadPDF = () => {
    setIsDownloadingPdf(true);
    const element = document.getElementById('lesson-plan-preview');
    if (!element) return;
    
    // Add print styling temporarily
    const originalClass = element.className;
    element.className = "bg-white px-[1.5cm] py-[1.5cm] rounded flex flex-col shadow-xl min-h-[297mm] w-[210mm] text-[11pt] leading-relaxed text-slate-800 font-khmer mx-auto";
    
    // hide elements
    const hiddenElements = element.querySelectorAll('.print\\\\:hidden');
    hiddenElements.forEach(el => el.classList.add('hidden'));

    const opt = {
      margin:       10,
      filename:     \`កិច្ចតែងការ_\${plan.lessonTitle}.pdf\`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        setIsDownloadingPdf(false);
        element.className = originalClass;
        hiddenElements.forEach(el => el.classList.remove('hidden'));
    }).catch(err => {
        console.error("PDF generation failed:", err);
        setIsDownloadingPdf(false);
        element.className = originalClass;
        hiddenElements.forEach(el => el.classList.remove('hidden'));
        alert('មានបញ្ហាក្នុងការទាញយក PDF។');
    });
  };
`;

if (!content.includes("handleDownloadPDF")) {
  content = content.replace("const handleExportWord", downloadFunc + "\n  const handleExportWord");
}

content = content.replace("onClick={() => window.print()}", "onClick={handleDownloadPDF}");
content = content.replace("<Download className=\"w-5 h-5\" /> ទាញយកជា PDF", "{isDownloadingPdf ? <Loader2 className=\"w-5 h-5 animate-spin\" /> : <Download className=\"w-5 h-5\" />} {isDownloadingPdf ? 'កំពុងទាញយក...' : 'ទាញយកជា PDF'}");
content = content.replace("disabled={isGenerating}", "disabled={isGenerating || isDownloadingPdf}");

fs.writeFileSync(file, content);


file = 'src/components/SecondaryLessonPlanForm.tsx';
content = fs.readFileSync(file, 'utf8');

if (!content.includes("import html2pdf from 'html2pdf.js';")) {
  content = content.replace("import remarkGfm from 'remark-gfm';", "import remarkGfm from 'remark-gfm';\n// @ts-ignore\nimport html2pdf from 'html2pdf.js';");
}

if (!content.includes("const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);")) {
  content = content.replace("const [showGlossary, setShowGlossary] = useState(false);", "const [showGlossary, setShowGlossary] = useState(false);\n  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);");
}

if (!content.includes("handleDownloadPDF")) {
  content = content.replace("const handleExportWord", downloadFunc + "\n  const handleExportWord");
}

content = content.replace("onClick={() => window.print()}", "onClick={handleDownloadPDF}");
content = content.replace("<Download className=\"w-5 h-5\" /> ទាញយកជា PDF", "{isDownloadingPdf ? <Loader2 className=\"w-5 h-5 animate-spin\" /> : <Download className=\"w-5 h-5\" />} {isDownloadingPdf ? 'កំពុងទាញយក...' : 'ទាញយកជា PDF'}");
content = content.replace("disabled={isGenerating}", "disabled={isGenerating || isDownloadingPdf}");

fs.writeFileSync(file, content);
