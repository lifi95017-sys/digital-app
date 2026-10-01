const fs = require('fs');
const file = 'src/components/WorksheetModal.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import html2pdf from 'html2pdf.js';")) {
  content = content.replace("import remarkGfm from 'remark-gfm';", "import remarkGfm from 'remark-gfm';\nimport html2pdf from 'html2pdf.js';");
}

if (!content.includes("const [isDownloading, setIsDownloading] = useState(false);")) {
  content = content.replace("const [hasGenerated, setHasGenerated] = useState(false);", "const [hasGenerated, setHasGenerated] = useState(false);\n  const [isDownloading, setIsDownloading] = useState(false);");
}

const downloadFunc = `
  const handleDownloadPDF = () => {
    setIsDownloading(true);
    const element = document.getElementById('worksheet-content');
    if (!element) return;
    
    // Add print styling temporarily
    const originalClass = element.className;
    element.className = "bg-white w-full max-w-[210mm] min-h-[297mm] mx-auto p-[1cm] sm:p-[1.5cm] text-[11pt] leading-relaxed text-slate-800 font-khmer";
    
    const opt = {
      margin:       10,
      filename:     \`\${type === 'student' ? 'សន្លឹកកិច្ចការសិស្ស' : 'សន្លឹកកិច្ចការគ្រូ'}_\${plan.lessonTitle}.pdf\`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        setIsDownloading(false);
        element.className = originalClass;
    }).catch(err => {
        console.error("PDF generation failed:", err);
        setIsDownloading(false);
        element.className = originalClass;
        alert('មានបញ្ហាក្នុងការទាញយក PDF។');
    });
  };
`;

if (!content.includes("handleDownloadPDF")) {
  content = content.replace("const handleExportWord", downloadFunc + "\n  const handleExportWord");
}

content = content.replace("onClick={() => window.print()}", "onClick={handleDownloadPDF}");
content = content.replace("disabled={isLoading || !content}", "disabled={isLoading || !content || isDownloading}");
content = content.replace("<Printer className=\"w-4 h-4\" /> ទាញយក PDF", "{isDownloading ? <Loader2 className=\"w-4 h-4 animate-spin\" /> : <Printer className=\"w-4 h-4\" />} {isDownloading ? 'កំពុងទាញយក...' : 'ទាញយក PDF'}");

fs.writeFileSync(file, content);
