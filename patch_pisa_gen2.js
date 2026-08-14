import fs from 'fs';
let content = fs.readFileSync('src/components/PisaTestView.tsx', 'utf8');

const additionalStates = `
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [viewingFile, setViewingFile] = useState<LibraryFile | null>(null);
  
  const contentRef = useRef<HTMLDivElement>(null);

  const handleGeneratePisa = async () => {
    if (!selectedLesson) return;
    setIsGenerating(true);
    setShowGenerateModal(true);
    setGeneratedText('');
    
    try {
      const response = await fetch('/api/generatePisaTest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lesson: selectedLesson,
          grade: activeGrade,
          subject: 'វិទ្យាសាស្ត្រ'
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setGeneratedText(data.text);
      } else {
        setGeneratedText('សូមអភ័យទោស មានបញ្ហាក្នុងការបង្កើតតេស្ត PISA៖ ' + (data.error || ''));
      }
    } catch (err) {
      setGeneratedText('សូមអភ័យទោស មានបញ្ហាក្នុងការបង្កើតតេស្ត PISA។');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveGeneratedTest = () => {
    if (!generatedText) return;
    const newFile: LibraryFile = {
      id: Date.now().toString(),
      title: \`តេស្ត PISA: \${selectedLesson}\`,
      grade: activeGrade,
      subject: 'វិទ្យាសាស្ត្រ',
      date: new Date().toLocaleDateString('en-GB'),
      fileName: \`PISA_Test_\${selectedLesson}.doc\`,
      fileData: 'markdown:' + generatedText
    };
    onSaveFile(newFile);
    setShowGenerateModal(false);
  };
  
  const exportToWord = (htmlContent: string, fileName: string) => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + "<div style='font-family: Khmer OS Siemreap, Arial; font-size: 14pt; line-height: 1.5;'>" + htmlContent + "</div>" + footer;
    const blob = new Blob(['\\ufeff', sourceHTML], { type: 'application/msword' });
    saveAs(blob, fileName);
  };

  const handleDownloadWord = () => {
    if (contentRef.current) {
      exportToWord(contentRef.current.innerHTML, \`PISA_\${selectedLesson}.doc\`);
    }
  };
`;

content = content.replace("  const toggleChapter = (chapter: string) => {", additionalStates + "\n  const toggleChapter = (chapter: string) => {");

fs.writeFileSync('src/components/PisaTestView.tsx', content);
